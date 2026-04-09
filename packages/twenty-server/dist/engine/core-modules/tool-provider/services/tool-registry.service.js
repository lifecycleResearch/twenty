"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ToolRegistryService", {
    enumerable: true,
    get: function() {
        return ToolRegistryService;
    }
});
const _common = require("@nestjs/common");
const _ai = require("ai");
const _toolproviderstoken = require("../constants/tool-providers.token");
const _toolcategoryenum = require("../enums/tool-category.enum");
const _compacttooloutpututil = require("../output-serialization/compact-tool-output.util");
const _nativemodeltoolprovider = require("../providers/native-model-tool.provider");
const _toolexecutorservice = require("./tool-executor.service");
const _toolerrorutil = require("../utils/tool-error.util");
const _wraptoolforexecutionutil = require("../../tool/utils/wrap-tool-for-execution.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let ToolRegistryService = class ToolRegistryService {
    // Returns ToolIndexEntry[] (lightweight, no schemas).
    // Underlying data (metadata, permissions) is already cached by WorkspaceCacheService.
    // Providers run in parallel since they are independent.
    async getCatalog(context) {
        const results = await Promise.all(this.providers.map(async (provider)=>{
            if (await provider.isAvailable(context)) {
                return provider.generateDescriptors(context, {
                    includeSchemas: false
                });
            }
            return [];
        }));
        return results.flat();
    }
    // On-demand schema generation for specific tools
    async resolveSchemas(toolNames, context) {
        const index = await this.getCatalog(context);
        const nameSet = new Set(toolNames);
        const matchingEntries = index.filter((entry)=>nameSet.has(entry.name));
        // Group matching entries by provider category
        const byCategory = new Map();
        for (const entry of matchingEntries){
            const existing = byCategory.get(entry.category) ?? [];
            existing.push(entry);
            byCategory.set(entry.category, existing);
        }
        const schemas = new Map();
        for (const [category, entries] of byCategory){
            const provider = this.providers.find((providerItem)=>providerItem.category === category);
            if (!provider) {
                continue;
            }
            const fullDescriptors = await provider.generateDescriptors(context, {
                includeSchemas: true
            });
            const entryNameSet = new Set(entries.map((entry)=>entry.name));
            for (const descriptor of fullDescriptors){
                if (entryNameSet.has(descriptor.name) && 'inputSchema' in descriptor && descriptor.inputSchema) {
                    schemas.set(descriptor.name, descriptor.inputSchema);
                }
            }
        }
        return schemas;
    }
    // Hydrate ToolDescriptor[] into an AI SDK ToolSet with thin dispatch closures
    hydrateToolSet(descriptors, context, options) {
        const toolSet = {};
        for (const descriptor of descriptors){
            const schemaWithLoading = (0, _wraptoolforexecutionutil.wrapJsonSchemaForExecution)(descriptor.inputSchema);
            const executeFn = async (args)=>this.toolExecutorService.dispatch(descriptor, args, context);
            toolSet[descriptor.name] = {
                description: descriptor.description,
                inputSchema: (0, _ai.jsonSchema)(schemaWithLoading),
                execute: options?.wrapWithErrorContext ? (0, _toolerrorutil.wrapWithErrorHandler)(descriptor.name, executeFn) : executeFn
            };
        }
        return toolSet;
    }
    async buildToolIndex(workspaceId, roleId, options) {
        const context = this.buildContextFromToolContext({
            workspaceId,
            roleId,
            userId: options?.userId,
            userWorkspaceId: options?.userWorkspaceId
        });
        return this.getCatalog(context);
    }
    async getToolsByName(names, context) {
        const fullContext = this.buildContextFromToolContext(context);
        const index = await this.getCatalog(fullContext);
        const nameSet = new Set(names);
        const matchingEntries = index.filter((entry)=>nameSet.has(entry.name));
        const schemas = await this.resolveSchemas(names, fullContext);
        const descriptors = matchingEntries.filter((entry)=>schemas.has(entry.name)).map((entry)=>({
                ...entry,
                inputSchema: schemas.get(entry.name)
            }));
        return this.hydrateToolSet(descriptors, fullContext);
    }
    async getToolInfo(names, context, aspects = [
        'description',
        'schema'
    ]) {
        const fullContext = this.buildContextFromToolContext(context);
        const index = await this.getCatalog(fullContext);
        const nameSet = new Set(names);
        const matchingEntries = index.filter((entry)=>nameSet.has(entry.name));
        let schemas;
        if (aspects.includes('schema')) {
            schemas = await this.resolveSchemas(names, fullContext);
        }
        return matchingEntries.map((entry)=>{
            const info = {
                name: entry.name
            };
            if (aspects.includes('description')) {
                info.description = entry.description;
            }
            if (aspects.includes('schema') && schemas) {
                info.inputSchema = schemas.get(entry.name);
            }
            return info;
        });
    }
    async resolveAndExecute(toolName, args, context, _options) {
        try {
            const fullContext = this.buildContextFromToolContext(context);
            const index = await this.getCatalog(fullContext);
            const entry = index.find((indexEntry)=>indexEntry.name === toolName);
            if (!entry) {
                return {
                    toolName,
                    error: {
                        message: `Tool "${toolName}" not found. Check the tool catalog for correct names.`,
                        suggestion: 'Use learn_tools to discover available tools and their correct names.'
                    }
                };
            }
            const result = await this.toolExecutorService.dispatch(entry, args, fullContext);
            return {
                toolName,
                result: (0, _compacttooloutpututil.compactToolOutput)(result)
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error executing tool "${toolName}": ${errorMessage}`);
            return {
                toolName,
                error: {
                    message: errorMessage,
                    suggestion: (0, _toolerrorutil.generateErrorSuggestion)(toolName, errorMessage)
                }
            };
        }
    }
    // Eager loading tools by categories (MCP, workflow agent).
    // These paths need full schemas, so generate with includeSchemas: true.
    async getToolsByCategories(context, options = {}) {
        const { categories, excludeTools, wrapWithErrorContext } = options;
        const categorySet = categories ? new Set(categories) : undefined;
        const results = await Promise.all(this.providers.filter((provider)=>!categorySet || categorySet.has(provider.category)).map(async (provider)=>{
            if (await provider.isAvailable(context)) {
                return provider.generateDescriptors(context, {
                    includeSchemas: true
                });
            }
            return [];
        }));
        const descriptors = results.flat();
        let filteredDescriptors = descriptors;
        if (excludeTools?.length) {
            const excludeSet = new Set(excludeTools);
            filteredDescriptors = filteredDescriptors.filter((descriptor)=>!excludeSet.has(descriptor.name));
        }
        const toolSet = this.hydrateToolSet(filteredDescriptors, context, {
            wrapWithErrorContext
        });
        if (categories?.includes(_toolcategoryenum.ToolCategory.NATIVE_MODEL)) {
            if (await this.nativeModelToolProvider.isAvailable(context)) {
                const nativeTools = await this.nativeModelToolProvider.generateTools(context);
                Object.assign(toolSet, nativeTools);
            }
        }
        this.logger.log(`Generated ${Object.keys(toolSet).length} tools for categories: [${categories?.join(', ') ?? 'all'}]`);
        return toolSet;
    }
    buildContextFromToolContext(context) {
        const rolePermissionConfig = {
            unionOf: [
                context.roleId
            ]
        };
        return {
            workspaceId: context.workspaceId,
            roleId: context.roleId,
            rolePermissionConfig,
            authContext: context.authContext,
            userId: context.userId,
            userWorkspaceId: context.userWorkspaceId,
            onCodeExecutionUpdate: context.onCodeExecutionUpdate
        };
    }
    constructor(providers, nativeModelToolProvider, toolExecutorService){
        this.providers = providers;
        this.nativeModelToolProvider = nativeModelToolProvider;
        this.toolExecutorService = toolExecutorService;
        this.logger = new _common.Logger(ToolRegistryService.name);
    }
};
ToolRegistryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _common.Inject)(_toolproviderstoken.TOOL_PROVIDERS)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Array,
        typeof _nativemodeltoolprovider.NativeModelToolProvider === "undefined" ? Object : _nativemodeltoolprovider.NativeModelToolProvider,
        typeof _toolexecutorservice.ToolExecutorService === "undefined" ? Object : _toolexecutorservice.ToolExecutorService
    ])
], ToolRegistryService);

//# sourceMappingURL=tool-registry.service.js.map
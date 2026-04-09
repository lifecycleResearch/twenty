"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommonArgsProcessors", {
    enumerable: true,
    get: function() {
        return CommonArgsProcessors;
    }
});
const _dataargprocessorservice = require("./data-arg-processor/data-arg-processor.service");
const _filterargprocessorservice = require("./filter-arg-processor/filter-arg-processor.service");
const _queryrunnerargsfactory = require("./query-runner-args.factory");
const CommonArgsProcessors = [
    _dataargprocessorservice.DataArgProcessorService,
    _filterargprocessorservice.FilterArgProcessorService,
    _queryrunnerargsfactory.QueryRunnerArgsFactory
]; // TODO: Refacto-common Remove QueryRunnerArgsFactory

//# sourceMappingURL=common-args-processors.js.map
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get OnboardingService () {
        return OnboardingService;
    },
    get OnboardingStepKeys () {
        return OnboardingStepKeys;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _billingservice = require("../billing/services/billing.service");
const _onboardingstatusenum = require("./enums/onboarding-status.enum");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _uservarsservice = require("../user/user-vars/services/user-vars.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
var OnboardingStepKeys = /*#__PURE__*/ function(OnboardingStepKeys) {
    OnboardingStepKeys["ONBOARDING_CONNECT_ACCOUNT_PENDING"] = "ONBOARDING_CONNECT_ACCOUNT_PENDING";
    OnboardingStepKeys["ONBOARDING_INVITE_TEAM_PENDING"] = "ONBOARDING_INVITE_TEAM_PENDING";
    OnboardingStepKeys["ONBOARDING_CREATE_PROFILE_PENDING"] = "ONBOARDING_CREATE_PROFILE_PENDING";
    OnboardingStepKeys["ONBOARDING_BOOK_ONBOARDING_PENDING"] = "ONBOARDING_BOOK_ONBOARDING_PENDING";
    return OnboardingStepKeys;
}({});
let OnboardingService = class OnboardingService {
    isWorkspaceActivationPending(workspace) {
        return workspace.activationStatus === _workspace.WorkspaceActivationStatus.PENDING_CREATION;
    }
    async getOnboardingStatus(user, workspace) {
        if (await this.billingService.isSubscriptionIncompleteOnboardingStatus(workspace.id)) {
            return _onboardingstatusenum.OnboardingStatus.PLAN_REQUIRED;
        }
        if (this.isWorkspaceActivationPending(workspace)) {
            return _onboardingstatusenum.OnboardingStatus.WORKSPACE_ACTIVATION;
        }
        const userVars = await this.userVarsService.getAll({
            userId: user.id,
            workspaceId: workspace.id
        });
        const isProfileCreationPending = userVars.get("ONBOARDING_CREATE_PROFILE_PENDING") === true;
        const isConnectAccountPending = userVars.get("ONBOARDING_CONNECT_ACCOUNT_PENDING") === true;
        const isInviteTeamPending = userVars.get("ONBOARDING_INVITE_TEAM_PENDING") === true;
        const isBookOnboardingPending = userVars.get("ONBOARDING_BOOK_ONBOARDING_PENDING") === true;
        if (isProfileCreationPending) {
            return _onboardingstatusenum.OnboardingStatus.PROFILE_CREATION;
        }
        if (isConnectAccountPending) {
            return _onboardingstatusenum.OnboardingStatus.SYNC_EMAIL;
        }
        if (isInviteTeamPending) {
            return _onboardingstatusenum.OnboardingStatus.INVITE_TEAM;
        }
        if (isBookOnboardingPending) {
            const calendarBookingPageId = this.twentyConfigService.get('CALENDAR_BOOKING_PAGE_ID');
            const isBookingConfigured = (0, _utils.isDefined)(calendarBookingPageId) && (0, _guards.isNonEmptyString)(calendarBookingPageId);
            if (!isBookingConfigured) {
                await this.userVarsService.delete({
                    workspaceId: workspace.id,
                    key: "ONBOARDING_BOOK_ONBOARDING_PENDING"
                });
                return _onboardingstatusenum.OnboardingStatus.COMPLETED;
            }
            return _onboardingstatusenum.OnboardingStatus.BOOK_ONBOARDING;
        }
        return _onboardingstatusenum.OnboardingStatus.COMPLETED;
    }
    async setOnboardingConnectAccountPending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_CONNECT_ACCOUNT_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId: workspaceId,
            key: "ONBOARDING_CONNECT_ACCOUNT_PENDING",
            value: true
        }, queryRunner);
    }
    async setOnboardingInviteTeamPending({ workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                workspaceId,
                key: "ONBOARDING_INVITE_TEAM_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            workspaceId,
            key: "ONBOARDING_INVITE_TEAM_PENDING",
            value: true
        }, queryRunner);
    }
    async setOnboardingCreateProfilePending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_CREATE_PROFILE_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId,
            key: "ONBOARDING_CREATE_PROFILE_PENDING",
            value: true
        }, queryRunner);
    }
    async setOnboardingBookOnboardingPending({ workspaceId, value }) {
        const calendarBookingPageId = this.twentyConfigService.get('CALENDAR_BOOKING_PAGE_ID');
        const isBookingConfigured = (0, _utils.isDefined)(calendarBookingPageId) && (0, _guards.isNonEmptyString)(calendarBookingPageId);
        if (!value || !isBookingConfigured) {
            await this.userVarsService.delete({
                workspaceId,
                key: "ONBOARDING_BOOK_ONBOARDING_PENDING"
            });
            return;
        }
        await this.userVarsService.set({
            workspaceId,
            key: "ONBOARDING_BOOK_ONBOARDING_PENDING",
            value: true
        });
    }
    constructor(billingService, userVarsService, twentyConfigService){
        this.billingService = billingService;
        this.userVarsService = userVarsService;
        this.twentyConfigService = twentyConfigService;
    }
};
OnboardingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _uservarsservice.UserVarsService === "undefined" ? Object : _uservarsservice.UserVarsService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], OnboardingService);

//# sourceMappingURL=onboarding.service.js.map
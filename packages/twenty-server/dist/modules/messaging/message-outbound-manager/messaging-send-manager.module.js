"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessagingSendManagerModule", {
    enumerable: true,
    get: function() {
        return MessagingSendManagerModule;
    }
});
const _common = require("@nestjs/common");
const _oauth2clientmanagermodule = require("../../connected-account/oauth2-client-manager/oauth2-client-manager.module");
const _messagingimapdrivermodule = require("../message-import-manager/drivers/imap/messaging-imap-driver.module");
const _messagingsmtpdrivermodule = require("../message-import-manager/drivers/smtp/messaging-smtp-driver.module");
const _gmailmessageoutboundservice = require("./drivers/gmail/services/gmail-message-outbound.service");
const _imapsmtpmessageoutboundservice = require("./drivers/imap/services/imap-smtp-message-outbound.service");
const _microsoftmessageoutboundservice = require("./drivers/microsoft/services/microsoft-message-outbound.service");
const _messagingmessageoutboundservice = require("./services/messaging-message-outbound.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessagingSendManagerModule = class MessagingSendManagerModule {
};
MessagingSendManagerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _oauth2clientmanagermodule.OAuth2ClientManagerModule,
            _messagingimapdrivermodule.MessagingIMAPDriverModule,
            _messagingsmtpdrivermodule.MessagingSmtpDriverModule
        ],
        providers: [
            _gmailmessageoutboundservice.GmailMessageOutboundService,
            _microsoftmessageoutboundservice.MicrosoftMessageOutboundService,
            _imapsmtpmessageoutboundservice.ImapSmtpMessageOutboundService,
            _messagingmessageoutboundservice.MessagingMessageOutboundService
        ],
        exports: [
            _messagingmessageoutboundservice.MessagingMessageOutboundService
        ]
    })
], MessagingSendManagerModule);

//# sourceMappingURL=messaging-send-manager.module.js.map
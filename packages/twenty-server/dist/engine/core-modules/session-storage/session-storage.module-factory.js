"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSessionStorageOptions", {
    enumerable: true,
    get: function() {
        return getSessionStorageOptions;
    }
});
const _crypto = require("crypto");
const _connectredis = /*#__PURE__*/ _interop_require_default(require("connect-redis"));
const _redis = require("redis");
const _cachestoragetypeenum = require("../cache-storage/types/cache-storage-type.enum");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const getSessionStorageOptions = (twentyConfigService)=>{
    const cacheStorageType = _cachestoragetypeenum.CacheStorageType.Redis;
    const SERVER_URL = twentyConfigService.get('SERVER_URL');
    const appSecret = twentyConfigService.get('APP_SECRET');
    if (!appSecret) {
        throw new Error('APP_SECRET is not set');
    }
    const sessionSecret = (0, _crypto.createHash)('sha256').update(`${appSecret}SESSION_STORE_SECRET`).digest('hex');
    const sessionStorage = {
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: !!(SERVER_URL && SERVER_URL.startsWith('https')),
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 30
        }
    };
    switch(cacheStorageType){
        /* case CacheStorageType.Memory: {
      Logger.warn(
        'Memory session storage is not recommended for production. Prefer Redis.',
      );

      return sessionStorage;
    }*/ case _cachestoragetypeenum.CacheStorageType.Redis:
            {
                const connectionString = twentyConfigService.get('REDIS_URL');
                if (!connectionString) {
                    throw new Error(`${_cachestoragetypeenum.CacheStorageType.Redis} session storage requires REDIS_URL to be defined, check your .env file`);
                }
                const redisClient = (0, _redis.createClient)({
                    url: connectionString
                });
                redisClient.connect().catch((err)=>{
                    throw new Error(`Redis connection failed: ${err}`);
                });
                return {
                    ...sessionStorage,
                    store: new _connectredis.default({
                        client: redisClient,
                        prefix: 'engine:session:'
                    })
                };
            }
        default:
            throw new Error(`Invalid session-storage (${cacheStorageType}), check your .env file`);
    }
};

//# sourceMappingURL=session-storage.module-factory.js.map
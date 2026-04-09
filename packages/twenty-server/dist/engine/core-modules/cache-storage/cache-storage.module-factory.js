"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "cacheStorageModuleFactory", {
    enumerable: true,
    get: function() {
        return cacheStorageModuleFactory;
    }
});
const _cachemanagerredisyet = require("cache-manager-redis-yet");
const _cachestoragetypeenum = require("./types/cache-storage-type.enum");
const cacheStorageModuleFactory = (twentyConfigService)=>{
    const cacheStorageType = _cachestoragetypeenum.CacheStorageType.Redis;
    const cacheStorageTtl = twentyConfigService.get('CACHE_STORAGE_TTL');
    const cacheModuleOptions = {
        isGlobal: true,
        ttl: cacheStorageTtl * 1000
    };
    switch(cacheStorageType){
        /* case CacheStorageType.Memory: {
      return cacheModuleOptions;
    }*/ case _cachestoragetypeenum.CacheStorageType.Redis:
            {
                const redisUrl = twentyConfigService.get('REDIS_URL');
                if (!redisUrl) {
                    throw new Error(`${cacheStorageType} cache storage requires REDIS_URL to be defined, check your .env file`);
                }
                return {
                    ...cacheModuleOptions,
                    store: _cachemanagerredisyet.redisStore,
                    url: redisUrl
                };
            }
        default:
            throw new Error(`Invalid cache-storage (${cacheStorageType}), check your .env file`);
    }
};

//# sourceMappingURL=cache-storage.module-factory.js.map
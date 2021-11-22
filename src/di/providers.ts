import { container } from "tsyringe";
import ICacheProvider from "../providers/CacheProvider/ICacheProvider";
import RedisCacheProvider from "../providers/CacheProvider/RedisCacheProvider";

container.registerSingleton<ICacheProvider>(
    "CacheProvider",
    RedisCacheProvider
);

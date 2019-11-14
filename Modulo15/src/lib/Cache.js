import Redis from "ioredis";

class Cache {
  constructor() {
    this.regis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      keyPrefix: "cache:"
    });
  }

  set(key, value) {
    return this.regis.set(key, JSON.stringify(value), "EX", 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.regis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    this.redis.del(key);
  }

  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    const keysWithoutPrefix = keys.map(key => key.replace("cache:", ""));

    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();

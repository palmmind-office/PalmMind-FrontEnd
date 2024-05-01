const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const redis = require("redis");

const promisify = function (func, ...args) {
  const jsonify = (reply) => {
    try {
      if (typeof reply === "string") {
        return JSON.parse(reply);
      }
      return Object.keys(reply).reduce(
        (accumulator, current) => ({
          ...accumulator,
          [current]: JSON.parse(reply[current]),
        }),
        {}
      );
    } catch (error) {
      return {};
    }
  };
  return new Promise((resolve) => {
    try {
      func(...args, function (error, reply) {
        try {
          // console.log(`Redis [${new Date().toISOString()}]: ${args.join(".")}`);
          // console.table(jsonify(reply));
          if (error) {
            throw error;
          }
          resolve(jsonify(reply));
        } catch (error) {
          console.log(`Redis: error [${args.join(".")}]`, error);
          resolve({});
        }
      });
    } catch (error) {
      console.log(`ERROR IN REDIS PROMISIFY => `, error);
      resolve({});
    }
  });
};

class RedisWithJson {
  constructor(options) {
    this._client = redis.createClient(options);

    this._client.on("connect", () => {
      console.log("Redis: connected");
    });

    this._client.on("end", () => {
      console.log("Redis: end");
    });

    this._client.on("disconnected", () => {
      console.log("Redis: disconnected");
    });

    this._client.on("error", function (error) {
      console.error("Redis: error", error);
    });
  }

  async hget(key, field) {
    return promisify(this._client.hget.bind(this._client), key || "", field || "");
  }

  async hgetall(key) {
    return promisify(this._client.hgetall.bind(this._client), key || "");
  }

  async hset(key, field, data, recurse = []) {
    if (!key || !field) {
      return null;
    }
    const existing = await this.hget(key, field);
    if (recurse.length) {
      recurse.forEach(key => {
        data[key] = { ...existing[key], ...data[key] }
      })
    }
    this._client.hset(key || "", field || "", JSON.stringify({ ...existing, ...data } || {}));
  }

  hdel(key, ...fields) {
    fields.forEach((field) => {
      this._client.hdel(key || "", field || "");
    });
  }

  del(key) {
    this._client.del(key);
  }
}

const client = new RedisWithJson({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  retry_strategy: (retry) => retry * 100 || 3000,
});

module.exports = { client };
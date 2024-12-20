import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (error) => {
  console.error(`Redis client error: ${error}`);
});

client.on("connect", () => {
  console.log("Redis client connected successfully.");
});

(async () => {
  try {
    // Connect to Redis
    await client.connect();
    console.log("Redis client connection established.");

    // Set a test value
    await client.set("start", "Redis is now working fine!");
  } catch (error) {
    console.error(`Failed to connect to Redis: ${error.message}`);
  }
})();

const redisClient = client;

export { redisClient };

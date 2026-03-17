import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let freeRateLimit: Ratelimit | null = null;

if (url && token) {
  const redis = new Redis({ url, token });
  freeRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "30 d"),
    analytics: true,
    prefix: "slay_free",
  });
} else {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set. " +
      "Rate limiting is disabled — all requests will be allowed."
  );
}

export { freeRateLimit };

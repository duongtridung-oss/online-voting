import redis.asyncio as redis
import json

redis_client = None

async def get_redis():
    global redis_client
    if not redis_client:
        redis_client = redis.from_url("redis://localhost:6379", encoding="utf-8", decode_responses=True)
    return redis_client

import asyncio
import json
import os
import sys

# Đảm bảo có thể import các module trong backend
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from redis_client import get_redis
from database import init_db
from models import Vote, Poll

async def process_vote_queue(worker_id):
    # Khởi tạo kết nối DB cho worker
    await init_db()
    redis = await get_redis()
    print(f"[Worker {worker_id}] Đã kết nối MongoDB & Redis. Đang chờ xử lý vote...")
    
    while True:
        try:
            # Dùng rpop thay cho brpop để tránh lỗi Timeout connection của redis-py trên Windows
            vote_data_str = await redis.rpop("vote_queue")
            
            if vote_data_str:
                vote_data = json.loads(vote_data_str)
                
                poll_id = vote_data["poll_id"]
                user_id = vote_data["user_id"]
                option_id = vote_data["option_id"]
                
                poll = await Poll.get(poll_id)
                if poll:
                    for opt in poll.options:
                        if opt.id == option_id:
                            opt.vote_count += 1
                            break
                    await poll.save()
                    
                    new_vote = Vote(
                        user_id=user_id,
                        poll_id=poll_id,
                        option_id=option_id
                    )
                    await new_vote.insert()
                    
                    # Xóa cache kết quả poll để hệ thống lấy bản mới nhất
                    await redis.delete(f"poll_results:{poll_id}")
                    print(f"[Worker {worker_id}] Xử lý thành công vote cho poll_id: {poll_id}")
            else:
                # Nếu queue rỗng thì ngủ 0.5s rồi thử lại
                await asyncio.sleep(0.5)
                    
        except Exception as e:
            print(f"[Worker {worker_id}] Lỗi xử lý: {e}")
            await asyncio.sleep(1)

if __name__ == "__main__":
    worker_id = sys.argv[1] if len(sys.argv) > 1 else "1"
        
    try:
        asyncio.run(process_vote_queue(worker_id))
    except KeyboardInterrupt:
        print(f"[Worker {worker_id}] Đã dừng.")

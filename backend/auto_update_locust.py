import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import re
import sys

# Windows console fix for utf-8
sys.stdout.reconfigure(encoding='utf-8')

async def update_locustfile():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['votecast_db']
    # Tìm kỳ bầu cử đang mở (lấy cái mới tạo nhất)
    poll = await db.polls.find_one({'status': 'open'}, sort=[('_id', -1)])
    if not poll:
        print("No open polls found in db.polls")
        return
        
    poll_id = str(poll['_id'])
    options = [opt['id'] for opt in poll.get('options', [])]
    
    if not options:
        print("No options found in the open poll.")
        return
        
    options_str = repr(options)
    
    with open('locustfile.py', 'r', encoding='utf-8') as f:
        content = f.read()
        
    import_random = "import random"
    if import_random not in content:
        content = import_random + "\n" + content
        
    pattern = r'poll_id\s*=\s*".*?".*?\n\s*option_id\s*=\s*".*?"'
    replacement = f'poll_id = "{poll_id}"\n        options_list = {options_str}\n        option_id = random.choice(options_list)'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open('locustfile.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Success! Poll ID: {poll_id}")
    print(f"Randomizing over options: {options}")

asyncio.run(update_locustfile())

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def get_poll():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['votecast_db'] # Fix db name
    poll = await db.Poll.find_one({})
    if poll:
        print("POLL_ID=" + str(poll["_id"]))
        if "options" in poll and len(poll["options"]) > 0:
            print("OPTION_ID=" + str(poll["options"][0]["id"]))
        else:
            print("No options found in poll")
    else:
        print("No polls found in votecast_db")

asyncio.run(get_poll())

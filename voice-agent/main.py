import os
import json
import uuid
import aiohttp
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import FileResponse
from twilio.twiml.voice_response import VoiceResponse, Gather
from dotenv import load_dotenv
from utils.llm import get_llm_response
from utils.tts import text_to_speech

load_dotenv()

app = FastAPI()

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://0.0.0.0:8001")
STORE_ID = int(os.getenv("STORE_ID", "1"))

# In-memory session storage for history
sessions = {}

AUDIO_DIR = "/tmp/voice_audio"
os.makedirs(AUDIO_DIR, exist_ok=True)

async def fetch_store_data(store_id):
    async with aiohttp.ClientSession() as session:
        # Get store info
        async with session.get(f"{BACKEND_URL}/stores/9876543210") as resp:
            store_info = await resp.json()
        
        # Get inventory
        async with session.get(f"{BACKEND_URL}/stores/{store_id}/inventory/") as resp:
            inventory = await resp.json()
            
        return store_info, inventory

async def create_order_in_backend(store_id, structured_data):
    """Map LLM structured data to backend OrderCreate schema"""
    items = []
    total_amount = 0
    for item in structured_data.get("items", []):
        price = item.get("price") or 0
        qty = item.get("quantity_value") or 1
        items.append({
            "item_name": item.get("name"),
            "quantity": qty,
            "price_at_order": price
        })
        total_amount += price * qty

    order_payload = {
        "customer_name": structured_data.get("customer_name"),
        "customer_phone": structured_data.get("contact_number") or "Unknown",
        "total_amount": total_amount,
        "status": "pending",
        "delivery_time": structured_data.get("delivery_time"),
        "items": items
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(f"{BACKEND_URL}/stores/{store_id}/orders/", json=order_payload) as resp:
            return await resp.json()

async def log_call_to_backend(store_id, customer_phone, transcript, outcome):
    call_payload = {
        "store_id": store_id,
        "customer_phone": customer_phone or "Unknown",
        "transcript": transcript,
        "outcome": outcome
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{BACKEND_URL}/stores/{store_id}/calls/", json=call_payload) as resp:
            return await resp.json()

@app.post("/voice")
async def voice_root(request: Request):
    """Handle incoming calls"""
    form_data = await request.form()
    customer_phone = form_data.get("From")
    
    store_info, inventory = await fetch_store_data(STORE_ID)
    
    resp = VoiceResponse()
    greeting = f"Namaste! {store_info.get('name')} mein aapka swagat hai. Main BoloBazaar bol raha hoon. Main aapki kya sahayata kar sakta hoon?"
    
    try:
        audio_content = await text_to_speech(greeting)
        filename = f"greeting_{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(audio_content)
        # resp.play(f"/audio/{filename}") # Twilio needs public URL
        resp.say(greeting, language="hi-IN")
    except Exception as e:
        resp.say(greeting, language="hi-IN")

    gather = Gather(input="speech", action="/handle-speech", language="hi-IN", speechTimeout="auto")
    resp.append(gather)
    
    # Store initial state in session
    sessions[form_data.get("CallSid")] = {
        "history": [],
        "store_info": store_info,
        "inventory": inventory,
        "customer_phone": customer_phone
    }
    
    return Response(content=str(resp), media_type="application/xml")

@app.post("/handle-speech")
async def handle_speech(request: Request):
    """Handle speech input from Twilio"""
    form_data = await request.form()
    speech_result = form_data.get("SpeechResult")
    call_sid = form_data.get("CallSid")
    
    session_data = sessions.get(call_sid)
    if not session_data:
        # Fallback or restart
        resp = VoiceResponse()
        resp.redirect("/voice")
        return Response(content=str(resp), media_type="application/xml")

    if not speech_result:
        resp = VoiceResponse()
        resp.say("Maaf kijiye, maine suna nahi. Kya aap phir se bol sakte hain?", language="hi-IN")
        resp.redirect("/handle-speech") # Use redirect to re-gather
        return Response(content=str(resp), media_type="application/xml")

    # Get LLM response
    result = get_llm_response(
        speech_result, 
        session_data["store_info"], 
        session_data["inventory"], 
        session_data["history"]
    )
    
    llm_text = result["response_text"]
    structured = result["structured_data"]
    
    # Update history
    session_data["history"].append({"role": "user", "content": speech_result})
    session_data["history"].append({"role": "assistant", "content": json.dumps(result)})

    # Action based on order status
    if structured.get("order_status") == "confirmed":
        try:
            # Add phone number if missing in structured data but present in call
            if not structured.get("contact_number"):
                structured["contact_number"] = session_data["customer_phone"]
            
            await create_order_in_backend(STORE_ID, structured)
            outcome = "Order Confirmed"
        except Exception as e:
            print(f"Error creating order: {e}")
            outcome = "Order Confirmation Failed"
    elif structured.get("order_status") == "cancelled":
        outcome = "Order Cancelled"
    elif structured.get("order_status") == "handoff_to_human":
        outcome = "Handoff to Human"
    else:
        outcome = "In Progress"

    # Log call progress/transcript (could be done at end, but logging now for visibility)
    # In a real app, we'd log the full transcript at the end of the call.
    
    resp = VoiceResponse()
    try:
        audio_content = await text_to_speech(llm_text)
        filename = f"resp_{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(audio_content)
        # resp.play(f"/audio/{filename}")
        resp.say(llm_text, language="hi-IN")
    except Exception as e:
        resp.say(llm_text, language="hi-IN")

    if structured.get("order_status") in ["confirmed", "cancelled"]:
        # Log final call
        full_transcript = "\n".join([f"{m['role']}: {m['content']}" for m in session_data["history"]])
        await log_call_to_backend(STORE_ID, session_data["customer_phone"], full_transcript, outcome)
        resp.hangup()
    elif structured.get("order_status") == "handoff_to_human":
        # Log handoff
        full_transcript = "\n".join([f"{m['role']}: {m['content']}" for m in session_data["history"]])
        await log_call_to_backend(STORE_ID, session_data["customer_phone"], full_transcript, outcome)
        resp.say("Kripya line par bane rahein, main aapko store owner se connect kar raha hoon.", language="hi-IN")
        # In real Twilio, we would <Dial> the owner's number
        resp.hangup()
    else:
        # Continue gathering
        gather = Gather(input="speech", action="/handle-speech", language="hi-IN", speechTimeout="auto")
        resp.append(gather)

    return Response(content=str(resp), media_type="application/xml")

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    filepath = os.path.join(AUDIO_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)
    raise HTTPException(status_code=404, detail="Audio not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

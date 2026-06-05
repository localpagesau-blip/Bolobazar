import os
from deepgram import DeepgramClient, PrerecordedOptions

load_dotenv()

dg_key = os.getenv("DEEPGRAM_API_KEY")
if dg_key:
    dg_client = DeepgramClient(dg_key)
else:
    dg_client = None

async def get_transcript(audio_content):
    if not dg_client:
        return "Demo transcript: Milk and bread please."
    
    # This is for non-streaming STT (e.g. from a recording)
    source = {'buffer': audio_content}
    options = PrerecordedOptions(smart_format=True, language='hi')
    response = dg_client.listen.prerecorded.v("1").transcribe_file(source, options)
    return response['results']['channels'][0]['alternatives'][0]['transcript']

# For streaming, we would use a websocket connection.
# We'll implement that in the main server logic if needed.

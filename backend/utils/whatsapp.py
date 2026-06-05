import os
from twilio.rest import Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Twilio credentials from environment variables
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886") # Default Twilio sandbox number

def send_whatsapp_order_summary(to_number: str, customer_name: str, items: list, total_amount: float, delivery_time: str):
    """
    Sends an order summary via WhatsApp using Twilio Sandbox.
    to_number: Store owner's WhatsApp number (e.g., 'whatsapp:+919876543210')
    """
    if not to_number:
        logger.warning("No WhatsApp number provided for store. Skipping notification.")
        return

    # Format items list for the message
    items_text = "\n".join([f"- {item['item_name']} (x{item['quantity']})" for item in items])
    
    message_body = (
        f"🛍️ *New Order Received!*\n\n"
        f"*Customer:* {customer_name}\n"
        f"*Items:*\n{items_text}\n\n"
        f"*Total:* ₹{total_amount:.2f}\n"
        f"*Expected Delivery:* {delivery_time}\n\n"
        f"Please check your dashboard for details."
    )

    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        logger.info("Twilio credentials not found. MOCK WhatsApp notification sent:")
        logger.info(f"To: {to_number}")
        logger.info(f"Message: {message_body}")
        return True

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            from_=TWILIO_WHATSAPP_FROM,
            body=message_body,
            to=f"whatsapp:{to_number}" if not to_number.startswith("whatsapp:") else to_number
        )
        logger.info(f"WhatsApp message sent successfully. SID: {message.sid}")
        return True
    except Exception as e:
        logger.error(f"Failed to send WhatsApp message: {e}")
        return False

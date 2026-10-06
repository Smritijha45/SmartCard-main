import config from '../config';
import logger from './logger';

export interface WhatsAppPayload {
  phone: string;
  name: string;
  cardUrl: string;
}

export async function sendCardViaWhatsApp(phone: string, name: string, cardUrl: string): Promise<boolean> {
  const webhookUrl = config.WHATSAPP_WEBHOOK_URL;
  
  if (!webhookUrl) {
    logger.warn({ phone, name, cardUrl }, 'WhatsApp webhook URL not configured. Simulating automated WhatsApp dispatch in logs.');
    return true;
  }

  const payload: WhatsAppPayload = {
    phone,
    name,
    cardUrl
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      logger.error({ status: res.status, errorText, phone }, 'WhatsApp automation webhook call failed');
      return false;
    }

    logger.info({ phone, name }, 'WhatsApp automation webhook triggered successfully');
    return true;
  } catch (error) {
    logger.error({ error, phone }, 'Failed to invoke WhatsApp automation webhook');
    return false;
  }
}

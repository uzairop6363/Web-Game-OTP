// Yeh /api/notify.js file hai

export default async function handler(req, res) {
    // Sirf POST requests ko ijazat dein
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Yeh Vercel mein save kiye gaye secrets hain
        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        // Frontend se bheja gaya message
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Telegram API ko call karein
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            }),
        });

        const data = await response.json();

        if (data.ok) {
            // Frontend ko batayein ke message chala gaya
            res.status(200).json({ success: true, message: 'Message sent!' });
        } else {
            // Telegram se error aaye toh
            res.status(500).json({ success: false, message: 'Failed to send message', error: data });
        }

    } catch (error) {
        // Koi aur error
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

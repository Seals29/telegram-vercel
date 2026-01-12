const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

export async function sendMessage(chatid, text) {
    const url = `${TELEGRAM_API_URL}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatid,
                text: text
            })
        });

        // JIKA TERHUBUNG TAPI API ERROR (Misal: Token salah atau Chat ID tidak ditemukan)
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`[Telegram API Error] Status: ${response.status} - Message: ${errorData}`);
            return;
        }

        console.log(`[Success] Message sent to ${chatid}`);

    } catch (err) {
        // JIKA GAGAL TERKONEKSI (Misal: DNS Error, Network Down, atau Timeout)
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            console.error("### FAILED TO CONNECT TO TELEGRAM SERVER ###");
            console.error("Check your internet connection or Telegram API URL.");
        } else {
            console.error("### AN UNEXPECTED ERROR OCCURED ###");
            console.error("Detail:", err.message);
        }
    }
}

export async function sendMessageWithButtons(chatid, text, buttons =[]) {
    const url = `${TELEGRAM_API_URL}/sendMessage`;
    const reply_markup = {
        inline_keyboard: buttons
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatid,
                text: text,
                parse_mode: "Markdown", // Agar bisa pakai Bold/Italic
                reply_markup: reply_markup
            })
        });

        // JIKA TERHUBUNG TAPI API ERROR (Misal: Token salah atau Chat ID tidak ditemukan)
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`[Telegram API Error] Status: ${response.status} - Message: ${errorData}`);
            return;
        }

        console.log(`[Success] Message sent to ${chatid}`);

    } catch (err) {
        // JIKA GAGAL TERKONEKSI (Misal: DNS Error, Network Down, atau Timeout)
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            console.error("### FAILED TO CONNECT TO TELEGRAM SERVER ###");
            console.error("Check your internet connection or Telegram API URL.");
        } else {
            console.error("### AN UNEXPECTED ERROR OCCURED ###");
            console.error("Detail:", err.message);
        }
    }
}
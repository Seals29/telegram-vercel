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

export async function deleteMessage(chatId, messageId) {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteMessage`;
    
    try {
        await fetch(url, {
            method: "POST",
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId
            })
        });
    } catch (err) {
        console.error("Gagal menghapus pesan:", err);
    }
}


export async function sendVideo(chatId, videoFileId, caption, buttons = []) {
    const url = `${TELEGRAM_API_URL}/sendVideo`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                video: videoFileId, // ID video dari Telegram (bukan URL file lokal)
                caption: caption,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: buttons
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`[Telegram Video Error] ${errorData}`);
            return false;
        }

        return true;
    } catch (err) {
        console.error("### ERROR SENDING VIDEO ###", err.message);
        return false;
    }
}

export async function sendPhoto(chatId, photoUrl, caption) {
    const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;

    try {
        const response = await fetch(TELEGRAM_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                photo: photoUrl,
                caption: caption,
                parse_mode: "Markdown"
            })
        });

        const result = await response.json();

        if (!result.ok) {
            console.error("❌ Telegram Error:", result.description);
        }
        return result;
    } catch (error) {
        console.error("❌ Gagal mengirim foto:", error.message);
        throw error;
    }
}
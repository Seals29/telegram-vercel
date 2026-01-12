export async function answerCallbackQuery(callbackQueryId) {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/answerCallbackQuery`;
    await fetch(url, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId })
    });
}
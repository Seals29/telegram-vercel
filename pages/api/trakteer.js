import fetch from 'node-fetch';

const TRAKTEER_URLS = {
    API: process.env.TRAKTEER_API_URL,
    QRIS: process.env.TRAKTEER_QRIS_URL,
    GOPAY: process.env.TRAKTEER_GOPAY_URL,
    OVO: process.env.TRAKTEER_OVO_URL,
    DANA: process.env.TRAKTEER_DANA_URL,
    LINKAJA: process.env.TRAKTEER_LINKAJA_URL,
    SHOPEEPAY: process.env.TRAKTEER_SHOPEEPAY_URL,
    VA: {
        OTHERS: process.env.TRAKTEER_VA_OTHERS_URL,
        BNI: process.env.TRAKTEER_VA_BNI_URL,
        BRI: process.env.TRAKTEER_VA_BRI_URL,
        MANDIRI: process.env.TRAKTEER_VA_MANDIRI_URL,
        PERMATA: process.env.TRAKTEER_VA_PERMATA_URL,
        BCA: process.env.TRAKTEER_VA_BCA_URL
    },
    CARDS: process.env.TRAKTEER_CARDS_URL
};

const MIDTRANS_CHARGE_URL = process.env.MIDTRANS_CHARGE_URL;

export default async function handler(req, res) {
    // Pastikan hanya menerima method GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { method, pizzas, display_name, support_message, ovo_number, linkaja_number } = req.query;

    // Validasi input
    if (!method || !pizzas) {
        return res.status(400).json({ error: 'Missing payment method or pizzas quantity' });
    }

    if (method === 'ovo' && !ovo_number) {
        return res.status(400).json({ error: 'Missing OVO number for OVO payment method' });
    }

    if (method === 'linkaja' && !linkaja_number) {
        return res.status(400).json({ error: 'Missing LinkAja number for LinkAja payment method' });
    }

    const price = parseInt(pizzas) * 50000;

    try {
        // 1. Hitung Total ke Trakteer
        const totalResponse = await fetch(TRAKTEER_URLS.API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `trakteer-sess=${process.env.TRAKTEER_SESSION}`,
                'Accept': 'application/json',
                'Origin': 'https://trakteer.id',
                'Referer': 'https://trakteer.id/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                price: price,
                payment_method: method,
                is_payment_fee_by_supporter: false
            })
        });

        const totalData = await totalResponse.json();

        // 2. Tentukan Checkout URL
        let checkoutUrl;
        switch (method) {
            case 'gopay': checkoutUrl = TRAKTEER_URLS.GOPAY; break;
            case 'ovo': checkoutUrl = TRAKTEER_URLS.OVO; break;
            case 'dana': checkoutUrl = TRAKTEER_URLS.DANA; break;
            case 'linkaja': checkoutUrl = TRAKTEER_URLS.LINKAJA; break;
            case 'shopeepay': checkoutUrl = TRAKTEER_URLS.SHOPEEPAY; break;
            case 'va-others': checkoutUrl = TRAKTEER_URLS.VA.OTHERS; break;
            case 'va-bni': checkoutUrl = TRAKTEER_URLS.VA.BNI; break;
            case 'va-bri': checkoutUrl = TRAKTEER_URLS.VA.BRI; break;
            case 'va-mandiri': checkoutUrl = TRAKTEER_URLS.VA.MANDIRI; break;
            case 'va-permata': checkoutUrl = TRAKTEER_URLS.VA.PERMATA; break;
            case 'va-bca': checkoutUrl = TRAKTEER_URLS.VA.BCA; break;
            case 'cards': checkoutUrl = TRAKTEER_URLS.CARDS; break;
            default: checkoutUrl = TRAKTEER_URLS.QRIS;
        }

        // 3. Proses Checkout ke Trakteer
        const checkoutResponse = await fetch(checkoutUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `trakteer-sess=${process.env.TRAKTEER_SESSION}`,
                'Accept': 'application/json',
                'Origin': 'https://trakteer.id',
                'Referer': 'https://trakteer.id/dramasub',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': process.env.CSRF_TOKEN
            },
            body: JSON.stringify({
                form: "create-tip",
                creator_id: process.env.CREATOR_ID,
                unit_id: process.env.UNIT_ID,
                quantity: parseInt(pizzas),
                payment_method: method,
                display_name: display_name || "Anonymous",
                support_message: support_message || "Tidak ada pesan yang dimasukan",
                supporter_id: process.env.SUPPORTER_ID,
                times: "once",
                is_remember_next: "on",
                is_showing_email: "on",
                ...(method === 'ovo' && { ovo_phone: ovo_number }),
                ...(method === 'linkaja' && { linkaja_phone: linkaja_number })
            })
        });

        const checkoutData = await checkoutResponse.text();

        let finalResponse = {
            total: totalData.data,
            checkout_expiration: "1 menit"
        };

        // 4. Proses Charge Midtrans (Jika diperlukan)
        const midtransMethods = ['gopay', 'shopeepay', 'va-others', 'va-bni', 'va-bri', 'va-mandiri', 'va-permata'];
        
        if (midtransMethods.includes(method)) {
            const chargeResponse = await fetch(`${MIDTRANS_CHARGE_URL}/${checkoutData}/charge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://app.midtrans.com',
                    'Referer': `https://app.midtrans.com/snap/v4/popup?origin_host=https://trakteer.id&client_key=${process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-sHregv1nt9seVDO9'}`,
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
                    'X-Source': 'snap',
                    'X-Source-App-Type': 'popup',
                    'X-Source-Version': '2.3.0'
                },
                body: JSON.stringify({
                    payment_type: method === 'va-bni' ? 'bni_va' : (method === 'va-bri' ? 'bri_va' : (method === 'va-mandiri' ? 'echannel' : (method === 'va-permata' ? 'permata_va' : (method === 'va-others' ? 'other_va' : 'qris')))),
                    payment_params: method.startsWith('va-') ? undefined : { acquirer: [method] },
                    promo_details: null
                })
            });

            const chargeData = await chargeResponse.json();
            finalResponse[method] = chargeData;
        } else {
            // Parsing string HTML/JSON dari Trakteer jika bukan via Midtrans charge
            try {
                finalResponse[method] = JSON.parse(checkoutData);
            } catch (e) {
                finalResponse[method] = checkoutData;
            }
        }

        // Response Berhasil
        return res.status(200).json(finalResponse);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
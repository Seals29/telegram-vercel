import { chromium } from 'playwright';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    let browser;
    try {
        // 1. Launch Browser
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 400, height: 600 }
        });
        const page = await context.newPage();

        // 2. Buka URL
        await page.goto(url, { waitUntil: 'networkidle' });

        // 3. Tunggu elemen QRIS
        const qrisSelector = "#qris-image";
        await page.waitForSelector(qrisSelector);

        // 4. Inject CSS (Sama seperti logika Python kamu)
        await page.addStyleTag({
            content: `
                #qris-image { 
                    background: white !important; 
                    padding: 20px !important; 
                    border-radius: 0px !important; 
                }
                #qris-image svg rect, 
                #qris-image svg path, 
                #qris-image svg circle { 
                    fill: #000000 !important; 
                }
                #qris-image svg rect[clip-path*="clip-path-background-color"] {
                    fill: #ffffff !important;
                }
            `
        });

        // 5. Screenshot elemen spesifik
        const imgBuffer = await page.locator(qrisSelector).screenshot({ type: 'png' });

        await browser.close();

        // 6. Kirim sebagai respons gambar
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Optional cache
        return res.send(imgBuffer);

    } catch (error) {
        if (browser) await browser.close();
        console.error("Playwright Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
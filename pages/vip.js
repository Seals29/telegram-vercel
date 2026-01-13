import React, { useEffect, useState } from "react";
import Head from "next/head";

export default function VipPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Inisialisasi Telegram Web App
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.expand(); // Membuka webapp layar penuh
            setUser(tg.initDataUnsafe?.user);
        }
    }, []);

    const packages = [
        { id: 2, name: "2 Hari", price: "3.000", pizzas: 2 },
        { id: 10, name: "10 Hari", price: "12.000", pizzas: 3 },
        { id: 20, name: "20 Hari", price: "21.000", pizzas: 5 },
        { id: 30, name: "30 Hari", price: "28.000", pizzas: 7 },
    ];

const handlePayment = async (pkg) => {
        if (loading) return;
        setLoading(true);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`/api/trakteer?method=qris&pizzas=${pkg.pizzas}&display_name=${user?.username || 'Member'}`, {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            const data = await response.json();
            console.log("Response Data:", data);
            window.Telegram.WebApp.openLink("https://trakteer.id/checkout/xendit/qris/f08efbf7-45ce-5fb5-b07c-40fc0f2460e8");
            // Cek apakah checkout_url tersedia
            // if (data.qris && data.qris.checkout_url) {
            //     const targetUrl = data.qris.checkout_url;

            //     if (window.Telegram?.WebApp) {
            //         // Cara terbaik untuk Telegram Web App (Membuka di browser HP)
            //         window.Telegram.WebApp.openLink(targetUrl);
                    
            //         // Opsional: Tutup webapp setelah buka link agar user kembali ke chat bot
            //         // window.Telegram.WebApp.close(); 
            //     } else {
            //         // Fallback jika dibuka di browser biasa
            //         window.location.href = targetUrl;
            //     }
            // } else {
            //     throw new Error("Checkout URL tidak ditemukan");
            // }

        } catch (error) {
            console.error("Payment Error:", error);
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.showAlert("Gagal mengalihkan ke pembayaran: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 font-sans">
            <Head>
                <script
                    src="https://telegram.org/js/telegram-web-app.js"
                    strategy="beforeInteractive"
                ></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <title>VIP Membership</title>
            </Head>

            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8 pt-4">
                    <h1 className="text-3xl font-bold text-yellow-500">
                        👑 VIP ACCESS
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Halo, @{user?.username || "Member"}! Pilih paketmu.
                    </p>
                </div>

                {/* Package Cards */}
                <div className="grid gap-4">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex justify-between items-center hover:border-yellow-500 transition-all"
                        >
                            <div>
                                <h3 className="text-lg font-bold">
                                    {pkg.name}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Akses Tanpa Batas
                                </p>
                                <span className="text-yellow-500 font-bold text-xl">
                                    Rp {pkg.price}
                                </span>
                            </div>
                            <button
                                onClick={() => handlePayment(pkg)}
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-6 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {loading ? "..." : "PILIH"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-xs text-slate-500">
                    <p>Pembayaran aman via QRIS (Trakteer)</p>
                    <p className="mt-1">
                        Setelah bayar, VIP akan aktif otomatis.
                    </p>
                </div>
            </div>
        </div>
    );
}

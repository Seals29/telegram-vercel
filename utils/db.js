import mysql from 'mysql2/promise';

// Buat pool di luar fungsi agar bisa digunakan kembali (reuse)
const pool = mysql.createPool({
    host: "20.24.229.197",
    user: "user_bot",
    password: "userpassword",
    database: "dracin_bot",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000 // Beri waktu lebih untuk koneksi VPS
});

export async function executeQuery(sql, params) {
    try {
        // Pool.execute otomatis mengambil koneksi dan mengembalikannya ke pool
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error("Database Error:", error.message);
        throw error;
    }
}
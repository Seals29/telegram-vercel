import mysql from "mysql2/promise";

export async function executeQuery({ query, values = [] }) {
    try {
        const dbconnection = await mysql.createConnection({
            host: "20.24.229.197",
            database: "dracin_bot",
            user: "user_bot",
            password: "userpassword",
            connectTimeout: 10000, // Tambahkan timeout 10 detik
        });

        console.log("Koneksi berhasil!");
        const [results] = await dbconnection.execute(sql, params);
        await dbconnection.end();
        return results;
    } catch (error) {
        throw Error(error.message);
    }
}

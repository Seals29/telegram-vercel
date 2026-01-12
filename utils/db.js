import mysql from 'mysql2/promise';

export async function query({ query, values = [] }) {
    const dbconnection = await mysql.createConnection({
        host: "20.24.229.197", 
        database: "dracin_bot",
        user: "user_bot",
        password: "userpassword", 
    });

    try {
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end();
        return results;
    } catch (error) {
        throw Error(error.message);
    }
}
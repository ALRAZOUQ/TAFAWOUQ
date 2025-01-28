import pg from 'pg'; // Import pg for PostgreSQL connection
const { Pool } = pg;
import env from 'dotenv'
env.config()


let db;

try {
    db = new Pool({
        connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for Heroku
        connectionTimeoutMillis: 5000, // 5 seconds timeout
        ssl: {
            rejectUnauthorized: false, // Required for Heroku SSL connections
        },
    });

    db.on('connect', () => {
       // console.log('\x1b[38;5;123m%s\x1b[0m', 'Connected to the [Cloud] DB');
    });

    db.on('error', (err) => {
        console.error('Database connection error:', err.stack);
    });

} catch (error) {
    console.error('Failed to connect to the database:', error);
}

export default db;

    /*
    // Function to create and return the database connection
const connectDb = () => {
    let db;
    if (process.env.DATABASE_URL) {
        console.log('\x1b[38;5;123m%s\x1b[0m', 'Connected to the [Cloud] DB');
        db = new Pool({
            connectionString: process.env.DATABASE_URL, // Use DATABASE_URL for Heroku
            connectionTimeoutMillis: 5000, // 5 seconds timeout
            ssl: {
                rejectUnauthorized: false, // Required for Heroku SSL connections
            },
        });
    } else {
        console.log('\x1b[38;5;156m%s\x1b[0m', 'Connected to the [LOCAL] DB');
        db = new Pool({
            user: process.env.USER,
            host: process.env.HOST,
            database: process.env.DATABASE,
            password: process.env.PASSWORD,
            port: process.env.DATABASEPORT,
        });
    }

    db.on('error', (error) => {
        console.log("\x1b[31m%s\x1b[0m", "[ DB problem ]");
        console.log(error);
    });

    return db;
};
// Create and export a shared `db` instance
const db = connectDb();
export default db;*/ 
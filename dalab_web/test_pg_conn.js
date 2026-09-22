const { Client } = require('pg');

const connectionString = 'postgresql://postgres:66mlOZsSeBH8zk6o@db.dguilaojwqlsmehgmupg.supabase.co:5432/postgres';

async function testConnection() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to 5432...');
        await client.connect();
        console.log('Connected to 5432 successfully!');
        await client.end();
    } catch (err) {
        console.error('Failed to connect to 5432:', err.message);
    }

    const poolerString = 'postgresql://postgres:66mlOZsSeBH8zk6o@db.dguilaojwqlsmehgmupg.supabase.co:6543/postgres';
    const client2 = new Client({
        connectionString: poolerString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to 6543...');
        await client2.connect();
        console.log('Connected to 6543 successfully!');
        await client2.end();
    } catch (err) {
        console.error('Failed to connect to 6543:', err.message);
    }
}

testConnection();

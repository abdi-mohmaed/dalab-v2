const { Client } = require('pg');

const connectionString = 'postgresql://postgres.dguilaojwqlsmehgmupg:66mlOZsSeBH8zk6o@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function verify() {
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        const tablesToCheck = [
            'Category', 'Store', 'User', 'Product', 'ProductVariant',
            'ProductImage', 'Cart', 'CartItem', 'Order', 'OrderItem',
            'Review', 'Wishlist', 'Notification', 'Address'
        ];

        console.log('--- RLS STATUS ---');
        const rlsQuery = `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = ANY($1)`;
        const rlsRes = await client.query(rlsQuery, [tablesToCheck]);
        tablesToCheck.forEach(table => {
            const row = rlsRes.rows.find(r => r.tablename === table);
            console.log(`${table}: ${row ? (row.rowsecurity ? 'ENABLED' : 'DISABLED') : 'MISSING'}`);
        });

        console.log('\n--- POLICIES ---');
        const policiesToCheck = [
            'Public Categories are viewable by everyone',
            'Active Products are viewable by everyone',
            'Users can only see their own profile',
            'Users can update their own profile',
            'Users can see their own addresses'
        ];
        const policyQuery = `SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND policyname = ANY($1)`;
        const policyRes = await client.query(policyQuery, [policiesToCheck]);
        policiesToCheck.forEach(policy => {
            const rows = policyRes.rows.filter(r => r.policyname === policy);
            if (rows.length > 0) {
                rows.forEach(row => console.log(`Policy "${policy}" on "${row.tablename}": OK`));
            } else {
                console.log(`Policy "${policy}": MISSING`);
            }
        });

        console.log('\n--- TRIGGER/FUNCTION ---');
        const functionRes = await client.query(`SELECT proname FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND proname = 'handle_new_user'`);
        console.log(`Function "handle_new_user": ${functionRes.rows.length > 0 ? 'OK' : 'MISSING'}`);

        const triggerRes = await client.query(`SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created'`);
        console.log(`Trigger "on_auth_user_created": ${triggerRes.rows.length > 0 ? 'OK' : 'MISSING'}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

verify();

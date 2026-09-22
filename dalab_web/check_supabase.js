const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dguilaojwqlsmehgmupg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRndWlsYW9qd3Fsc21laGdtdXBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUzNjkzNCwiZXhwIjoyMDg1MTEyOTM0fQ.JXOwMoKahJZ2uWKdpeGS-GDcigaDybTtuPqTfriPS5s';

console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Buckets:', data.map(b => b.name));

            // Check products bucket specifically
            const productsBucket = data.find(b => b.name === 'products');
            if (!productsBucket) {
                console.log('Creating products bucket...');
                await supabase.storage.createBucket('products', { public: true });
                console.log('Created products bucket.');
            } else {
                console.log('Products bucket exists.');
            }
        }
    } catch (e) {
        console.error('Exception:', e);
    }
}

check();

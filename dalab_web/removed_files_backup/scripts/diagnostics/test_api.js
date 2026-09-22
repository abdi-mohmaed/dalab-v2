const http = require('http');

function test(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`URL: ${url}`);
                console.log(`Status: ${res.statusCode}`);
                try {
                    const json = JSON.parse(data);
                    console.log(`Count: ${json.data ? json.data.length : 'N/A'}`);
                    if (json.data && json.data.length > 0) {
                        console.log(`Sample ID: ${json.data[0].id}`);
                    }
                } catch (e) {
                    console.log('Error parsing JSON:', e.message);
                }
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error for ${url}:`, err.message);
            resolve();
        });
    });
}

async function run() {
    await test('http://localhost:3000/api/categories');
    await test('http://localhost:3000/api/products?limit=1000');
}

run();

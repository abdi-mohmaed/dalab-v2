// Native fetch check

// We need an ID of an existing section. I'll pick the Banners one.
// Since I can't easily import Prisma here without complications, I'll rely on the one I saw in check_banners.js output or just fetch the list first.

async function testSave() {
    try {
        // 1. Get List
        console.log('Fetching list...');
        const listRes = await fetch('http://localhost:3000/api/homepage-sections');
        const listData = await listRes.json();
        console.log('List Response:', JSON.stringify(listData, null, 2));

        const bannerSection = listData.sections?.find(s => s.type === 'BANNERS') || listData.find && listData.find(s => s.type === 'BANNERS');

        if (!bannerSection) {
            console.error('No Banner section found to test update on.');
            return;
        }

        console.log('Found Banner Section:', bannerSection.id);

        // 2. Modify it
        const updatedConfig = {
            ...bannerSection.config,
            banners: [
                { src: 'https://example.com/test-update.png', title: 'TEST UPDATE VIA SCRIPT', type: 'image' },
                ...(bannerSection.config.banners || []).slice(1) // Keep others
            ]
        };

        const payload = {
            ...bannerSection,
            config: updatedConfig
        };

        // 3. Post Update
        console.log('Sending Update...');
        const saveRes = await fetch('http://localhost:3000/api/homepage-sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const saveData = await saveRes.json();
        console.log('Save Response:', saveRes.status, saveData);

    } catch (e) {
        console.error(e);
    }
}

testSave();

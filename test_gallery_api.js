async function testGallery() {
    try {
        const response = await fetch('http://localhost:5000/api/gallery');
        const data = await response.json();
        console.log('Gallery Items:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

testGallery();

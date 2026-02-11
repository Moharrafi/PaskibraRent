import axios from 'axios';

async function testRevenueApi() {
    try {
        const response = await axios.get('http://localhost:5000/api/bookings/stats/revenue');
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', JSON.stringify(response.data, null, 2));

        if (Array.isArray(response.data) && response.data.length === 12) {
            console.log('SUCCESS: Data format is correct (Array of 12 months).');
        } else {
            console.error('FAILURE: Unexpected data format.');
        }
    } catch (error) {
        console.error('Error calling API:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testRevenueApi();

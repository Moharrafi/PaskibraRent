
async function verifyAvailabilityAPI() {
    try {
        console.log('Fetching availability from http://localhost:5000/api/bookings/availability...');
        const response = await fetch('http://localhost:5000/api/bookings/availability');
        const data = await response.json();
        console.log('API Response:', data);
    } catch (err) {
        console.error('Verification failed:', err);
    }
}

verifyAvailabilityAPI();

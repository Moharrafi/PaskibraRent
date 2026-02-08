import axios from 'axios';
import fs from 'fs';
import { pool } from './server/db.js';

const API_URL = 'http://localhost:5000/api';
const LOG_FILE = 'verification_result.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function runVerification() {
    fs.writeFileSync(LOG_FILE, '--- Verification Start ---\n');
    log('Starting Rental History Verification...');

    try {
        // 1. Register a temporary user
        const uniqueId = Date.now();
        const userCredentials = {
            name: `Test User ${uniqueId}`,
            email: `test${uniqueId}@example.com`,
            password: 'password123'
        };

        log(`1. Registering user: ${userCredentials.email}`);
        await axios.post(`${API_URL}/auth/register`, userCredentials);

        // 1b. Manually verify user in DB
        log('1b. Manually verifying user in DB...');
        await pool.query('UPDATE users SET is_verified = 1 WHERE email = ?', [userCredentials.email]);
        log('    User verified.');

        // 2. Login to get token
        log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: userCredentials.email,
            password: userCredentials.password
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };
        log('   Logged in successfully.');

        // 3. Create a Booking
        const bookingData = {
            name: userCredentials.name,
            institution: 'Test Institute',
            phone: '08123456789',
            email: userCredentials.email,
            pickupDate: '2024-01-01', // Past date
            returnDate: '2024-01-05', // Past date -> Should be 'Selesai'
            rentalDuration: 4,
            totalPrice: 100000,
            items: [
                {
                    name: 'Costume A',
                    quantity: 1,
                    price: 100000,
                    category: 'costume',
                    image: 'http://example.com/image.jpg'
                }
            ]
        };

        log('3. Creating a past booking...');
        const bookingRes = await axios.post(`${API_URL}/bookings`, bookingData, { headers });
        const bookingId = bookingRes.data.bookingId; // We need to extract ID to update it
        log('   Booking created: ' + bookingRes.data.message + ' ID: ' + bookingId);

        // 3b. Simulate Admin Approval (Status: Sedang Disewa)
        log('3b. Simulating Admin Approval (Setting status to Sedang Disewa)...');
        // We can use the bookingId from response if available, or query by user
        // The previous response returned { message: ..., bookingId: ... }
        if (bookingId) {
            await pool.query("UPDATE bookings SET status = 'Sedang Disewa' WHERE id = ?", [bookingId]);
        } else {
            // Fallback if ID not returned cleanly (it is returned in my code)
            // But for safety, update latest booking of user
            await pool.query("UPDATE bookings SET status = 'Sedang Disewa' WHERE user_id = (SELECT id FROM users WHERE email = ?) ORDER BY created_at DESC LIMIT 1", [userCredentials.email]);
        }
        log('    Booking status updated to Sedang Disewa.');

        // 4. Fetch History
        log('4. Fetching rental history...');
        const historyRes = await axios.get(`${API_URL}/bookings/my-bookings`, { headers });
        const history = historyRes.data;
        log(`   Fetched ${history.length} bookings.`);

        // 5. Verify Data and Status
        const booking = history.find(b => b.id === bookingId) || history[0]; // Prefer exact ID match
        if (booking) {
            log('5. Verifying booking details...');
            log(`   Booking ID: ${booking.id}`);
            log(`   Status: ${booking.status}`); // Should be 'Selesai' because returnDate (Jan 5) < Today

            if (booking.status === 'Selesai') {
                log('✅ SUCCESS: Booking status is correctly marked as "Selesai" (Finished).');
            } else {
                log(`❌ FAILURE: Booking status is "${booking.status}", expected "Selesai".`);
            }

            if (booking.items.length > 0) {
                log('✅ SUCCESS: Booking items retrieved successfully.');
            } else {
                log('❌ FAILURE: No items found in booking.');
            }

        } else {
            log('❌ FAILURE: Created booking not found in history.');
        }

    } catch (error) {
        log('❌ Verification Failed: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    } finally {
        await pool.end();
    }
}

runVerification();

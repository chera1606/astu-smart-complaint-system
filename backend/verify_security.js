import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testRateLimiting() {
    console.log("🚀 Starting Rate Limiting Test...");
    let successCount = 0;
    let blockedCount = 0;

    for (let i = 0; i < 110; i++) {
        try {
            await axios.get(`${API_URL}/`);
            successCount++;
            process.stdout.write(".");
        } catch (error) {
            if (error.response && error.response.status === 429) {
                blockedCount++;
                process.stdout.write("X");
            } else {
                console.error(`\nError at request ${i}:`, error.code || error.message);
                if (error.response) console.error("Status:", error.response.status);
                break; // Stop on first major failure
            }
        }
    }

    console.log(`\n\n✅ Test Finished:`);
    console.log(`- Requests Allowed: ${successCount}`);
    console.log(`- Requests Blocked (429): ${blockedCount}`);
    
    if (blockedCount > 0) {
        console.log("🛡️ Success: Rate limiter is working!");
    } else {
        console.log("⚠️ Warning: Rate limiter might not be active or threshold is too high for this test.");
    }
}

testRateLimiting();

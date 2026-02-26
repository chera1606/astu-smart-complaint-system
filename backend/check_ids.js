import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const complaintSchema = new mongoose.Schema({
    trackingId: String
});

const Complaint = mongoose.model('Complaint', complaintSchema);

async function check() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_DB);
        const complaints = await Complaint.find({}, 'trackingId').sort({ trackingId: -1 }).limit(20);
        console.log('Last 20 complaints:');
        complaints.forEach(c => console.log(c.trackingId));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();

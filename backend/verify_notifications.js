import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/model/user.model.js';
import Complaint from './src/model/complaint.model.js';
import Notification from './src/model/notification.model.js';
import { createComplaint, updateComplaintStatus } from './src/module/complaint/complaint.controller.js';

dotenv.config();

async function verifyNotifications() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_DB);

        // Find a student, an admin, and a staff member
        const student = await User.findOne({ role: 'student' });
        const adminUser = await User.findOne({ role: 'admin' });
        const staffUser = await User.findOne({ role: 'staff' });

        if (!student || !adminUser || !staffUser) {
            console.error('❌ Could not find test users (student, admin, or staff).');
            process.exit(1);
        }

        console.log(`Test Users: \n Student: ${student.name} \n Admin: ${adminUser.name} \n Staff: ${staffUser.name} (Dept: ${staffUser.departmentId})`);

        // Clear notifications for these users first to have a clean slate
        await Notification.deleteMany({ recipient: { $in: [adminUser._id, staffUser._id, student._id] } });

        // 1. Simulate Student Portal: Create Complaint
        console.log('\n--- Simulating New Complaint ---');
        let responseData;
        const reqCreate = {
            user: student,
            body: {
                departmentId: staffUser.departmentId,
                title: 'Test Notification Complaint',
                description: 'Testing if admin and staff get notified',
                category: 'Facilities',
                location: 'Block 10'
            }
        };
        const resCreate = {
            status: (code) => ({
                json: (data) => { responseData = data; return data; }
            }),
            json: (data) => { responseData = data; return data; }
        };
        await createComplaint(reqCreate, resCreate);
        const created = responseData;

        if (!created || !created.trackingId) {
            console.error('❌ Complaint creation failed in test:', created);
            process.exit(1);
        }
        console.log('Complaint created:', created.trackingId);

        // Check if Admin and Staff were notified
        const adminNotif = await Notification.findOne({ recipient: adminUser._id, title: 'New Complaint Submitted' });
        const staffNotif = await Notification.findOne({ recipient: staffUser._id, title: 'New Assigned Complaint' });

        console.log(adminNotif ? '✅ Admin Notified' : '❌ Admin NOT Notified');
        console.log(staffNotif ? '✅ Staff Notified' : '❌ Staff NOT Notified');

        // 2. Simulate Staff Portal: Update Status
        console.log('\n--- Simulating Status Update by Staff ---');
        const reqUpdate = {
            user: staffUser,
            params: { id: created._id },
            body: { status: 'in-progress', remark: 'Taking a look now' }
        };
        const resUpdate = { status: (code) => ({ json: (data) => data }) };
        await updateComplaintStatus(reqUpdate, resUpdate);

        // Check if Student and Admin were notified
        const studentNotif = await Notification.findOne({ recipient: student._id, title: 'Complaint Status Updated' });
        const adminUpdateNotif = await Notification.findOne({ recipient: adminUser._id, title: 'Complaint Updated by Staff' });

        console.log(studentNotif ? '✅ Student Notified' : '❌ Student NOT Notified');
        console.log(adminUpdateNotif ? '✅ Admin Notified of Staff Update' : '❌ Admin NOT Notified of Staff Update');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

verifyNotifications();

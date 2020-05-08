const admin = require('../firebase-admin/admin');

const db = admin.firestore();
const bookingRef = db.collection('booking')
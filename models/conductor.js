const admin = require('../firebase-admin/admin');

const db = admin.firestore();
const userRef = db.collection('users');
const conductorRef = db.collection('conductor');

exports.createConductor = (ownerUid,uid,firstName, secondName, email, phoneNumber,address,nic) => {
    
    let batch = db.batch();

    let userDoc = userRef.doc(uid);
    batch.set(userDoc, {
        "firstName":firstName, 
        "secondName":secondName, 
        "email":email, 
        "phoneNumber":phoneNumber,
        "role":"CONDUCTOR", //role added
        "phone_verified": true
    });

    // set owner details
    let ownerDoc = conductorRef.doc(uid);
    batch.set(ownerDoc,{
        "address":address,
        "NIC":nic,
        "owner_id":ownerUid

    });

    // Commit the batch
    return batch.commit();

    
}

exports.getConductors = (ownerUid) => {
    return conductorRef.where('owner_id','==',ownerUid).get();
}

exports.getConductorFromUid = (conductorUid) => {
    return conductorRef.doc(conductorUid).get();
}
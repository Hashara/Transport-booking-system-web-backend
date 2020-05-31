const admin = require('firebase-admin')

const db = admin.firestore();
const ownerrRef = db.collection('owner');
const userRef = db.collection('users');
const newOwnerRef = db.collection('newOwner');

exports.createOwner = (uid,auid,firstName, secondName, email, phoneNumber,phone_verified,address,nic)=>{

    // Get a new write batch
    let batch = db.batch();

    // update new owner status
    let newOwnerDoc = newOwnerRef.doc(uid);
    batch.update(newOwnerDoc, {status: 'ACCEPTED'});

    // set user details
    let userDoc = userRef.doc(auid);
    batch.set(userDoc, {
        "firstName":firstName, 
        "secondName":secondName, 
        "email":email, 
        "phoneNumber":phoneNumber,
        "role":"OWNER", //role added
        "phone_verified": phone_verified
    });

    // set owner details
    let ownerDoc = ownerrRef.doc(auid);
    batch.set(ownerDoc,{
        "address":address,
        "NIC":nic,
        "request uid":uid

    });

    // Commit the batch
    return batch.commit().then(function () {
        
    });


}

exports.getAllOwners = () => {
    return ownerrRef.get()
}
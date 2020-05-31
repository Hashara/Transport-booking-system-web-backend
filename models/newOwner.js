const admin = require('firebase-admin')
const db = admin.firestore();
const newOwnerRef = db.collection('newOwner');

exports.saveData = (name, phoneNumber, address,date)=>{
    

    return newOwnerRef.doc().set({
        name,
        phoneNumber,
        address,
        status:"PENDING",
        date

    })
    
}


exports.findPending = () =>{

    return newOwnerRef.where('status', '==', 'PENDING').get();

}


exports.updateStatus = (uid,nextstatus)=>{

    let OwnerRef = newOwnerRef.doc(uid);
    const updateStatus = OwnerRef.update({
        status: nextstatus
    })

    return updateStatus;   
   
}
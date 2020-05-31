const admin = require('firebase-admin')

const db = admin.firestore();
const newBusRequestRef = db.collection('newBusRequest');

exports.newRequest = (routeNo,origin,destination,type,busNo,uid,duration) => {

    var date = new Date(); 
    return newBusRequestRef.doc().set({
        routeNo,
        origin,
        destination,
        type,
        busNo,
        date,
        owner:uid,
        status:"PENDING",
        duration
    })

}


exports.findPending = () =>{

    return newBusRequestRef.where('status', '==', 'PENDING').get();

}

exports.rejectBus = (busId, uid) => {

    let newBusRequestDoc = newBusRequestRef.doc(busId);


    return newBusRequestDoc.update({
        status: 'REJECTED',
        adminUId:uid 
    });


}

exports.getBusByReqId = (reqId) =>{
    return newBusRequestRef.doc(reqId).get();
}
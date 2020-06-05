const admin = require('firebase-admin')

const db = admin.firestore();
const busRef = db.collection('bus');
const routeRef = db.collection('busRoute');
const requestRef = db.collection('newBusRequest');

exports.createBus = (reqId,routeId,adminUid,ownerId,busNo,type,windowSeatPrice,JumpingSeatPrice,NormalSeatPrice)=>{

    // Get a new write batch
    let batch = db.batch();

    //update request status
    let newBusReqDoc = requestRef.doc(reqId)
    batch.update(newBusReqDoc, {status: 'ACCEPTED',adminUId:adminUid});

    // set bus details 
    let busDoc = busRef.doc(reqId);
    batch.set(busDoc, {
        routeId,
        ownerId,
        reqId,
        busNo,
        type,
        windowSeatPrice,
        JumpingSeatPrice,
        NormalSeatPrice
    });

    // Commit the batch
    return batch.commit();

}

exports.getAllbusesOfOwner = (ownerId) =>{
    return busRef.where('ownerId','==',ownerId).get();
}

exports.getBusFromBusId = (busId) =>{
    return busRef.doc(busId).get();
}
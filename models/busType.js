const admin = require('firebase-admin')

const db = admin.firestore();
const busTypeRef = db.collection('busType');

exports.addBusType = ( type,name,seats,windowSeats,jumpingSeats,) => {

    return busTypeRef.doc().set({
        type,
        name,
        seats,
        windowSeats,
        jumpingSeats
    })

}

exports.getBusType = (type) =>{
    return busTypeRef.where('type', '==', type).get();
}
const admin = require('../firebase-admin/admin');

const db = admin.firestore();
const turnRef = db.collection('turn');

exports.addTurn = (busId,ConductorId,departureTime,startStation,ownerUid,routeId,numberOfSeats,windowSeatsArray,jumpingSeatsArray,NormalSeatPrice, windowSeatPrice, JumpingSeatPrice, duration,TypeName) => {

    var date = new Date(); 
    var departureTimeStanded = new Date(departureTime)

    var docId = busId + " " + departureTime

    let batch = db.batch();

    let newTurnDoc = turnRef.doc(docId)
    batch.set(newTurnDoc,{
        busId,
        ConductorId,
        departureTime:departureTimeStanded,
        startStation,
        addedDate: date,
        ownerUid,
        routeId,
        NormalSeatPrice,
        duration,
        TypeName
    })

    console.log(jumpingSeatsArray)
    for (var i = 1; i < numberOfSeats+1; i++) {
        let collectiontest = turnRef.doc(docId).collection('booking').doc(i.toString())
        var seatType = "NORMAL"
        var price = NormalSeatPrice
        var isWindowSeat = windowSeatsArray.includes(i)

        if(isWindowSeat){
            seatType = "WINDOW"
            price = windowSeatPrice
        }else if (typeof JumpingSeatPrice != "boolean"){
            var isJumpingSeat = jumpingSeatsArray.includes(i)
            if (isJumpingSeat){
                seatType = "JUMPING"
                price = JumpingSeatPrice
            }
        }

        batch.set(collectiontest,{
            status:"Available",
            seatType,
            price
        });
        
    }
    

    //for loop ekakin collection eka athule ewa hadanna
    return batch.commit();
}


exports.getTurnsByRouteID = (routeId) => {
    return turnRef.where('routeId', '==', routeId).get();
}

exports.getActiveTurnsOfConductor = (conductorUid) => {
    return turnRef.where('ConductorId','==',conductorUid).get()
}

exports.getTurnByTurnID = (turnId) =>{
    return turnRef.doc(turnId).get()
}

exports.getAllSeats = (turnId) =>{
    return turnRef.doc(turnId).collection('booking').get()
}

exports.getSeat = (seatId, turnId) =>{
    return  turnRef.doc(turnId).collection('booking').doc(seatId).get()
}

exports.getBookingDeatailsBySeat = (turnId,seatId) =>{
    return turnRef.doc(turnId).collection('booking').doc(seatId).get()
}

exports.getFutureTurns= () => {
    return turnRef.where('departureTime', '>=', new Date(new Date().getTime() + 3600)).get()
}
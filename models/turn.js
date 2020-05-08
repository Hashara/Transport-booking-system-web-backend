const admin = require('../firebase-admin/admin');

const db = admin.firestore();
const turnRef = db.collection('turn');

exports.addTurn = (busId,ConductorId,departureTime,startStation,ownerUid,routeId,numberOfSeats,windowSeatsArray,jumpingSeatsArray,NormalSeatPrice, windowSeatPrice, JumpingSeatPrice, duration) => {

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
        duration
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
            status:"Availble",
            seatType,
            price
        });
        
    }
    

    //for loop ekakin collection eka athule ewa hadanna
    return batch.commit();
}
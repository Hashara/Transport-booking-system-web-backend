const admin = require('../firebase-admin/admin');

const db = admin.firestore();
const bookingRef = db.collection('booking')
const turnRef = db.collection('turn')
const passengerRef = db.collection('passenger')
const turnModel = require('../models/turn')
const cancelRef = db.collection('cancelledBooking')

exports.addBooking = (seatIdArray, turnId, passengerUID,startStation, endStation, conductorPhone, routeId,
     bustype, departureTime, arrivalTime, busNo,priceArray,res) => {
    
    let batch = db.batch();

    let passengerBookingRef = passengerRef.doc(passengerUID).collection('booking')

    let turnBookingRef =turnRef.doc(turnId).collection('booking')

    let date = new Date()

    var i= 0 
    seatIdArray.forEach(seat => {

        const seatId = seat.toString()
        const price = priceArray[i++]
        console.log(price)
      
        const bookingId = turnId + " " + passengerUID + " " + seatId
        
        batch.update(turnBookingRef.doc(seatId),{
            status: 'Unavailable',
            booking: bookingId
        })

        //update booking
        batch.set(bookingRef.doc(bookingId),{
            turnId,
            startStation,
            endStation,
            passengerUID,
            seatId,
            price,
            date
        })

        //update passenger booking
        batch.set(passengerBookingRef.doc(bookingId),{
            turnId,
            startStation,
            endStation,
            routeId,
            seatId,
            price,
            busNo,
            conductor_contact:conductorPhone,
            departureTime,
            arrivalTime,
            bustype,
            paymentState: "Paid",
            date


        })

        if (i === seatIdArray.length){
            // console.log("hi")
            batch.commit()
            .then(response=>{
                // console.log("THEN")
                return res.status(200).json({
                    message:"Sucess"
                })
            })
            .catch(err=>{
                // console.log("ERROR")
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
        }
    });



}

exports.getTurnFromBookingId = (bookingId) =>{
    return bookingRef.doc(bookingId).get()
}

exports.cancelBooking = (bookingId, turnId, seatId,passengerUID,price) =>{
    let batch = db.batch()

    var curDate = new Date()
    let bookingDoc = bookingRef.doc(bookingId)
    batch.delete(bookingDoc)

    let turnBookingDoc = turnRef.doc(turnId).collection('booking').doc(seatId)
    batch.update(turnBookingDoc,{
        status:"Available",
        booking:""
    })

    let passengerBookingDoc = passengerRef.doc(passengerUID).collection('booking').doc(bookingId)
    batch.update(passengerBookingDoc,{
        paymentState:"Canceled",
        penalty: price/2,
        cancelledDate: curDate
    })

    let cancelBookingDoc = cancelRef.doc(bookingId)
    batch.set(cancelBookingDoc,{
        passengerUID,
        turnId,
        curDate,
        penalty: price/2,
        cancelledDate: curDate
    })
    return batch.commit();
}

exports.getBookingDetails = (bookingId) =>{
    return bookingRef.doc(bookingId).get();
}
const bookingModel = require('../models/booking')
const turnModel = require('../models/turn')
const userModel = require('../models/user')
const busModel = require('../models/bus')
const typeModel = require('../models/busType')
const helpers = require('../controllers/helpers')

exports.bookSeats = (req,res) => {
    const passengerUID = req.params.uid;

    const { seatIdArray, turnId, startStation, endStation } = req.body

    //check sear array 1-4 
    if (seatIdArray.length> 4 || seatIdArray <1){
        return res.status(400).json({
            error:"Booking seats must be between 1 - 4"
        })
    }
    else{
        console.log("1")
        const getTurnDetails = turnModel.getTurnByTurnID(turnId)

        getTurnDetails
        .then(doc=>{
            // console.log(doc.data())
            console.log("2")
            const busId = doc.data().busId
            const ConductorId = doc.data().ConductorId
            const departureTime =doc.data().departureTime.toDate()
            const routeId = doc.data().routeId
            
            const arrivalTime = helpers.addMillis(departureTime,doc.data().duration)

            const getConductorData = userModel.getUserData(ConductorId)
            getConductorData
            .then(doc=>{
                // console.log(doc.data())
                const conductorPhone = doc.data().phoneNumber
                const getBusData = busModel.getBusFromBusId(busId)

                getBusData
                .then(doc=>{
                    // console.log(doc.data())
                    const busNo = doc.data().busNo
                    const type = doc.data().type

                    const getTypeDetails = typeModel.getBusType(type)

                    getTypeDetails
                    .then(docs=>{

                        docs.forEach(doc=>{
                            // console.log(doc.data())
                            const bustype = doc.data().name
                            console.log(bustype)
                            
                            var i = 0
                            var priceArray = []
                            seatIdArray.forEach(seat=> {
                                const seatId = seat.toString()

                                const getSeatDetails = turnModel.getSeat(seatId,turnId)
        
                                getSeatDetails
                                .then(doc=>{
                                    // console.log(doc.data())
                                    //check availabality
                                    if (doc.data().status !== 'Available'){
                                        return res.status(400).json({
                                            error:"Seat unavailable"
                                        })
                                    }
                                    else{
                                        const price = doc.data().price
                                        i+=1
                                        priceArray.push(price)
                                        //  const bookSeats =  bookingModel.addBooking(seatIdArray, turnId, passengerUID,startStation, endStation, conductorPhone, routeId,bustype, departureTime, arrivalTime, busNo)
                                        if (i === seatIdArray.length){
                                            console.log("if")
                                            const bookSeats =  bookingModel.addBooking(seatIdArray, turnId, passengerUID,startStation, endStation, conductorPhone, routeId,bustype, departureTime, arrivalTime, busNo,priceArray,res)
                                        
                                                                                   
                                        }
                                    }
                                })
                                .catch(err=>{
                                    return res.status(400).json({
                                        error:"Seat unavailable"
                                    })
                                })

                            })
                           
                        })

                       
                        
                    })
                    .catch(err=>{
                        return res.status(400).json({
                            error:"Something went wrong"
                        })
                    })

                })
                .catch(err=>{
                    return res.status(400).json({
                        error:"Something went wrong"
                    })
                })
            })
            .catch(err=>{
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
            
        })
        .catch(err=>{
            return res.status(400).json({
                error:"Booking seats must be between 1 - 4"
            })
        })
        // const bookSeats =  bookingModel.addBooking(seatIdArray, turnId, passengerUID, startStation, endStation)

    }
    //get seat deatails 



}

exports.cancelBooking = (req,res) => {
    const passengerUID = req.params.uid;

    const { bookingId } = req.body

    const bookingIdSplited = bookingId.split(" ")

    console.log(bookingIdSplited[0])
    console.log(bookingIdSplited[1])
    console.log(bookingIdSplited[2])
    console.log(bookingIdSplited[3])
    const turnId = bookingIdSplited[0]+" " +bookingIdSplited[1]
    const passengerUID_fromBookingId = bookingIdSplited[2]
    const seatId =bookingIdSplited[3]

    const getHourDiff = helpers.hourDiff(new Date(bookingIdSplited[1]))
    if(passengerUID !== passengerUID_fromBookingId){
        return res.status(400).json({
            error:"Something went wrong"
        })
    }
    else if(getHourDiff<24 ){
        return res.status(400).json({
            message:"Sorry you can not cancel booking now"
        })
    }
    else{
        // const getTurnFormBooking = bookingModel.getTurnFromBookingId(bookingId, turnId, seatId,passengerUID)

         const getTurnFormBooking = bookingModel.getTurnFromBookingId(bookingId)

        getTurnFormBooking
        .then(doc=>{
            // console.log(doc.data())
            // console.log(doc.data().turnId === turnId)
            const price = doc.data().price

            const cancel = bookingModel.cancelBooking(bookingId, turnId, seatId,passengerUID, price)

            cancel
            .then(Response=>{
                return res.status(200).json({
                    message:"Cancelled successfully"
                })
            })
            .catch(err=>{
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
        })
        .catch(err=>{
            return res.status(400).json({
                error:"Something went wrong"
            })
        })

    }
    // console.log(getHourDiff)
   
}

exports.passengerViewPastBooking = (req,res) => {

    const passengerUID = req.params.uid

    const getBookedTurns = bookingModel.getPastBookingsByPassenger(passengerUID)

    passengerBooking (getBookedTurns,res)
    
}

exports.passengerViewActiveBooking = (req,res) => {
    const passengerUID = req.params.uid

    const getBookedTurns = bookingModel.getActiveBookingsByPassenger(passengerUID)

    passengerBooking (getBookedTurns,res)
}


function passengerBooking (getBookedTurns,res){
    getBookedTurns
    .then(snapshot => {
        // snapshot.forEach(doc => {
        //     console.log(doc.data())
        // })
        if (snapshot.empty){
            return res.status(200).json({
                message:"No turns found"
            })
        }
        const turns = snapshot.docs.map(doc => Object.assign(doc.data(), {bookingid: doc.id}))
        return res.status(200).json({
            turns
        })
    })
    .catch(err=>{
        console.log(err)
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

exports.passengerToWaitingList = (req,res) => {
    const passengerId = req.params.uid

    const { turnId } = req.body

    const availableSeats = bookingModel.getAvailableSeats(turnId)

    availableSeats
    .then(snapshot => {
        if(snapshot.empty){
            // console.log("empty")
            const waitingId = turnId + " " + passengerId

            //check already in waiting list
            const passenerWaiting = bookingModel.getTheWaitingFromWaitingID(waitingId, passengerId)

            passenerWaiting
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    return res.status(400).json({
                        message: "You are already in waiting list"
                    })
                  } else {
                    // console.log("hi")
                    const addTowaiting = bookingModel.addToWaitingList(waitingId, turnId, passengerId)
                    addTowaiting
                    .then(()=>{
                        return res.status(200).json({
                            message : "Added to waiting llist successfully"
                        })
                    })
                    .catch(err=>{
                        console.log(err)
                        return res.status(400).json({
                            error:"Something went wrong"
                        })
                    })

                  }
            })
            .catch(err=>{
                console.log(err)
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
        }
        // snapshot.forEach(doc => {
        //     console.log(doc.data())
        // })
        else{
            return res.status(400).json({
                message: "You cannot be in waiting list when seats are available"
            })
        }
    })
    .catch(err=>{
        console.log(err)
        return res.status(400).json({
            error:"Something went wrong"
        })
    })

    
}
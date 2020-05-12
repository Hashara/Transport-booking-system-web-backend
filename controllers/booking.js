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

// exports.cancelBooking = (req,res) => {
//     const passengerUID = req.params.uid;

//     const { bookingId } = req.body


// }
const turnModel = require('../models/turn')
const busModel = require('../models/bus')
const conductorModel = require('../models/conductor')
const helpers = require('./helpers')
const busTypeModel = require('../models/busType')
const routeModel = require('../models/route')
const bookingModel = require('../models/booking')
const userModel = require('../models/user')

exports.addTurn =  async (req,res) => {

    const ownerUid = req.params.uid;

    const { busId,ConductorId,departureTime,startStation } = req.body

    //departure date should be MM/DD/YYYY formath
    //check departure time > today date + 3d
    const dateDiff = helpers.dateDiff(departureTime)
    // console.log(dateDiff)
    if (dateDiff < 2) {
        return res.status(400).json({
            error:"Date differrnce must be at leat 3"
        })
    }

    //todo: check time slot availbale for bus and conductors

    const getConductor = conductorModel.getConductorFromUid(ConductorId)
    getConductor
    .then(doc => {
        if (ownerUid !== doc.data().owner_id){
            return res.status(400).json({
                error:"Invalid conductor"
            })
        }
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    }) 

    const getBus = busModel.getBusFromBusId(busId)
    getBus
    .then(async doc => {

        console.log(doc.data())
        const routeId = doc.data().routeId
        var stations = routeId.split(" ");
        
        //validate owner
        if (ownerUid !== doc.data().ownerId){
            return res.status(400).json({
                error:"Invalid bus"
            })
        }

        //validate start station
        if (startStation !== stations[1] && startStation !== stations[2]){
            return res.status(400).json({
                error:"Invalid start station"
            })
        }
        //get prices
        const NormalSeatPrice = doc.data().NormalSeatPrice
        const windowSeatPrice = doc.data().windowSeatPrice
        const JumpingSeatPrice = doc.data().JumpingSeatPrice

        //get duration
        const getDuration = routeModel.getRoute(routeId)
        

        // console.log("hi")

        //get seat deatils
        const type = doc.data().type
        // console.log(type)
        const busTypeDetails  = busTypeModel.getBusType(type)
        busTypeDetails
        .then(snapshot => {
            if (snapshot.size !== 1){
                return res.status(400).json({
                    error:"Invalid type"
                })
            }
            else {
                snapshot.forEach(doc =>{
                    // console.log(doc.data())
                    
                    const numberOfSeats = doc.data().seats
                    const windowSeatsArray = doc.data().windowSeats
                    const jumpingSeatsArray = doc.data().jumpingSeats
                    const TypeName = doc.data().name
                    
                    getDuration
                    .then(documnet => {
                        console.log(documnet.data().duration)
                        const duration = documnet.data().duration
                        const addTurn = turnModel.addTurn(busId,ConductorId,departureTime,startStation,ownerUid,routeId,numberOfSeats,
                            windowSeatsArray,jumpingSeatsArray,NormalSeatPrice, windowSeatPrice, JumpingSeatPrice, duration,TypeName)
                        addTurn
                        .then(() => {
                            return res.status(200).json({
                                message:"Turn added successfully"
                            })
                        })
                        .catch(()=>{
                            return res.status(200).json({
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
            }
        })

    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })

        
}

exports.getTurnByRouteID = (req,res) => {
    
    const {routeId} = req.body
    const getTurns = turnModel.getTurnsByRouteID(routeId)

    getTurns
    .then(snapshot=>{
        // console.log(doc.data())
        if(snapshot.empty){
            return res.status(200).json({
                message:"No turns found"
            })
        }

        const jsonArray = {
            turns:[]
        }
        var i = 0
        snapshot.forEach(doc=>{

            // console.log(helpers.hourDiff(doc.data().departureTime.toDate()))
            
            // if (helpers.hourDiff())
            const departureTime = doc.data().departureTime.toDate()

            if (helpers.hourDiff(departureTime)>1){
                const NormalSeatPrice = doc.data().NormalSeatPrice
                const startStation = doc.data().startStation
                const turnId = doc.id
                const duration = doc.data().duration
                const arrivalTime = helpers.addMillis(departureTime,duration)
                const endStation = helpers.getOtherStation(startStation,routeId)
                const busType = doc.data().TypeName

                // console.log(departureTime)
                // console.log(arrivalTime)
                // console.log(NormalSeatPrice)
                // console.log(startStation)
                // console.log(turnId)
                // console.log(duration/ (1000*60*60))
                // console.log(endStation)
                // console.log(busType)
                
                var jsonData = {
                turnId,
                departureTime,
                startStation,
                arrivalTime,
                endStation,
                NormalSeatPrice,
                busType
                }
                

                //push json data in to array
                jsonArray.turns.push(jsonData);
            }
            
            i+=1
            if (i === snapshot.size){
                return res.status(200).json({
                    turns:jsonArray.turns
                })
            }
        })

    })
    .catch(err=>{
        console.log(err)
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

exports.getActiveTurnsByConductor = (req,res) => {
    const conductorUid = req.params.uid;

    const turns = turnModel.getActiveTurnsOfConductor(conductorUid)
    turns
    .then(snapshot =>{
        var i = 0
        var jsonArray = {
            turns:[]
        }
        snapshot.forEach(doc=>{
            // console.log(doc.data())
            const departureTime = doc.data().departureTime.toDate()
            const duration = doc.data().duration
            // console.log(departureTime)
            const arrivalTime = helpers.addMillis(departureTime,duration)
            // console.log(arrivalTime)
            // console.log(new Date())
            
            if(arrivalTime >= new Date()){
                // console.log(doc.data())
                
                const NormalSeatPrice = doc.data().NormalSeatPrice
                const startStation = doc.data().startStation
                const turnId = doc.id
                // const duration = doc.data().duration
                const endStation = helpers.getOtherStation(startStation,doc.data().routeId)
                const busType = doc.data().TypeName
                const addedDate = doc.data().addedDate
                // console.log(doc.data())
                const getBusNumber = busModel.getBusFromBusId(doc.data().busId)

                getBusNumber
                .then(doc=>{
                    // console.log(doc.data())
                    const busNo = doc.data().busNo
                    var jsonData = {
                        turnId,
                        busNo,
                        departureTime,
                        startStation,
                        arrivalTime,
                        endStation,
                        NormalSeatPrice,
                        busType,
                        addedDate
                    }
                        
        
                        //push json data in to array
                    jsonArray.turns.push(jsonData);

                    i+=1

                    if (i === snapshot.size){
                        return res.status(200).json({
                            turns:jsonArray.turns
                        })
                    }
                })
                .catch(err=>{
                    return res.status(400).json({
                        error:"Something went wrong"
                    })
                })
               
                // console.log(jsonArray)
            }
            else{
                i+=1
                if (i === snapshot.size){
                    return res.status(200).json({
                        turns:jsonArray.turns
                    })
                }
            }
            
        })
        // console.log(snapshot) 
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

exports.getPastTurns = (req,res) => {
    const conductorUid = req.params.uid;

    const turns = turnModel.getActiveTurnsOfConductor(conductorUid)
    turns
    .then(snapshot =>{
        var i = 0
        var jsonArray = {
            turns:[]
        }
        snapshot.forEach(doc=>{
            // console.log(doc.data())
            const departureTime = doc.data().departureTime.toDate()
            const duration = doc.data().duration
            // console.log(departureTime)
            const arrivalTime = helpers.addMillis(departureTime,duration)
            // console.log(arrivalTime)
            // console.log(new Date())
            
            if(arrivalTime < new Date()){
                // console.log(doc.data())
                
                const NormalSeatPrice = doc.data().NormalSeatPrice
                const startStation = doc.data().startStation
                const turnId = doc.id
                // const duration = doc.data().duration
                const endStation = helpers.getOtherStation(startStation,doc.data().routeId)
                const busType = doc.data().TypeName
                const addedDate = doc.data().addedDate
                // console.log(doc.data())
                const getBusNumber = busModel.getBusFromBusId(doc.data().busId)

                getBusNumber
                .then(doc=>{
                    // console.log(doc.data())
                    const busNo = doc.data().busNo
                    var jsonData = {
                        turnId,
                        busNo,
                        departureTime,
                        startStation,
                        arrivalTime,
                        endStation,
                        NormalSeatPrice,
                        busType,
                        addedDate
                    }
                        
        
                        //push json data in to array
                    jsonArray.turns.push(jsonData);

                    i+=1

                    if (i === snapshot.size){
                        return res.status(200).json({
                            turns:jsonArray.turns
                        })
                    }
                })
                .catch(err=>{
                    return res.status(400).json({
                        error:"Something went wrong"
                    })
                })
               
                // console.log(jsonArray)
            }
            else{
                i+=1
                if (i === snapshot.size){
                    return res.status(200).json({
                        turns:jsonArray.turns
                    })
                }
            }
            
        })
        // console.log(snapshot) 
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

exports.getSeatsDetailsOfTurnByPassenger = (req,res) => {

    const { turnId } = req.body

    //check date
    const getTurnData = turnModel.getTurnByTurnID(turnId)

    getTurnData
    .then(doc=> {
        console.log(doc.data())
        // const departureTime = doc.data().departureTime.toDate()
        const differenceInhours = helpers.hourDiff(doc.data().departureTime.toDate())
        // console.log(getDifferenceInhours)
        if (differenceInhours>1){
            const seatsDetails = turnModel.getAllSeats(turnId)

            seatsDetails
            .then(snapshot=>{
                if(snapshot.empty){
                    res.status(400)
                    return res.json({
                        error:"Something went wrong"
                    })
                }
                var seats = snapshot.docs.map(doc => Object.assign({
                    id: doc.id,
                    status : doc.data().status,
                    seatType: doc.data().seatType,
                    price: doc.data().price
                }))
                
                return res.status(200).json({
                    seats,
                })
            })
            .catch(err=>{
                res.status(400)
                return res.json({
                    error:"Something went wrong"
                })
            })
        }

        else{
            return res.status(200).json({
                message: "You ca not book this bus"
            })
        }
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })

    // console.log(turnId)
    

}

exports.getSeatsDetailsOfTurnByConductor = (req,res) =>{
  
    const conductorUid = req.params.uid;

    const {turnId} = req.body

    const getTurnData = turnModel.getTurnByTurnID(turnId)

    getTurnData
    .then(doc=>{
        // console.log(doc.data())
        // console.log(doc.data())
        if (conductorUid !== doc.data().ConductorId){
            return res.status(400).json({
                error:"You don't have access"
            })
        }
        else if(helpers.addMillis(doc.data().departureTime.toDate(),doc.data().duration)< new Date()){
            return res.status(400).json({
                error:"You don't have access to past turns"
            })
        }
        else{
            // console.log("else")
            const getBooking = turnModel.getAllSeats(turnId)
            getBooking
            .then(snapshots =>{
                var seats = snapshots.docs.map(doc => Object.assign({
                    id: doc.id,
                    status : doc.data().status,
                    seatType: doc.data().seatType,
                    price: doc.data().price,
                    booking: doc.data().booking
                }))

                return res.status(200).json({
                    seats
                })
            })
        }
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

exports.getPassengerOfTheSeatByConductor = (req,res) =>{
    const conductorUid = req.params.uid;

    const { turnId, seatId} =req.body

    const getTurnData = turnModel.getTurnByTurnID(turnId)

    getTurnData
    .then(doc=>{
        if (conductorUid !== doc.data().ConductorId){
            return res.status(400).json({
                error:"You don't have access"
            })
        }
        else if(helpers.addMillis(doc.data().departureTime.toDate(),doc.data().duration)< new Date()){
            return res.status(400).json({
                error:"You don't have access to past turns"
            })
        }
        else if(doc.data().departureTime.toDate()>helpers.addMillis(new Date(),3600000)){
           
            return res.status(400).json({
                error:"You don't have access yet"
            })
        }
        else{

            // console.log(doc.data().departureTime.toDate())
            // // console.log(new Date().toString())
            // console.log("bfj")
            // console.log(helpers.addMillis(new Date(),3600000))

            const bookingId = turnModel.getBookingDeatailsBySeat(turnId, seatId)

            bookingId
            .then(doc=>{
                // console.log(doc.data().booking === undefined)
                if(doc.data().booking === undefined || doc.data().booking === ""){
                    return res.status(200).json({
                        message:"Not yet booked"
                    })
                }
                else{
                    
                    const bookingDeatils = bookingModel.getBookingDetails(doc.data().booking)
                    bookingDeatils
                    .then(doc=>{
                        const startStation = doc.data().startStation
                        const endStation = doc.data().endStation

                        const getPassengerDetails = userModel.getUserData(doc.data().passengerUID)

                        getPassengerDetails
                        .then(doc=>{
                            // console.log(doc.data())
                            const passengerName = doc.data().firstName + " " + doc.data().secondName
                            const passengerPhone = doc.data().phoneNumber

                            // console.log(startStation, endStation, passengerName, passengerPhone)
                            return res.status(200).json({
                                startStation,
                                endStation, 
                                passengerName, 
                                passengerPhone
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
            })
            .catch(err=>{
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
        }
    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })

}
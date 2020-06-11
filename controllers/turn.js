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
        // console.log(doc.data())
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
                message: "You can not book this bus"
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

exports.ownerViewActiveTurns = (req,res) => {
    const ownerUid = req.params.uid;

    const getTurns = turnModel.getActiveTurnsByOwnerUID(ownerUid)
  
    ownertuns(res,getTurns)
}

exports.ownerViewPastTurns = (req,res) => {
    const ownerUid = req.params.uid;

    const getTurns = turnModel.getPastTurnsByOwnerUID(ownerUid)
  
    ownertuns(res,getTurns)
}

exports.getFullDetailedTurn = (req,res) =>{
    const ownerUid = req.params.uid;

    const { turnId } = req.body
    const getTurn = turnModel.getTurnByTurnID(turnId)
    getTurn
    .then(doc => {
        if (doc.data().ownerUid !== ownerUid){
            return res.status(403).json({
                message: "You dont have access"
            })
        }
        else{
            // console.log("hi")
            
            const busId = doc.data().busId
            const startStation = doc.data().startStation            
            const addedDate = doc.data().addedDate
            const ConductorId = doc.data().ConductorId
            const departureTime = doc.data().departureTime
            const TypeName = doc.data().TypeName

            const getBooking = turnModel.getAllSeats(turnId)
            
            getBooking
            .then(snapshots => {
                // console.log("getBooking")
                var seats = snapshots.docs.map(doc => 
                    Object.assign({
                    id: doc.id,
                    status : doc.data().status,
                    seatType: doc.data().seatType,
                    price: doc.data().price
                    })
                )

                var windowSeatsEarning = 0
                var jumpingSeatsEarning = 0
                var normalSeatsEarning = 0

                const getAllBookedSeats = turnModel.getBookedSeats(turnId)
                getAllBookedSeats
                .then(snapshots =>{
                    snapshots.forEach(doc =>{
                        // console.log("foreach")
                        if (doc.data().seatType === 'NORMAL'){
                            normalSeatsEarning += doc.data().price
                        }
                        else if (doc.data().seatType === 'WINDOW'){
                            windowSeatsEarning += doc.data().price
                        }
                        else{
                            jumpingSeatsEarning += doc.data().price
                        }

                    })
                })
                .then(()=>{
                    // console.log("then")
                    const getConductorDetails = conductorModel.getConductorFromUid(ConductorId)
                    getConductorDetails
                    .then(doc => {
                        
                        const address = doc.data().address
                        const NIC = doc.data().NIC
                        
                        const getOtherDetails = userModel.getUserData(ConductorId)
                        getOtherDetails
                        .then(doc=>{
                            // console.log("get")
                            const name = doc.data().firstName + " " + doc.data().secondName
                            const phoneNumber = doc.data().phoneNumber
                            const email = doc.data().email
        
                            const getBusDetails = busModel.getBusFromBusId(busId)
                            getBusDetails
                            .then(doc=>{
                            //    console.log("bus")
                                const NormalSeatPrice = doc.data().NormalSeatPrice
                                const windowSeatPrice = doc.data().windowSeatPrice
                                const busNo = doc.data().busNo
                                const JumpingSeatPrice = doc.data().JumpingSeatPrice

                                const getCanceledBooking = bookingModel.getCanceledBookingForATurn(turnId)
                                getCanceledBooking
                                .then(snapshots=> {
                                    var canceledBooking = 0

                                    // console.log("cancel")
                                    // console.log(snapshots.empty)
                                    if (snapshots.empty){
                                        return res.status(200).json({
                                                turnId,
                                                busId,
                                                NormalSeatPrice,
                                                windowSeatPrice,
                                                JumpingSeatPrice,
                                                busNo,
                                                startStation,
                                                addedDate,
                                                departureTime,
                                                TypeName,
                                                seats:seats,
                                                windowSeatsEarning,
                                                normalSeatsEarning,
                                                jumpingSeatsEarning,
                                                canceledBooking,
                                                total_erning: windowSeatsEarning + normalSeatsEarning + jumpingSeatsEarning + canceledBooking,
                                                conductor_detils:{
                                                    ConductorId,
                                                    NIC,
                                                    name,
                                                    phoneNumber, 
                                                    address,
                                                    email
                                                }
                                            })
                                    }
                                    var i = 0 
                                    snapshots.forEach(doc=>{
                                        
                                        i += 1
                                        canceledBooking += doc.data().penalty
                                        // console.log(i)
                                        if (i === snapshots.size){
                                            return res.status(200).json({
                                                turnId,
                                                busId,
                                                NormalSeatPrice,
                                                windowSeatPrice,
                                                JumpingSeatPrice,
                                                busNo,
                                                startStation,
                                                addedDate,
                                                departureTime,
                                                TypeName,
                                                seats:seats,
                                                windowSeatsEarning,
                                                normalSeatsEarning,
                                                jumpingSeatsEarning,
                                                canceledBooking,
                                                total_erning: windowSeatsEarning + normalSeatsEarning + jumpingSeatsEarning + canceledBooking,
                                                conductor_detils:{
                                                    ConductorId,
                                                    NIC,
                                                    name,
                                                    phoneNumber, 
                                                    address,
                                                    email
                                                }
                                            })
                                        }
                                    })

                                    // return res.status(200)
                                })
                                .catch(err => {
                                    console.log(err)
                                    return res.status(400).json({
                                        error:"Something went wrong"
                                    })
                                })           
                            })
                            .catch(err => {
                                console.log(err)
                                return res.status(400).json({
                                    error:"Something went wrong"
                                })
                            })
                        })
                        .catch(err => {
                            // console.log(err)
                            return res.status(400).json({
                                error:"Something went wrong"
                            })
                        })
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            
        }
    })
    .catch(err => {
        return res.status(400).json({
            error:"Something went wrong"
        })
    })

}

function ownertuns(res,getTurns){
    turnsJson = {
        turns : []
    }
    getTurns
    .then(snapshots => {
 
        if (snapshots.empty){
            return res.status(200).json({
                message:"You don't have active turns"
            })
        }
        
        console.log(snapshots.size)
        var i = 0 
        snapshots.forEach(doc=>{
            // const turn = []
            
            const turnId = doc.id
            // console.log(doc.id)
            const busId = doc.data().busId
            const startStation = doc.data().startStation            
            const addedDate = doc.data().addedDate
            const ConductorId = doc.data().ConductorId
            const departureTime = doc.data().departureTime
            const TypeName = doc.data().TypeName
           
            const getConductorDetails = conductorModel.getConductorFromUid(ConductorId)
            getConductorDetails
            .then(doc => {
                // snapshots.forEach(doc=>{
                    // console.log(doc.data())
                // })
                const address = doc.data().address
                const NIC = doc.data().NIC

                const getOtherDetails = userModel.getUserData(ConductorId)
                getOtherDetails
                .then(doc=>{
                    // console.log(doc.data())
                    const name = doc.data().firstName + " " + doc.data().secondName
                    const phoneNumber = doc.data().phoneNumber
                    const email = doc.data().email

                    const getBusDetails = busModel.getBusFromBusId(busId)
                    getBusDetails
                    .then(doc=>{
                        // console.log(doc.data())
                        const NormalSeatPrice = doc.data().NormalSeatPrice
                        const windowSeatPrice = doc.data().windowSeatPrice
                        const busNo = doc.data().busNo
                        const JumpingSeatPrice = doc.data().JumpingSeatPrice
                        
                        turnsJson.turns.push({
                            turnId,
                            busId,
                            NormalSeatPrice,
                            windowSeatPrice,
                            JumpingSeatPrice,
                            busNo,
                            startStation,
                            addedDate,
                            departureTime,
                            TypeName,
                            
                            conductor_detils:{
                                ConductorId,
                                NIC,
                                name,
                                phoneNumber, 
                                address,
                                email
                            }
                        })
                        i++
                        if (i === snapshots.size){
                            // console.log(snapshots.size + "=================")
                            return res.status(200).json({
                                turnsJson
                            })
                        }

                    })
                    .catch(err => {
                        // console.log(err)
                        return res.status(400).json({
                            error:"Something went wrong"
                        })
                    })
                })
                .catch(err => {
                    // console.log(err)
                    return res.status(400).json({
                        error:"Something went wrong"
                    })
                })
            })
            .catch(err => {
                // console.log(err)
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
            
            
        })
       
        
    })
    // .then(()=>{
    //     console.log(turnsJson.turns)
    // })
    .catch(err => {
        // console.log(err)
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

exports.viewPastTurnsUsingOwnerIdByAdmin = (req, res) => {

    const { ownerUid } = req.body

    const getTurnDetails = turnModel.getPastTurnsByOwnerUID(ownerUid)

    getTurnDetailsAdminFun(getTurnDetails,res)


}

exports.viewActiveTurnsUsingOwnerIdByAdmin = (req, res) => {

    const { ownerUid } = req.body

    const getTurnDetails = turnModel.getActiveTurnsByOwnerUID(ownerUid)

    getTurnDetailsAdminFun(getTurnDetails,res)


}

function getTurnDetailsAdminFun(getTurnDetails,res){
    turnsJson = {
        turns : []
    }
    getTurnDetails
    .then(snapshots => {
        if (snapshots.empty){
            return res.status(200).json({
                message:"No past turns found"
            })
        }
        var i = 0
        var n = snapshots.size
        console.log(n)
       
        snapshots.forEach(doc=>{
            // console.log(doc.data())
            // console.log(doc.id)
            const turnId = doc.id
            const TypeName = doc.data().TypeName
            const busId = doc.data().busId
            const startStation = doc.data().startStation
            const duration = doc.data().duration
            const addedDate = doc.data().addedDate
            const departureTime = doc.data().departureTime
            const routeId = doc.data().routeId

            const getBusDetails = busModel.getBusFromBusId(busId)
            getBusDetails
            .then(doc => {
                // console.log(doc.data())
                const NormalSeatPrice = doc.data().NormalSeatPrice
                const windowSeatPrice = doc.data().windowSeatPrice
                const busNo = doc.data().busNo
                const jumpingSeatPrice = doc.data().jumpingSeatPrice

                var windowSeatsEarning = 0
                var jumpingSeatsEarning = 0
                var normalSeatsEarning = 0
                
                const getAllBookedSeats = turnModel.getBookedSeats(turnId)
                getAllBookedSeats
                .then(snapshots =>{
                    i++
                    console.log("k")
                    snapshots.forEach(doc =>{

                        if (doc.data().seatType === 'NORMAL'){
                            normalSeatsEarning += doc.data().price
                        }
                        else if (doc.data().seatType === 'WINDOW'){
                            windowSeatsEarning += doc.data().price
                        }
                        else{
                            jumpingSeatsEarning += doc.data().price
                        }

                    })
                })
                .then(()=>{
                    
                    turnsJson.turns.push({
                        turnId,
                        TypeName,
                        startStation,
                        duration,
                        addedDate,
                        departureTime,
                        routeId,
                        NormalSeatPrice,
                        windowSeatPrice,
                        busNo,
                        jumpingSeatPrice,
                        windowSeatsEarning,
                        jumpingSeatsEarning,
                        normalSeatsEarning
                    })


                    if (i === n){
                        
                        console.log(turnsJson)
                        return res.status(200).json({
                            turnsJson
                        })
                    }
                    
                })
                .catch(err => {
                    return res.status(400).json({
                        error:"Something went wrong"
                    })
                })
 
            })
            .catch(err => {
                return res.status(400).json({
                    error:"Something went wrong"
                })
            })
        })

    })
    .catch(err => {
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}


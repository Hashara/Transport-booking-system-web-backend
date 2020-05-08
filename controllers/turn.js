const turnModel = require('../models/turn')
const busModel = require('../models/bus')
const conductorModel = require('../models/conductor')
const helpers = require('./helpers')
const busTypeModel = require('../models/busType')
const routeModel = require('../models/route')

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

    const today = new Date()

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

                var jsonData = {
                    turnId,
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
                // console.log(jsonArray)
            }

            i+=1

            if (i === snapshot.size){
                return res.status(200).json({
                    turns:jsonArray.turns
                })
            }
        })
        // console.log(snapshot) 
    })
}
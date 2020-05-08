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
                    
                    getDuration
                    .then(documnet => {
                        console.log(documnet.data().duration)
                        const duration = documnet.data().duration
                        const addTurn = turnModel.addTurn(busId,ConductorId,departureTime,startStation,ownerUid,routeId,numberOfSeats,
                            windowSeatsArray,jumpingSeatsArray,NormalSeatPrice, windowSeatPrice, JumpingSeatPrice, duration)
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


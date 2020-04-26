const newBusModel = require('../models/newBus')
const routeModel = require('../models/route')
const busModel = require('../models/bus')
const busTypeModel = require('../models/busType')


exports.sendRequest = (req,res)=>{
    
    const uid = req.params.uid

    const {routeNo,origin,destination,type,busNo,duration} = req.body;

    const newRequest = newBusModel.newRequest(routeNo,origin,destination,type,busNo,uid,duration);

    newRequest.then(()=>{
        return res.status(200).json({
            message: 'Request send successfully'
        })
    })
    .catch(()=>{
        return res.status(400).json({
            message: 'Something went wrong'
        })
    })

}

exports.getPendingBusRequests = (req,res) => {

    const getPending = newBusModel.findPending()

    getPending
    .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return res.status(200).json({
                message:"No new requests"
            })
        }  
        var newBusRequests = snapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}))
        
        return res.status(200).json({
    
            newBusRequests,
        })
    
      })
      .catch(err => {
        console.log('Error getting documents', err);
        return res.status(400).json({
            message:"Something went wrong"
        })
      });
}

exports.rejectBus = (req,res) => {
    
    
    const uid = req.params.uid

    const {busId} = req.body

    console.log(busId)

    const rejectBus = newBusModel.rejectBus(busId, uid)

    rejectBus.then(()=>{
        res.status(200);
        return res.json({
            message:"Reject successfully"
        });
    })
    .catch(()=>{
        res.status(400);
        return res.json({
            message:"Something went wrong"
        })
    })
}

exports.acceptBus = (req,res) => {
    const adminUid = req.params.uid

    const { reqId,windowSeatPrice,JumpingSeatPrice,NormalSeatPrice } = req.body

    const reqDetails = newBusModel.getBusByReqId(reqId);

    reqDetails.then(doc =>{
        const ownerId = doc.data().owner
        const busNo = doc.data().busNo
        const type = doc.data().type
        const routeNo = doc.data().routeNo
        const destination = doc.data().destination
        const origin = doc.data().origin
        const duration = doc.data().duration
        let routeId = "";

        const checkRoute = routeModel.checkRouteExist(routeNo, destination, origin)

        checkRoute
        .then(snapshot => {
            if (snapshot.empty) {
    
                routeId = routeNo + " " + destination + " " + origin
                const addRoute = routeModel.addNewRoute(routeNo, destination, origin,duration,routeId)
        
                addRoute.then(response =>{
                    console.log("Route added successfully");
                })
                .catch(()=>{
                    res.status(400)
                    return res.json({
                        error:"Something went wrong"
                    })
                })
             
            }else{
                snapshot.forEach(doc => {
                    console.log(doc.id);
                    routeId = doc.id
                });
               
            }
        })
        .then(()=>{
            if (routeId !== ""){
                console.log("hi");

                const createBus = busModel.createBus(reqId,routeId,adminUid,ownerId,busNo,type,windowSeatPrice,JumpingSeatPrice,NormalSeatPrice)

                createBus
                .then(()=>{
                    res.status(200)
                    return res.json({
                        message:"Bus created successfully"
                    })
                })
            }
            else{
                res.status(400)
                return res.json({
                    error:"Something went wrong"
                })
            }
        })
        .catch(err=>{
            res.status(400)
            return res.json({
                error:"Something went wrong"
            })
        })
        
    }).catch(err=>{
        res.status(400)
        return res.json({
            error:"Something went wrong"
        })
    })

}
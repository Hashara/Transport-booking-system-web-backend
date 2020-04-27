const busModel  = require('../models/bus')

exports.getBusesByOwnerId = (req,res) => {

    const ownerId = req.params.uid

    const getBuses = busModel.getAllbusesOfOwner(ownerId)

    getBuses
    .then(snapshot=>{
        if(snapshot.empty){
            res.status(200)
            return res.json({
                message:"No buses registered"
            })
        }
        var buses = snapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}))
        
        return res.status(200).json({
            buses,
        })

    })
    .catch(()=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

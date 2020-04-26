const BusType  = require('../models/busType')


exports.addBusType = (req,res) =>{

    console.log("addBustype controller")
    const { type,name,seats,windowSeats,jumpingSeats } = req.body;

    const addBusType = BusType.addBusType(type,name,seats,windowSeats,jumpingSeats)

    addBusType.then(response=>{
        res.status(200)
        return res.json({
            message:"Bus type added successfully"
        })
        
    })
    .catch(err=>{
        res.status(400)
        return res.json({
            message:"Something went wrong"
        })
    })
    
}
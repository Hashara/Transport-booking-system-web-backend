
const newOwnerModel = require('../models/newOwner')


exports.sendRequest = (req,res) =>{


    newOwnerModel.saveData(req,res)
    
    
}


exports.getPendingOwners = (req,res) =>{

    // res.json({
    //     hi:"hi"
    // })
    newOwnerModel.findPending(req,res);
    
}

const newOwnerModel = require('../models/newOwner')


exports.sendRequest = (req,res) =>{


    newOwnerModel.saveData(req,res)
    
    
}
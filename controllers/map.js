const googleMapapi =require('../APIs/map-api/googleapi');

exports.getRoutes = (req,res) =>{

    console.log("COntroller")
    // newOwnerModel.findPending(req,res);
    googleMapapi.getDirections(req,res)
    
}
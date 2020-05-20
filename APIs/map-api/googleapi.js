exports.googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAP_API,
    Promise: Promise
  });

// const mapController = require('../../controllers/map')
  

// exports.getDirections1 = ( req,res ) =>{
  
//   const{ origin, destination} = req.body

//   googleMapsClient.directions({
//     origin: origin,
//     destination: destination,
//     mode: 'transit',
//     transit_mode:'bus',
//     alternatives:true
  
//   },function(err, response) {
      
//         var routes=response.json.routes
//         var i = 0
//         var routeJson = {
//           steps : []
//         }
        
//         routes.forEach((route) => {

//           // console.log(i)
//           i++;
//           var legs = route.legs;

          
//           legs.forEach((leg)=>{

//             var steps = leg.steps
//             var route = []
            
    
//             steps.forEach((step)=>{
              
//               if (step.travel_mode === "TRANSIT"){
//                 // console.log(step.transit_details.line.name)
//                 // console.log(step.transit_details.line.short_name)


//                 var jsonData = {
//                   "name":step.transit_details.line.name,
//                   "short_name":step.transit_details.line.short_name,
//                   "status": "AVAILABLE" //todo: get the status from the db
//                 };
                
//                 route.push(jsonData);

//               }
             
//             })
//             routeJson.steps.push(route)
//           })

         
//         });
//         if (!err) { 
//           // console.log(i)
//           if (i===0){
//             res.status(404)
//             return res.json({
//               message: `Sorry no buses found from ${origin} to ${destination}`
//             })

//           }
//           return res.json({
//             routes:routeJson
//           })
//         }else{
//           res.status(400)
//           return res.json({
//             message:"Error occured",
//             error:err
//           })
//         }
        
//       });
// };
  


const googleMapapi =require('../APIs/map-api/googleapi');
const turnModel = require('../models/turn')

// exports.getRoutes1 = (req,res) => {
//     const{ origin, destination} = req.body

//     const getRouteDetails =  googleMapapi
//     .googleMapsClient
//     .directions({
//         origin: origin,
//         destination: destination,
//         mode: 'transit',
//         transit_mode:'bus',
//         alternatives:true
      
//       },function(err, response) {
          
//             var routes=response.json.routes
//             var i = 0
//             // console.log(routes)
//             var routeJson = {
//               steps : []
//             }
            
//             routes.forEach((route) => {
    
//               // console.log(i)
//               i++;
//               var legs = route.legs;
    
              
//               legs.forEach((leg)=>{
    
//                 var steps = leg.steps
//                 var route = []
                
        
//                 steps.forEach((step)=>{
                  
//                   if (step.travel_mode === "TRANSIT"){
//                     // console.log(step.transit_details.line.name)
//                     // console.log(step.transit_details.line.short_name)
                    
//                     var stations = step.transit_details.line.name.split('-')
//                     console.log(stations[0])
//                     console.log(stations[1])
//                     const station1 = stations[0]
//                     const station2 = stations[1]
//                     const routeNo = step.transit_details.line.short_name
                  
//                     var jsonData = {
//                       "name":step.transit_details.line.name,
//                       "short_name":step.transit_details.line.short_name,
//                       "departure_stop":step.transit_details.departure_stop.name,
//                       "arrival_stop":step.transit_details.arrival_stop.name,
//                       "status": "AVAILABLE" //todo: get the status from the db
//                     };
                    
//                     route.push(jsonData);
    
//                   }
                 
//                 })
//                 routeJson.steps.push(route)
//               })
    
             
//             });
//             if (!err) { 
//               // console.log(i)
//               if (i===0){
//                 res.status(404)
//                 return res.json({
//                   message: `Sorry no buses found from ${origin} to ${destination}`
//                 })
    
//               }
//               return res.json({
//                 routes:routeJson
//                 // routes
//               })
//             }else{
//               res.status(400)
//               return res.json({
//                 message:"Error occured",
//                 error:err
//               })
//             }
            
//           });
  
// }


exports.getRoutes = async (req,res) => {
    const{ origin, destination} = req.body

    const getRouteDetails =  googleMapapi
    .googleMapsClient
    .directions({
        origin: origin,
        destination: destination,
        mode: 'transit',
        transit_mode:'bus',
        alternatives:true
      
      }).asPromise()

    getRouteDetails
    .then(async (response) =>{
       
        var routes=response.json.routes
        var i = 0
        // console.log(routes)
        global.routeJson = {
            steps : []
        }
        
        routes.forEach((route) => {

            // console.log(i)
            i++;
            var legs = route.legs;

            
            legs.forEach((leg)=>{

            var steps = leg.steps
            var route = []
            
    
                steps.forEach(async (step)=>{
                    
                    if (step.travel_mode === "TRANSIT"){
                        
                        

                        
                        var jsonData = {
                            "name":step.transit_details.line.name,
                            "short_name":step.transit_details.line.short_name,
                            "departure_stop":step.transit_details.departure_stop.name,
                            "arrival_stop":step.transit_details.arrival_stop.name,
                            "status": "UNAVAILABLE" //todo: get the status from the db
                        };
                        
                        route.push(jsonData);
                        
                    }
                    
                })
                routeJson.steps.push(route)
            })
        })
        // return res.json({
        //     routes:routeJson
        //     // routes
        // })
        getfromDB(res)
    })

    .catch(err=>{
        
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}


function getfromDB(res){

    
    const getTurns = turnModel.getFutureTurns()
    getTurns
    .then(snapshot=>{
        const routes_a = snapshot.docs.map(doc=>Object.assign(doc.data().routeId))
        // const routes =  Object.keys(routes_a).map((key) => [key, json_data[key]]);
        console.log(routes_a)
        

        for (let j in routeJson.steps){
            console.log(routeJson.steps[j].length)
            for(var i = 0; i< routeJson.steps[j].length; i++){
                // console.log(routeJson.steps[j][i].name)
                console.log(routeJson.steps[j][i].short_name)
                var stations =routeJson.steps[j][i].name.split('-')

                const station1 = stations[0]
                const station2 = stations[1]

                console.log(routeJson.steps[j][i].short_name + " " + station1 + " " + station2)

                for (let route in routes_a){
                    if(routes_a[route].toString() === routeJson.steps[j][i].short_name + " " + station1 + " " + station2 || routes_a[route].toString() === routeJson.steps[j][i].short_name + " " + station2 + " " + station1 ){
                       
                        routeJson.steps[j][i].status = 'AVAILABLE'
                    }
                    
                }
            }
            
        }
        
    })
    .then(()=>{
        return res.json({
            routes:routeJson
            // routes
        })

    })
    .catch(err=>{
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}

// TODO: add date
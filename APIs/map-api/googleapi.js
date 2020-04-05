var googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAP_API
  });
  

exports.getDirections = ( req,res ) =>{
  
  const{ origin, destination} = req.body

  googleMapsClient.directions({
    origin: origin,
    destination: destination,
    mode: 'transit',
    transit_mode:'bus',
    alternatives:true
  
  },function(err, response) {
      
        var routes=response.json.routes
        var i = 0
        var routeJson = {
          steps : []
        }
        
        routes.forEach((route) => {

          console.log(i)
          i++;
          var legs = route.legs;

          
          legs.forEach((leg)=>{

            var steps = leg.steps
            var route = []
            
    
            steps.forEach((step)=>{
              
              if (step.travel_mode === "TRANSIT"){
                // console.log(step.transit_details.line.name)
                // console.log(step.transit_details.line.short_name)


                var jsonData = {
                  "name":step.transit_details.line.name,
                  "short_name":step.transit_details.line.short_name
                };
                
                route.push(jsonData);

              }
             
            })

            routeJson.steps.push(route)
          })

         
        });
        if (!err) { 

          return res.json({
          routes:routeJson
        })
        }else{
          return res.json({
            message:"Error occured",
            error:err
          })
        }
        
      });
    };
  

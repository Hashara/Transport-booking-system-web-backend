const googleMapapi =require('../APIs/map-api/googleapi');
const turnModel = require('../models/turn')
const helpers = require('../controllers/helpers')

exports.getRoutes = async (req,res) => {
    // date is js object 
    const{ origin, destination, date} = req.body

    // const dateObject = new Date(date)

    // console.log(dateObject.getTime())

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
        getfromDB(res,date)
    })

    .catch(err=>{
        
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}


function getfromDB(res,date){

    
    const getTurns = turnModel.getFutureTurns()
    getTurns
    .then(snapshot=>{
        const routes_a = snapshot.docs.map(doc=>Object.assign(doc.data()))
        // const routes =  Object.keys(routes_a).map((key) => [key, json_data[key]]);
        // console.log(routes_a[1].routeId === '5 Colombo Kurunegala')
        console.log(routes_a)
        

        for (let j in routeJson.steps){
            console.log(routeJson.steps[j].length)
            for(var i = 0; i< routeJson.steps[j].length; i++){
                // console.log(routeJson.steps[j][i].name)
                // console.log(routeJson.steps[j][i].short_name)
                var stations =routeJson.steps[j][i].name.split('-')

                const station1 = stations[0]
                const station2 = stations[1]

                // console.log(routeJson.steps[j][i].short_name + " " + station1 + " " + station2)

                for (let route in routes_a){
                    // console.log(routes_a[route])
                    console.log(routes_a[route].routeId)
                    console.log(date)
                    
                    // helpers.isSameDate(date,departureTime)
                    console.log(helpers.isSameDate(new Date(date),routes_a[route].departureTime.toDate()))
                    console.log(routes_a[route].routeId)
                    console.log(routeJson.steps[j][i].short_name + " " + station2 + " " + station1 )
                    if (helpers.isSameDate(new Date(date),routes_a[route].departureTime.toDate()) && (routes_a[route].routeId === routeJson.steps[j][i].short_name + " " + station1 + " " + station2 || routes_a[route].routeId === routeJson.steps[j][i].short_name + " " + station2 + " " + station1 )){
                            routeJson.steps[j][i].status = 'AVAILABLE'
                            routeJson.steps[j][i].routeId = routes_a[route].routeId
                        
                    }
                    // routeJson.steps[j][i].n = routes_a[route].routeId
                    
                    
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


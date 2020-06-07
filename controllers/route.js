const routeModel = require('../models/route')

exports.getAllRoute = (req,res) => {

    const getAllRoutes = routeModel.getAllroutes()

    getAllRoutes
    .then(snapshot => {
        var routes = snapshot.docs.map(doc => Object.assign({id: doc.id}))

        return res.status(200).json({
            routes
        })
    })
    .catch(err => {
        return res.status(400).json({
            error:"Something went wrong"
        })
    })
}
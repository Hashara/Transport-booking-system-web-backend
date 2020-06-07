const admin = require('firebase-admin')

const db = admin.firestore();
const routeRef = db.collection('busRoute');

exports.checkRouteExist = (routeNo, destination, origin) => {
    return routeRef.where('routeNo', '==', routeNo,'destination','==',[destination,origin],'origin','==',[destination,origin]).get();
}

exports.addNewRoute = (routeNo, destination, origin,duration,routeId) => {
    return routeRef.doc(routeId).set({
        routeNo, 
        destination,
        origin,
        duration
    })
}

exports.getRoute = (routeId) => {
    return routeRef.doc(routeId).get()
}

exports.getAllroutes = () => {
    return routeRef.get()
}
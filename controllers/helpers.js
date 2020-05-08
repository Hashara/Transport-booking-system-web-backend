const generator = require('generate-password');

exports.generatePassword = () =>{
    const password = generator.generate({
        length: 6,
        numbers: true
    })
    return password
}

exports.dateDiff = (date) => {
    var nDate = new Date(date)
    var curDate   = new Date()
    var datediff = nDate.getTime() - curDate.getTime(); //store the getTime diff - or +
    return (datediff / (1000 * 3600 * 24));
}

exports.hourDiff = (date) => {
    var curDate   = new Date()
    var hourDiff = date.getTime() - curDate.getTime()
    return (hourDiff / (1000 * 3600) ) 
}

exports.addMillis = (date, millis) => {
    var millisAddedDate = date.getTime() + millis
    var newDate = new Date(millisAddedDate)
    return newDate
}

exports.getOtherStation = (startStation,routeId) => {
    var splitedRoute = routeId.split(" ")
    if (splitedRoute[1] === startStation){
        return splitedRoute[2]
    }
    else{
        return splitedRoute[1]
    }
}

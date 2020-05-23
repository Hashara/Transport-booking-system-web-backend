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

exports.isSameDate = (date1, date2) => {

    // console.log(date1)
    var datediff = date2.getTime() - date1.getTime()
    return ((datediff / (1000 * 3600 * 24))<=1)
    
}

// function isSame() {
//     const date1 = new Date("2020-05-10T07:42:05.750Z")
//     const date2 = new Date("2020-05-10T09:42:05.750Z")

    
//     var datediff = date2 - date1
//     console
// }
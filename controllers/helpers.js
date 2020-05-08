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
const generator = require('generate-password');

exports.generatePassword = () =>{
    const password = generator.generate({
        length: 6,
        numbers: true
    })
    return password
}
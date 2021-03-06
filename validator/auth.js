const {check} = require('express-validator')

exports.userSignupValidator = [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required'),
    check('secondName')
        .not()
        .isEmpty()
        .withMessage('Second name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    check('phoneNumber')
        .not()
        .isEmpty()
        .withMessage('Must be a valid phone number')
];

//todo:sign in authentication
// exports.userSignInValidation = [
//     check('email')
//         .isEmail()
//         .withMessage('Must be a valid email address'),
//     check('password')
//         .isLength({min: 6})
//         .withMessage('Password must be at least 6 characters long')
// ]


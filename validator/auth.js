const {check} = require('express-validator')

exports.userSignupValidator = [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required'),
    check('secondName')
        .not()
        .isEmpty()
        .withMessage('First name is required'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    check('phoneNumber')
        .not()
        .isEmpty()
        .withMessage('phone number is required')
];

//todo:sign in authentication


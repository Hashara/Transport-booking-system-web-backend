const {check} = require('express-validator')

exports.ownerRequestValidation = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required'),
    check('phoneNumber')
        .not()
        .isEmpty()
        .matches('^[+]94[0-9]{9}|0[0-9]{9}$')
        .withMessage('Must be a valid phone number'),
    check('address')
        .not()
        .isEmpty()
        .withMessage('Address is required')
];
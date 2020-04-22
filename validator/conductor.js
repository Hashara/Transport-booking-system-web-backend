const {check} = require('express-validator')

exports.addConductorValidation = [
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required'),
    check('secondName')
        .not()
        .isEmpty()
        .withMessage('Second name is required'),
    check('phoneNumber')
        .not()
        .isEmpty()
        .matches('^[+]94[0-9]{9}|0[0-9]{9}$')
        .withMessage('Must be a valid phone number'),
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('address')
        .not()
        .isEmpty()
        .withMessage('Address is required'),
    check('nic')
        .not()
        .isEmpty()
        .matches('^[0-9]{9}|[0-9]{11}$')
        .withMessage('Must be a valid NIC'),
];
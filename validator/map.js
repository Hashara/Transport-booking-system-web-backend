const {check} = require('express-validator')

exports.checkInputs = [
    check('origin')
        .not()
        .isEmpty()
        .withMessage('Start station is required'),
    check('destination')
        .not()
        .isEmpty()
        .withMessage('End station is required'),
];
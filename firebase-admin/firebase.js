const firebase = require("firebase");

const firebaseConfig = require("../firebasekey.json")

firebase.initializeApp(firebaseConfig);

module.exports = firebase;
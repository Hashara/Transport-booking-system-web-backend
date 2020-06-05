const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')
const firebaseClient = require('../firebase-admin/firebase')

const db = admin.firestore();
const UsersRef = db.collection('users');

exports.emailSignin = (email,password) =>{
    return firebaseClient.auth().signInWithEmailAndPassword(email,password)
}

exports.registerNewUser =  (firstName, secondName, email, password, phoneNumber) =>{
    return admin.auth().createUser({
        email,
        password,
        phoneNumber,
        displayName:firstName+" "+secondName
    })
}

exports.addUserdetails = (uid,firstName, secondName, email, phoneNumber, role,phone_verified) =>{
    return UsersRef.doc(uid).set({
        "firstName":firstName, 
        "secondName":secondName, 
        "email":email, 
        "phoneNumber":phoneNumber,
        "role":role, //role added
        "phone_verified": phone_verified
    });

}

exports.registerOwner =  (firstName, secondName, email, password, phoneNumber) =>{
    return admin.auth().createUser({
        email,
        password,
        phoneNumber,
        displayName:firstName+" "+secondName
    })
}

exports.getUserbyEmail = (email) =>{
    return admin.auth().getUserByEmail(email)  
}

exports.getUserByPhone = (phoneNumber) =>{
    return admin.auth().getUserByPhoneNumber(phoneNumber)
}

exports.deleteUserByUID = (uid)=>{
    return admin.auth().deleteUser(uid)
}

exports.getUserData = (uid) =>{
     return UsersRef.doc(uid).get()
}
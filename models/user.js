const admin = require('../firebase-admin/admin')

const db = admin.firestore();
const UsersRef = db.collection('users');

exports.findEmail = (res,email) => {
    // console.log(email)
    UsersRef.where('email', '==', email).get()
    .then(snapshot => {
        if (!snapshot.empty) {       
            return res.status(400).json({
                error: 'Email is taken,Try with a different email'
            })
        }
        
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}

exports.findMobile = (res,phoneNumber) => {
    // console.log(email)
    UsersRef.where('phoneNumber', '==', phoneNumber).get()
    .then(snapshot => {
        if (!snapshot.empty) {       
            return res.status(400).json({
                error: 'Mobile number is taken,Try with a different email'
            })
        }
        
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}
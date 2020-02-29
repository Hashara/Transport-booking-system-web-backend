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
                error: 'Mobile number is taken,Try with a different phone number'
            })
        }
        
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}

exports.registerUser = async(firstName, secondName, email, password, phoneNumber,res) => {

    //add user for firebase auth
    await admin.auth().createUser({
        email,
        password,
        phoneNumber
    })
    .then(()=>{

        console.log("Signup sucessfully")
    })
    .catch(err =>{
        return res.json({
            message: err.message
        })
    
    })

    admin.auth().getUserByEmail(email)
    .then(function(userRecord) {
        
        // get the uid of the newly created user
        const uid = userRecord.uid
        
        //add user data
        UsersRef.doc(uid).set({
            "firstName":firstName, 
            "secondName":secondName, 
            "email":email, 
            "phoneNumber":phoneNumber
        });

        return res.json({
            message: "Activation success"
        })
    })
    .catch(function(error) {
    console.log('Error fetching user data:', error);
    });

    
    
}


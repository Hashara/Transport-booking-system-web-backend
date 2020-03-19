const jwt = require('jsonwebtoken')

const admin = require('../firebase-admin/admin')
const firebaseClient = require('../firebase-admin/firebase')

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


exports.registerUser = async(firstName, secondName, email, password, phoneNumber, role, res) => {

    //add user for firebase auth
    await admin.auth().createUser({
        email,
        password,
        phoneNumber,
        displayName:firstName+" "+secondName
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
            "phoneNumber":phoneNumber,
            "role":role, //role added
            "phone-verified": false
        });

        
        return res.json({
            message: "Activation success"
        })
    })
    .catch(function(error) {
    console.log('Error fetching user data:', error);
    });

    
    
}


exports.signInbyEmail = (email,password,res)=>{
    
    firebaseClient.auth().signInWithEmailAndPassword(email,password)
    .then((user) =>{
        //get uid for 
        admin.auth().getUserByEmail(email)
        .then(function(userRecord) {
            
            // get the uid of the newly created user for generate a token
            const uid = userRecord.uid
            // console.log(uid)
            const token = jwt.sign({_id:uid},process.env.JWT_SECRET,{expiresIn:'7d'})
            // console.log(getRole(uid))
            // const role = getRole(uid);
            // getRole(uid);
            // console.log(role)


            //get role
             let userRef = UsersRef.doc(uid);
            //  var role;
            userRef.get()
                .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    // role= "PASSENGER"
                    // return role
                    return res.json({
                        message:"Sign in success",
                        token,
                        user:{
                            user,
                            role:"PASSENGER",
                        }
                    })
                } else {
                    // console.log(doc.data().role);
                    var role = doc.data().role
                    console.log(role+"Method")
                    // return role
                    return res.json({
                        message:"Sign in success",
                        token,
                        user:{
                            user,
                            role
                        }
                    })
                }
                
                })
                .catch(err => {
                    console.log('Error getting document', err);
                    // return null;
                    // var role=null;
                    res.status(400)
                    return res.json({
                        error:"Error with getting role"
                    })
                });

        }).catch((error)=>{
            res.status(400)
            return res.json({
                error:error.message
            })
        })
        
    })
    .catch((error)=>{
        res.status(400)
        return res.json({
            error:error.message
        })
    })

}


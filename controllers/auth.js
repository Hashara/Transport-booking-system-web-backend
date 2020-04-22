const jwt = require('jsonwebtoken')

const userModel = require('../models/user')

const email_Api = require('../APIs/email-api/sendgrid')
const expressJwt = require('express-jwt')


exports.signup = (req,res) => {
    const {  firstName, secondName, email, password, phoneNumber,role } = req.body

    const checkphone = userModel.getUserByPhone(phoneNumber)

    checkphone.then(()=>{
        return res.status(400).json({
            error: 'Phone number is taken,Try with a different Phone number'
        })
    })
    .catch(()=>{

        const checkEmail = userModel.getUserbyEmail(email)

        checkEmail.then(()=>{
            return res.status(400).json({
                error: 'Email is taken,Try with a different email'
            })
        })
        .catch(()=>{
            const token = jwt.sign({firstName, secondName, email, password, phoneNumber,role },process.env.JWT_ACCOUNT_ACTIVATION,{expiresIn:'10m'})

            const sendEmail = email_Api.activationEmail(email,token)

            sendEmail.then(sent =>{
                // console.log('SIGNup EMAIL SENT')-
                return res.json({
                    message: `Email has been sent to ${email}`
                })
            })
            .catch(err =>{
                return res.json({
                    message: err.message
                })
            })
        })
    })
}

exports.activation = (req,res) =>{
    const {token} = req.body

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err){
                console.log('JWT VERIFY ERROR IN ACCOUNT ACTIVATION')
                return res.status(401).json({
                    error:' Expired link Signup again'
                })            
            }

            
            const {firstName, secondName, email, password, phoneNumber, role } = jwt.decode(token); //role added

            // userModel.registerUser(firstName, secondName, email, password, phoneNumber, role, res) //role added

            const registerUser = userModel.registerNewUser(firstName,secondName,email,password,phoneNumber)

            registerUser.then(()=>{

                console.log("Signup sucessfully")
                const getUserbyEmail = userModel.getUserbyEmail(email)

                getUserbyEmail.then(function(userRecord) {
            
                    // get the uid of the newly created user
                    const uid = userRecord.uid
                    const phone_verified = false
                    
                    //add user data
                    const addUserdetails = userModel.addUserdetails(uid,firstName, secondName, email, phoneNumber, role,phone_verified)
                    
                    addUserdetails.then(()=>{
                        console.log("AddUserdetails then")
                        return res.json({
                            message: "Activation success"
                        })
                    })
                    .catch(()=>{
                        // const deleteCreatedUser = userModel.deleteUserByUID(uid)
                        console.log("AddUserdetails catch")

                        return res.status(400).json({
                            error:' Something went wrong'
                        })
                    })
                    
                })
                .catch(function(error) {
                    // const deleteCreatedUser = userModel.deleteUserByUID(uid)
                    console.log("get user catch"+ error)

                    return res.status(400).json({
                        error:' Something went wrong'
                    })
            });
            })
            .catch(err =>{
                return res.json({
                    message: err.message
                })
            
            })

            



        })
    }else{
        return res.status(400).json({
            error:'Sorry token not found'
        })
    }
  
}

exports.signin = (req, res) =>{ 
    const {email, password} = req.body

    //todo: check sign in by email or phone
    //if email
   
    const emailSignin = userModel.emailSignin(email,password)

    emailSignin.then((user)=>{

        const getUID = userModel.getUserbyEmail(email)
        getUID.then(function(userRecord) {
            
            // get the uid of the newly created user for generate a token
            const uid = userRecord.uid

            const token = jwt.sign({_id:uid},process.env.JWT_SECRET,{expiresIn:'7d'})

            //get role
            const getUserDetails = userModel.getUserData(uid);
            //  var role;
            getUserDetails.then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    // role= "PASSENGER"
                    // return role
                    res.status(400)
                    return res.json({
                        error:"Error data not found"
                    })
                } else {
                    // console.log(doc.data().role);
                    var role = doc.data().role
                    var phone_verified = doc.data().phone_verified
                    console.log(role+"Method")
                    // return role
                    return res.json({
                        message:"Sign in success",
                        token,
                        user:{
                            user,
                            role,
                            phone_verified,
                            
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
                        error:"Error with getting data"
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
    //if phone 
    //todo: signin by phone number
   
}

exports.requireSignin = expressJwt({
    secret:process.env.JWT_SECRET
})

exports.adminMiddleware = (req,res,next) => {
    
    const uid = req.params.uid
    console.log(uid)
    const getData = userModel.getUserData(uid)

    getData.then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
            // role= "PASSENGER"
            // return role
            res.status(400)
            return res.json({
                error:"Invallida user"
            })
        } else {
            // console.log(doc.data().role);
            var role = doc.data().role
            // console.log(role)
            if (role !== 'ADMIN'){
                res.status(400)
                res.json({
                    error:"Admin resource. Access denied"
                })
            }
        }
    })
    next()
} 

exports.ownerMiddleware = (req,res,next) => {
    
    const uid = req.params.uid
    // console.log(uid)
    const getData = userModel.getUserData(uid)

    getData.then(doc => {
        if (!doc.exists) {
            console.log('No such document!');
            // role= "PASSENGER"
            // return role
            res.status(400)
            return res.json({
                error:"Invallida user"
            })
        } else {
            // console.log(doc.data().role);
            var role = doc.data().role
            // console.log(role)
            if (role !== 'OWNER'){
                res.status(400)
                res.json({
                    error:"Owner resource. Access denied"
                })
            }
        }
    })
    next()
} 

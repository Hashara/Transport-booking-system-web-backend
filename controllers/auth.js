// const admin = require('../firebase-admin/admin')
const jwt = require('jsonwebtoken')

const userModel = require('../models/user')
const sgMail =require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

console.log(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) =>{


    const {  firstName, secondName, email, password, phoneNumber } = req.body

   //check the email is existing
    userModel.findEmail(res,email);
    userModel.findMobile(res,phoneNumber);

   
     //create token for input data
    const token = jwt.sign({firstName, secondName, email, password, phoneNumber},process.env.JWT_ACCOUNT_ACTIVATION,{expiresIn:'10m'})
            
    //send activation code for the email
            
    const emailData = {
        from: process.env.EMAIL_FROM,
        to:email,
        subject: 'Account activation link',
        html:`
            <h>Please use the followuing link to activate your account</h>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />`
    }
            
    sgMail.send(emailData)
    .then(sent =>{
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
         


   //create activation method for sign up
    
    // const user = await admin.auth().createUser({
    //     email,
    //     password
    // }).then(()=>{
    //     // res.send(user)
    //     // return res.json({
    //     //     message: `Email has been sent to ${email}`
    //     // })
    //     console.log("Signup sucessfully")
    // }).catch(err =>{
    //     return res.json({
    //         message: err.message
    //     })
    // res.send(user)
    // })

    

}

// exports.signup = (req,res) =>{
//     const { firstName,secondName, email, password, phoneNumber} = req.body

//     admin.auth().createUser({ //Create user in authentication section of firebase
//         email: email, //user email from request body
//         emailVerified: false, //user email from request body
//         password: md5(password), //hashed user password
//         displayName: firstName+secondName, //user name from request body
//         disabled: false
//         })
//          .then(function(userRecord) {
//          console.log("Successfully created new user:", userRecord.uid);
//          //add data to database
//          var data = {
//             firstName:firstName,
//             secondName:secondName,
//             phoneNumber:phoneNumber
//            //Whatever data you would like to add for this user
//          };
//      var setDoc = db.collection('users').add(data);
//          var userIDHash = md5(userRecord.uid);
//          //adding hashed userid and userid to Email-Verifications collection
//          var setHash = db.collection('Email-  Verifications').doc(userIDHash).set({userID:userRecord.uid});
//          var verificationLink = `${process.env.CLIENT_URL}/confirm_email/` + userIDHash;
//          sendVerificationEmail(useremail, verificationLink);
//         return response.status(200).send(Success());
//         })
//         .catch(function(error) {
//            console.log("Error creating new user:", error);
//         });
// }
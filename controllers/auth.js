const jwt = require('jsonwebtoken')

const userModel = require('../models/user')

const sgMail =require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



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
            <h1>Please use the following link to activate your account</h1>
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

            
            const {firstName, secondName, email, password, phoneNumber} = jwt.decode(token);

            userModel.registerUser(firstName, secondName, email, password, phoneNumber,res)

        // const user = new User({name,email, password}) 

        //     user.save((err,user) =>{
        //         if(err){
        //             console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR',err)
        //             return res.status(401).json({
        //                 error:'Error saving user,Try sign up again'
        //             })
        //         }
        //         return res.json({
        //             message:'Signup sucess.Please sign in'
        //         })
                
        //     })
        })
    }
    // else{
    //     return res.json({
    //         message:'Something went wrong please try again'
    //     })
    // }


    // const user = await admin.auth().createUser({
    //     email,
    //     password
    // }).then(()=>{
        
    //     console.log("Signup sucessfully")
    // }).catch(err =>{
    //     return res.json({
    //         message: err.message
    //     })
    
    // })
}

//todo: save the data in users
//todo:set up sign up
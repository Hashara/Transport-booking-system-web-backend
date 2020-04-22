const userModel  = require('../models/user')
const ConductorModel  = require('../models/conductor')
const sms_api = require('../APIs/sms-api/twilio')
const helpers = require('./helpers')


exports.addConductor = (req,res) =>{

    const ownerUid = req.params.uid;

    const { firstName, secondName, email, phoneNumber,address,nic } = req.body;

    const password = helpers.generatePassword();
    console.log(password) // todo : uncomment this


    const authConductor = userModel.registerNewUser(firstName, secondName, email, password, phoneNumber);

    authConductor.then(response=>{
        // console.log("auth complete")
        var NewUid = userModel.getUserbyEmail(email)
        
         
        NewUid.then(function(userRecord) {
            const uid = userRecord.uid
            console.log(uid)

            const dbconductor = ConductorModel.createConductor(ownerUid,uid,firstName, secondName, email, phoneNumber,address,nic);

            dbconductor.then(response=>{
                // console.log("success")
                const sendPassword = sms_api.sendPassword(password,phoneNumber)
                sendPassword.then(response=>{
                    res.status(200)
                    return res.json({
                        message:"Conductor created successfully"
                    })
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500)
                    return res.json({
                        error:"Conductor created successfully but something went wrong while sending password"
                    })
                }) 
                
            }).catch(err=>{
                userModel.deleteUserByUID(auid)
                .then(function() {
                    console.log('Successfully deleted user');
                    res.status(400)
                    return res.json({
                        message:"Something went wrong"
                    })
                })
                .catch(function(error) {
                    res.status(400)
                    return res.json({
                        message:"User cretaed but failed to write db"
                    })
                });
            })

        })

    })
    .catch(err=>{
        console.log(err.code)
        if (err.code==='auth/email-already-exists'){
            res.status(409)
            return res.json({
                error:"Email already exists"
            })
        }else if (err.code==='auth/phone-number-already-exists'){
            res.status(409)
            return res.json({
                error:"phone-number-already-exists"
            })
        }
        else{
            res.status(400)
            return res.json({
                message: "Something went wrong",
                error:err.code
            })
        }
    })
        

}

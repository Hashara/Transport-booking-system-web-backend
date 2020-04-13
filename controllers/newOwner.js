
const newOwnerModel = require('../models/newOwner')
const ownerModel = require('../models/owner')
const userModel = require('../models/user')
const helpers = require('./helpers')
const sms_api = require('../APIs/sms-api/twilio')

exports.sendRequest = (req,res) =>{

    const{ name, phoneNumber, address} = req.body

    var date = new Date(); 
    
    const saveData = newOwnerModel.saveData(name,phoneNumber,address,date)
    saveData.then(()=>{
        return res.status(200).json({
            message: 'Request send successfully'
        })
    })
    .catch(()=>{
        return res.status(400).json({
            message: 'Something went wrong'
        })
    })
    
    
    
}


exports.getPendingOwners = (req,res) =>{

    // newOwnerModel.findPending(req,res);

    const query = newOwnerModel.findPending()

    query.onSnapshot(querySnapshot => {
        var newOwners =querySnapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}))
        console.log(newOwners)
        console.log(`Received query snapshot of size ${querySnapshot.size}`);
        
        if (querySnapshot.size==0){
            return res.status(200).json({
                message:"No new requests"
           })
        }else{
            return res.status(200).json({
                
                newOwners,
            })
        }
    // ...
    }, err => {
        console.log(`Encountered error: ${err}`);
        return res.status(400).json({
            message:"Something went wrong"
        })
    });
    
}

exports.acceptOwner =  (req,res) =>{

    const { uid,firstName, secondName, email, phoneNumber,phone_verified,address,nic } = req.body

    const password = helpers.generatePassword()
    console.log(password) // todo : uncomment this
    const authOwner = userModel.registerOwner(firstName, secondName, email, password, phoneNumber) 

    authOwner.then(response=>{
        // console.log("auth complete")
        var NewUid = userModel.getUserbyEmail(email)
         
        NewUid.then(function(userRecord) {
            const auid = userRecord.uid
            // console.log(auid)

            const dbOwner = ownerModel.createOwner(uid,auid,firstName, secondName, email, phoneNumber,phone_verified,address,nic);

            dbOwner.then(response=>{
                // console.log("success")
                const sendPassword = sms_api.sendPassword(password,phoneNumber)
                sendPassword.then(response=>{
                    res.status(200)
                    return res.json({
                        message:"Owner created successfully"
                    })
                })
                .catch(err=>{
                    res.status(500)
                    return res.json({
                        error:"Owner created successfully but something went wrong while sending password"
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

        }).catch(err=>{
            console.log(err)
            console.log("error occured")
            res.status(400)
            return res.json({
                error: "Something went wrong"
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

exports.rejectOwner = (req,res) => {

    const { uid } = req.body

    const reject = newOwnerModel.updateStatus(uid,"REJECTED")

    reject.then(response =>{
        res.status(200)
        return res.json({
            message: "reject successfully"
        })
    })
    .catch(err=>{
        res.status(400)
        return res.json({
            error:"Some error occured"
        })
    })
}

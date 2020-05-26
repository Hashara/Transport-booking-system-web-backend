const ownerModel = require('../models/owner')
const userModel = require('../models/user')

exports.getAllOwners = (req, res) => {

    const owners = ownerModel.getAllOwners()

    let ownersJson = {
        owners : []
    }
    owners
    .then(snapshots => {
        var i = 0
        if (snapshots.empty){
            return res.status(200).json({
                message: "No owners found"
            })
        }
        snapshots.forEach(doc=>{
            // console.log(doc.data())
            const ownerUid = doc.id
            const address = doc.data().address
            const NIC = doc.data().NIC

            const getOtherData = userModel.getUserData(ownerUid)
            getOtherData
            .then(doc => {
                // console.log(doc.data())

                const firstName = doc.data().firstName
                const secondName = doc.data().secondName
                const phoneNumber = doc.data().phoneNumber 
                const email = doc.data().email

                ownersJson.owners.push({
                    name : firstName + " " + secondName,
                    email,
                    phoneNumber,
                    address,
                    NIC,
                    ownerUid                    
                })

                i += 1
                if (i === snapshots.size){
                    // console.log(ownersJson)
                    return res.status(200).json({
                        ownersJson
                    })
                }

            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    error : "Something went wrong"
                })
            })
        })
    })
    .catch(err=>{
        return res.status(400).json({
            error : "Something went wrong"
        })
    })
}
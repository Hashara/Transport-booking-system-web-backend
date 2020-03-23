const admin = require('../firebase-admin/admin')
const db = admin.firestore();
const newOwnerRef = db.collection('newOwner');

exports.saveData = (req,res)=>{
    const{ name, phoneNumber, address} = req.body

    newOwnerRef.doc().set({
        name,
        phoneNumber,
        address,
        status:"PENDING"
    })

    return res.status(200).json({
        message: 'Request send successfully'
    })

    
}
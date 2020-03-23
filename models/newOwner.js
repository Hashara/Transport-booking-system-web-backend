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

exports.findPending = (req,res) =>{
    newOwnerRef.where('status', '==', 'PENDING').get()
    .then(snapshot => {
        if (!snapshot.empty) {  
            var newOwners =snapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}))
            
            return res.status(200).json({
                
                newOwners,
            })
        }else{
            return res.status(200).json({
                 message:"No new requests"
            })
        }
        
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}
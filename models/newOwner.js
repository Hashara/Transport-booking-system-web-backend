const admin = require('../firebase-admin/admin')
const db = admin.firestore();
const newOwnerRef = db.collection('newOwner');

exports.saveData = (req,res)=>{
    const{ name, phoneNumber, address} = req.body

    var date = new Date();    

    newOwnerRef.doc().set({
        name,
        phoneNumber,
        address,
        status:"PENDING",
        date

    })

    return res.status(200).json({
        message: 'Request send successfully'
    })

    
}

exports.findPending = (req,res) =>{
    // newOwnerRef.where('status', '==', 'PENDING').get()
    // .then(snapshot => {
    //     if (!snapshot.empty) {  
    //         var newOwners =snapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}))
            
            // return res.status(200).json({
                
            //     newOwners,
            // })
        // }else{
            // return res.status(200).json({
            //      message:"No new requests"
            // })
        // }
        
    // })
    // .catch(err => {
    //     console.log('Error getting documents', err);
    // });

    let query = newOwnerRef.where('status', '==', 'PENDING');

    let observer = query.onSnapshot(querySnapshot => {
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

exports.updateStatus = (uid,nextstatus)=>{

    let OwnerRef = newOwnerRef.doc(uid);
    const updateStatus = OwnerRef.update({
        status: nextstatus
    })

    return updateStatus;   
   
}
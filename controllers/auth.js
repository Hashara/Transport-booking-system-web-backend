const admin = require('../firebase-admin/admin')

exports.signup = async (req, res) =>{

    const { email, password } = req.body

    // res.json({
    //     data: 'you hit signup'
    // })

    const user = await admin.auth().createUser({
        email,
        password
    }).then(()=>{
        return res.json({
            message: `Email has been sent to ${email}`
        })
    }).catch(err =>{
        return res.json({
            message: err.message
        })
    })

    // console.log("user done")

    // res.send(user);
    

}
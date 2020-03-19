const sgMail =require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendEmail = (emailData,email,res)=>{
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
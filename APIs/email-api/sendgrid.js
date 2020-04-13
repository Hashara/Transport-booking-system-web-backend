const sgMail =require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.activationEmail = (email,token) =>{
    const emailData = {

        from: process.env.EMAIL_FROM,
        to:email,
        subject: 'Account activation link',
        html:`
            <h1>Please use the following link to activate your account</h1>
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />`
    
    }
    return sgMail.send(emailData)
}
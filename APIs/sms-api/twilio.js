require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.sendPassword = (password,phoneNumber) =>{
  return client.messages
  .create({
     body: `Your password of online bus booking system is ${password}`,
     from: process.env.TWILIO_PHONE_NUMBER,
     to: phoneNumber
   })
  // .then(message => {
  //     console.log(message.sid)
  //     console.log("HI")
  //   });
}

// client.messages
//   .create({
//      body: 'Message Testing',
//      from: process.env.TWILIO_PHONE_NUMBER,
//      to: '+94787169622'
//    })
//   .then(message => {
//       console.log(message.sid)
//       console.log("HI")
//     });
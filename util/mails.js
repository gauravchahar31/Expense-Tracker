const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API,
  process.env.MAILJET_SK,
);

exports.sendResetMail = async (userEmail, token) => {
  try{
    const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: "GAURAVCHAHAR@KVMKNOWLEDGEHUB.COM",
            Name: "Gaurav Chahar"
          },
          To: [
            {
              Email: userEmail,
              Name: 'User'
            }
              ],
              Subject: "Verify Your Email",
              TextPart: `'Click the link below to reset your password',`,
              HTMLPart: `<a href="http://localhost:3000/user/resetPassword/${token}">CLICK HERE</a>`
        }
      ]
    })

    const sendMail = await request
      .then((result) => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      })
    return sendMail;
  }
  catch(err){
    console.log(err);
  }
}
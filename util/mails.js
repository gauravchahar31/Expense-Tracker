const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendResetMail = async (userEmail, token) => {
    console.log(userEmail);
    const msg = {
        to: userEmail, 
        from: 'dcsa2022gauravkumar@kuk.ac.in', 
        subject: 'Reset Password',
        text: 'Click the link below to reset your password',
        html: `<a href="localhost:3000/user/resetPassword/${token}">CLICK HERE</a>`,
      }

    const sendMail = await sgMail
        .send(msg)
        .then(() => {
          return true
        })
        .catch((error) => {
            console.log(error);
          return false
        })
    return sendMail;
}
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.sendResetMail = async (userEmail, token) => {
    console.log(userEmail);
    const msg = {
        to: userEmail, 
        from: 'dcsa2022gauravkumar@kuk.ac.in', 
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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
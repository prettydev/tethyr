const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = (fromName, fromAddress, toAddress, subject, body) => {
  return sgMail.send({
    to: toAddress,
    from: {
      name: fromName,
      email: fromAddress,
    },
    subject: subject,
    html: body,
  });
}

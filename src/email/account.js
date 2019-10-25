const sgMail = require('@sendgrid/mail');
const sendgripAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgripAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'holomorfo.mx@gmail.com',
    subject: 'Thanks for joining in',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'holomorfo.mx@gmail.com',
    subject: 'Account cancelation',
    text: `Sorry to see you go ${name}, your account has been canceled. Please let us know if there is anything we can improve the reason of why you canceled the account.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};

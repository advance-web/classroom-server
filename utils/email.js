// const nodemailer = require('nodemailer');
// const { htmlToText } = require('html-to-text');
// const pug = require('pug');
const Mailjet = require('node-mailjet');

const clienURL = 'http://localhost:3001';

// Email
// Send the verification email with the generated token
exports.sendVerificationEmail = function (user, verifyToken) {
  const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_FROM,
          Name: 'hcmus-advance-web',
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: 'Verify your account',
        TextPart: 'Account verification',
        HTMLPart: `<h3>Mời bạn nhấn vào đường link sau để xác nhận email  <a href='${clienURL}/verify?token=${verifyToken}'>Mailjet</a>!</h3><br />Chúc bạn một ngày may mắn!`,
        CustomID: 'AppGettingStartedTest',
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

exports.acceptSendEmail = function (user) {
  const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_FROM,
          Name: process.env.EMAIL_NAME,
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: 'Email xác nhận đổi mật khẩu',
        TextPart: 'My first Mailjet email',
        HTMLPart: `<h3>Mời bạn nhấn vào đường link sau để xác nhận đổi mật khẩu  <a href='${clienURL}/reset-password?token=${user.verifyToken}'>Thay đổi password</a>!</h3><br />Chúc bạn một ngày may mắn!`,
        CustomID: 'AppGettingStartedTest',
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Hello from Thinh Lee ${process.env.EMAIL_FROM}`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       console.log('mail sent');
//       return nodemailer.createTransport({
//         service: 'SendGrid',
//         auth: {
//           user: process.env.SENDGRID_USERNAME,
//           pass: process.env.SENDGRID_API_TOKEN,
//         },
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.SENDGRID_HOST,
//       port: process.env.SENDGRID_PORT,
//       auth: {
//         user: process.env.SENDGRID_USERNAME,
//         pass: process.env.SENDGRID_API_TOKEN,
//       },
//     });
//   }

//   async send(template, subject) {
//     //create html
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//     });
//     //create mail option
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText(html),
//     };
//     //send email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to Natours Family');
//   }

//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minute)'
//     );
//   }
// };

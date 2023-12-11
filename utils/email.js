const Mailjet = require('node-mailjet');
const { appConfig } = require('./appConfig');

const clienURL = appConfig.CLIENT_URL;

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    return Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );
  }

  async send(html, subject) {
    //create mail option
    const mailOptions = {
      From: {
        Email: process.env.EMAIL_FROM,
        Name: process.env.EMAIL_NAME,
      },
      To: [
        {
          Email: this.to,
          Name: this.firstName,
        },
      ],
      Subject: subject,
      TextPart: 'HCMUS Advance Web Email service',
      HTMLPart: html,
      CustomID: 'AppGettingStartedTest',
    };
    //send email
    await this.newTransport()
      .post('send', { version: 'v3.1' })
      .request({ Messages: [mailOptions] });
  }

  async sendRegisterationRequest() {
    await this.send(
      `<h3>Bạn vừa được mời vào lớp học. Đăng ký ngay: <a href='${clienURL}/sign-up'>Đăng ký</a>!</h3><br />Chúc bạn một ngày may mắn!`,
      'Hãy đăng ký tài khoản mới để tham gia lớp học'
    );
  }

  async sendVerificationEmail(verifyToken) {
    await this.send(
      `<h3>Mời bạn nhấn vào đường link sau để xác nhận email  <a href='${clienURL}/verify?token=${verifyToken}'>Mailjet</a>!</h3><br />Chúc bạn một ngày may mắn!`,
      'Kích hoạt tài khoản của bạn'
    );
  }

  async acceptSendEmail(verifyToken) {
    await this.send(
      `<h3>Mời bạn nhấn vào đường link sau để xác nhận đổi mật khẩu  <a href='${clienURL}/reset-password?token=${verifyToken}'>Thay đổi password</a>!</h3><br />Chúc bạn một ngày may mắn!`,
      'Xác nhận đổi mật khẩu'
    );
  }

  async sendAddedToClassroom(classroomId) {
    await this.send(
      `<h3>Bạn đã được thêm vào một lớp học, hãy truy cập ngay: <a href='${clienURL}/classroom/${classroomId}'>Lớp học</a>!</h3><br />Chúc bạn một ngày may mắn!`,
      'Đã thêm vào lớp học'
    );
  }
};

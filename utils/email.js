const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(file, url) {
    this.from = file.sender;
    this.to = file.receiver;
    this.size = parseInt(file.size / 1000) + ' KB';
    this.url = url;
    this.appURL = process.env.APP_BASE_URL;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, mailSubject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      url: this.url,
      appURL: this.appURL,
      emailFrom: this.from,
      size: this.size,
      expires: '24 hours',
      subject: mailSubject,
    });

    // 2) Define email options
    const mailOptions = {
      from: `Share-Fy <${this.from}>`,
      to: this.to, // receivers adress
      subject: mailSubject, // Subject line
      html: html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendMail() {
    await this.send(
      'downloadLink',
      'Alert! a file has been shared with you 😃'
    );
  }
};

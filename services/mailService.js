const nodemailer = require('nodemailer');

exports.mailService = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Share-Fy <${from}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
};

/*
  // send mail with defined transport object
  // let mailOption = {
  //   from: `File Share <${from}>`, // sender address
  //   to: to, // list of receivers
  //   subject: subject, // Subject line
  //   text: text, // plain text body
  //   html: html, // html body
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOption, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log('Message sent: %s', info.messageId);
  //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  //   res.render('contact', { msg: 'Email has been sent' });
  // });

*/

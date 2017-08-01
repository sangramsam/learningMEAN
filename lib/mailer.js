const path = require('path');
const mailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
/* GET home page. */
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'singh.sangram56@gmail.com',
        pass: 'snh2sangram'
    }
};
var transporter = mailer.createTransport(smtpConfig),
    templatesDir = path.resolve(__dirname, '../', 'templates'),
    template = new EmailTemplate(path.join(templatesDir, 'ForgotPassword'));

module.exports.mailer = function (to, mesg,callack) {
    var local = {
        data: mesg
    };
    template.render(local, function (error, results) {
        if (error) {
            return console.log(error);
        }
        mailOptions = {
            from: smtpConfig.auth.user,
            to: to,
            subject: "Welome to MEAN",
            html: results.html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                callack(error);
            }
            callack();
        });
    });

};
var nodemailer = require('nodemailer');
var tokenNotifier = function(fromEmail,toEmail,toName,code){
	var poolConfig = {
		pool:true,
		host:'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type:'oauth2',
			user: 'lordkay1996@gmail.com',
			clientId:'932652975583-c44a93ppo8m56bv98uv3hn6d2s7juvsj.apps.googleusercontent.com',
			clientSecret:'_zkJjOGsYe98w7t23mfDirvm',
			refreshToken:'1/z2lMPjoQd6s3gz8o9h59v6RXFcq43uOqeuK0ASVLhf8',
			accessToken:'ya29.GlvfBQepXZcVJt51m_zyPOlpc1B8BylyI3IZ8rRMiBZKqqqIyMBgWzDkR67pCD3LDDI1QpITp69xaRpbn1JDFGyKcmj7BK8X_35bfDY4YFIDr7DTnIahR9kycjiD',
			expires:3600

		}
	};

	let transporter = nodemailer.createTransport(poolConfig);
	var message = {
		from: fromEmail,
		to: toEmail,
		subject: 'Accounts Activation Code',
		html: "<h3> Hi "+ toName + ",</h3><br/><p>Thank you for signing up for Quest - A Intuitive Task App.</p><p>Please you this code "+ code +" to activate your accounts. Once your accounts is activated , \
		you can enjoy all the amazing experience that comes with <strong>Quest</strong>\
		 </p>"
	};
	transporter.sendMail(message,function(err,info){
		if(!err){
			console.log(info.messageId)
		}else{
			console.log(err);
		}
	});


};

module.exports = tokenNotifier;
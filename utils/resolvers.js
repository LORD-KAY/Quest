//requiring the necessary modules
var bcrypt = require('bcryptjs'),
    SALT_FACTOR  = 10;

module.exports = {
	hashPassword: function(password_data){
		var password = password_data.toString();
		bcrypt.genSalt(SALT_FACTOR,function(err,salt){
			bcrypt.hash(password,salt,function(err,hash_password){
				console.log(hash_password);
				return hash_password;
			});
		});
	},
	validatePassword: function(password, confirm_password){
		
	}
}
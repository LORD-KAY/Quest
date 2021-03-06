//requiring the necessary modules
var bcrypt = require('bcryptjs'),
    SALT_FACTOR  = 10;

module.exports = {
	comparePassword: function(password, confirm_password){
		var pass_length = password.length;
		var conf_pass_length = password.length;
		if (pass_length == conf_pass_length) {
			if (password == confirm_password) {
				return true;
			}else{
				return false;
			}
		}
		else {
			return false;
		}
	},
	hashPassword: function(password_data){
		return new Promise(function(resolve,reject){
			var password = password_data.toString();
			bcrypt.genSalt(SALT_FACTOR,function(err,salt){
				bcrypt.hash(password,salt,function(err,hash_password){
					if (err) { throw err }
						else{
							resolve(hash_password);
						}
				});
			});
		});
	},
	validatePassword: function(password){
		var lowercase = /[a-z]/g;
		var uppercase = /[A-Z]/g;
		var numbers   = /[0-9]/g;
		var specials  = /([.-@]*)/g;

		if (!password.match(lowercase)) {
			return "Must contain at least one lowercase"
		}
	},
	generateValidToken: function(min,max){
		if (isNaN(min) || isNaN(max)) {
			return "Must be a number";
		}
		else{
			var randomNumber = Math.floor((Math.random() * (max + min)) + min);
			return randomNumber;
		}
	},
    getFirstNameCharacter: function(username){
	    var split_data = username.toString().split(' ');
        return split_data[0].length > 0 ? split_data[0].charAt(0) : " ";
    }
};
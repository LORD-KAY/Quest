var bcrypt = require('bcryptjs'),
    SALT_FACTOR = 10;
var Hash  = function(password){
    bcrypt.genSalt(SALT_FACTOR,function(err,salt){
        bcrypt.hash(password,salt,function(err,hash_passsword){
            return hash_passsword;
        });
    });
};

module.exports  = Hash;
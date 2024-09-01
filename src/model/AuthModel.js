const mongoose = require('mongoose');
const AuthSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        username:String,
        password: {
            type:String,
            required:true
        },
       

    }
)

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
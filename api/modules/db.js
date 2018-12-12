var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blogs', { useNewUrlParser: true });

var userSchema = new mongoose.Schema({
    email: String,
    phone: String,
    loginName: String,
    nickname: String,
    password: String,
    createTime: {
        type: Date,
        default: new Date()
    }
});

var userModel = mongoose.model("users", userSchema);


module.exports = {
    userModel
}
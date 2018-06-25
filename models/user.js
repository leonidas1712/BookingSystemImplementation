//the User schema, and a class with some methods for name.
//Created 7 Sep 2017
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name:String,
  email:String,
  token:String,
  google_id:String,
  isAdmin:Boolean

});

class User{
  get firstName(){
    return this.name.split(" ")[0];
  }

  get lastName(){
    return this.name.split(" ")[1];

  }
  //if it's just a normal getter method with nothing else it won't let you do it
  //cause that's already possible by just doing .email, etc
}

userSchema.loadClass(User);

module.exports = mongoose.model('User',userSchema);

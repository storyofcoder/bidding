var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');


var biddetail=mongoose.Schema({
    itemname: {
          type: String,
          index:true
    },
    minprice: {
      type: String
    },
    description: {
      type: String
    },
    timeperiod: {
      type: String
    },
    image: {
      data: Buffer,
      contentType: String
    }
  
  });


var bidadd=module.exports = mongoose.model('bidadd',biddetail);

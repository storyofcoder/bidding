const express= require('express')
const app=express()
var bodyParser= require('body-parser')
var cookieParser = require('cookie-parser') 
// var exphbs = require('express-handlebars')
var expressValidator = require('express-validator')
var session=require('express-session')
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy
var bcrypt=require('bcrypt')
var ejs=require('ejs')
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'public/' })
var flash=require('connect-flash')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
app.set('port',process.env.PORT||5000);
var MongoClient = require('mongodb').MongoClient;


//routes
//var routes=require('./routes/index');
var users=require('./routes/users');

var db;
MongoClient.connect('mongodb://heroku_jxkjhg1v:6s68tem51mlionrj2sneb7b53c@ds127988.mlab.com:27988/heroku_jxkjhg1v',function(err,database)
  {
    if(err)
      return console.log(err);
      db=database;
    return console.log("connected to mongo1");
  })


// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validotors
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace= param.split('.')
    , root=namespace.shift()
    , formParam=root;
   
   while(namespace.length) {
    formParam+= '['+namespace.shift() + ']';
   }
   return{
    param : formParam,
    msg : msg,
    value : value
   };
  }
}));

//Connect flash
app.use(flash());

// Global vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg= req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();  
});

//app.use('/',routes);
app.use('/users',users);



app.get('/bidonitem',function(req,res)
{
  console.log(req.query.bid)
  console.log(req.query.email)
    
  res.render('bidonitem.ejs',{bid: {id:req.query.bid},email: {email:req.query.email}})
})


/*app.post('/register',function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var username=req.body.username;
   password=req.body.password;
  var password2=req.body.password2;
  
  console.log(name);
  //validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','UserName is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
  
  var errors=req.validationErrors();
  
  if(errors)
  {
    console.log("error");
    res.render('registerscreen.ejs',{errors:errors
    });
  }
  else
  {
    var newUser=new User({
       name: name,
       email:email,
        username:username,
       password:password

      });
      createUser(newUser,function(err,user) {
        if(err) 
          {throw err;
               console.log("err 2");
                }
        console.log(user);
      });
      req.flash('success_msg','You are registered ');
      res.redirect('loginscreen');
    }
  });*/

/*app.post(mRegisterCustomer,function (req, res) {
    console.log("registeruser");
    var customer = new Customer;
        customer.Name=req.body.name;
        customer.Email=req.body.email,
        customer.Password=req.body.password,
        customer.Mobile=req.body.mobile,
        customer.Sex=req.body.sex;

    customer.save(function (error, info) {
        if (info) {
            console.log("successfull");
             res.render('loginscreen.ejs')
             } 
        else{
           console.log("error");
        }

    })
    //console.log(customer);
    //customer.save();
})*/


/*app.post(mLogin,function (req, res) {

    Customer.findOne({Email:req.body.email, Password:req.body.password},function (error, info) {
        if (info)
         {
          
        res.render('biddetail.ejs')
        }
        else{
            res.send("email and password do not matched");
        }
    })
})*/


app.get('/', (req, res) => {

  var cursor = db.collection('bidadd').find().toArray(function(err,result){
    if(err)
      return console.log(err)
    var cursor1 = db.collection('bidmoney').find().toArray(function(err1,result1){
     if(err1)
      return console.log(err1)
      res.render('index.ejs',{bidadd: result, bidmoney: result1})
        
    })
  })
})


app.get('/biddetail', (req, res) => {
 
  res.render('biddetail.ejs')
  
})

app.post('/upload',upload.any(),function(req,res,next){
  res.send(req.files);
})

app.post('/bidadd',upload.any(),function(req,res,next){

  req.body.photo=req.files[0].filename;
  console.log(db);
  console.log(req.body);
   console.log(req.files);
   
   console.log(req.files[0].filename);
  db.collection('bidadd').save(req.body,req.files[0].path,function(err,result)
  {
    if(err)
      return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

var ObjectId = require('mongodb').ObjectID;

 app.post('/bidmoney',function(req,res)
{
console.log("bid lgao");
var cursor=db.collection('bidadd').findOne({"_id": ObjectId(req.body.postid) },(function(err,result)
{
   console.log("post id "+req.body.postid)
   var updatevalue=result;
    console.log("value="+result.itemname);
  

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
   port: 587,
   secure: false,
  auth: {
    user: 'bidfouryou@gmail.com',
    pass: 'bitsatpilani'
  }
});

var mailOptions = {
  from: 'bidfouryou@gmail.com',
  to: req.body.email,
  subject: 'Sending Email using Node.js',
  text: 'mail of node'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


 // result.update(curr_bid: parseInt(req.body.money));
  console.log(req.body.money);
  console.log(result.curr_bid);
  
  
   if( req.body.money > parseInt(result.curr_bid))
  {
    console.log("found")
    db.collection('bidadd').updateOne({"_id": ObjectId(req.body.postid) },{curr_bid: req.body.money ,itemname: result.itemname,minprice: result.minprice,
     description: result.description,timeperiod: result.timeperiod,name: result.name,email: result.email,photo: result.photo,commit: result.commit});
     res.redirect('/')
  }
  else 
  {
    console.log("sidhaa")

    req.flash('signupMessage', 'jkjj');
     res.redirect('/');
  }
}))
})



app.listen(app.get('port'),function()
{
console.log("Api running on port",app.get('port'))  
})


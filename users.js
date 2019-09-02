var express=require('express');
var router=express.Router();

//Register
router.get('/registerscreen',function(req,res){
	res.render('registerscreen.ejs');
});

//Login
router.get('/loginscreen',function(req,res){
	res.render('loginscreem.ejs');
})



module.exports= router;
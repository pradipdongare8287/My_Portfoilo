const express = require('express');
const routes = express.Router()
const mysql = require('mysql2');
const util = require('util')


 var database = mysql.createConnection({
    host:'bnbnpjlwouew0p07mjrd-mysql.services.clever-cloud.com',
    user:'uv2js8mxroohueg0',
    password:'19tYHEBa0uTxgTQWVy3i',
    database:'bnbnpjlwouew0p07mjrd'
 })


  routes.use(async(req,res,next)=>{
    var selectdata = `select * from hero`
    var data = await query(selectdata)

    var user={
        photo: data[0].Photo,
        name1: data[0].name
    }
   
    res.locals.hederedata=user
     next();
  })



 var query = util.promisify(database.query).bind(database);

 routes.use(express.urlencoded({extended:true}))
//  ========================================================================================================

routes.get('/',async(req,res)=>{
    var select = `select * from hero`
    var hero = await query(select);
    res.render('website/home.ejs',{hero:hero[0]})
})
routes.get('/about',async(req,res)=>{
    var select = `select * from about`
    var about = await query(select)
    res.render('website/about.ejs',{about:about[0]})
})
routes.get('/resume',async(req,res)=>{
    var select = `select * from technicalskills`
    var select2 = `select * from experience`
    var select3 = `select * from education`
    var sel = await query(select2);
    var skill = await query(select)
    var education = await query(select3)

     
    res.render('website/resume.ejs',{skill:skill,data:sel,education:education})
})
routes.get('/services',async(req,res)=>{
    var select1 = `select * from services`
    var services = await query(select1);
 
    res.render('website/services.ejs',{services:services})
})
routes.get('/Certificate',async(req,res)=>{
    var select = `select * from portfolio`
    var certificate = `select * from certificates`
    var all_certificate = await query(certificate)
    var sel = await query(select)
    res.render('website/portfolio.ejs',{portfolio:sel,all_certificate:all_certificate})
})
routes.get('/contact',async(req,res)=>{
    var select = `select * from contact`
    var contact = await query(select)
    res.render('website/contact.ejs',{contact:contact[0]})
})
routes.get('/testimonials',async(req,res)=>{
    var select = `select * from testimonial`
    var testimonials = await query(select)
    res.render('website/testimonials.ejs',{testimonials:testimonials})
})
routes.get('/project',async(req,res)=>{
    
    var select = `select * from blog`
    var blog = await query(select)
    res.render('website/blog.ejs',{blog:blog})
})

routes.post('/save_contact',async(req,res)=>{
   var {name,email,subject,message}=req.body;
   var status = 'pending';

   var d = new Date();

    var date = new Date().toISOString().split("T")[0];

    var insert = `insert into contact_save (name,email,subject,message,cdate,status)values(?,?,?,?,?,?)`
    var ins = await query(insert,[name,email,subject,message,date,status]);
    res.redirect('/contact')

})
module.exports=routes

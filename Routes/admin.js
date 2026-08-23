const express = require('express');
const routes = express.Router()
const mysql = require('mysql2');
const util = require('util');
const session = require('express-session');
const fileupload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { render } = require('ejs');
const { rejects } = require('assert');

routes.use(session({
    secret:'mykey',
    resave:false,
    saveUninitialized:true
}))

routes.use(express.static('public'))

var database = mysql.createConnection({
    host:'bnbnpjlwouew0p07mjrd-mysql.services.clever-cloud.com',
    user:'uv2js8mxroohueg0',
    password:'19tYHEBa0uTxgTQWVy3i',
    database:'bnbnpjlwouew0p07mjrd'
})

function session_check(req,res,next){
    if(req.session.username){
        next()
    }
    else{
        res.redirect('/admin/login')
    }
}



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


// ==================================================

                        // HEADER DATA

routes.use(async (req, res, next) => {

                                    if (!req.session.lid) {
                                        return next();
                                    }

                                        var id = req.session.lid;

                                         var sql = `SELECT L.*, h.*FROM login AS L INNER JOIN hero AS h ON L.lid = h.sr_No WHERE h.sr_No = ?`;

                                         var data = await query(sql, [id]);

                                        if (data.length > 0) {
                                            res.locals.headerData = {
                                                name: data[0].name,
                                                photo: data[0].Photo
                                            };
                                        }

                                            next();
                                        });


var query = util.promisify(database.query).bind(database);

routes.use(express.urlencoded({extended:true}))
routes.use(fileupload())

// ========================================================================================================

            // LOGIN PAGE AND DASHBORD

routes.get('/',session_check,(req,res)=>{
    // res.send(req.session)
    var username = req.session.username
    res.render('admin/dashboard.ejs',{username:username});
})
routes.get('/login',(req,res)=>{
    res.render('admin/login.ejs');
})
routes.get('/forget-password',(req,res)=>{
    res.render('admin/forgot-password.ejs');
})

routes.get('/add_user',(req,res)=>{
    res.render('admin/add_user.ejs');
})


routes.post('/add_new_user',async(req,res)=>{
    var {email,password}=req.body;
    var insert = `insert into login(username,password)values(?,?)`;
    var ins = await query(insert,[email,password]);
    res.redirect('/admin/add_user')


})


routes.post('/login_check',async(req,res)=>{
    var {username,password}=req.body;
    var select =`select * from login where username=? and password=?`
    var sel = await query(select,[username,password]);
    // res.send(sel)
    if(sel[0]){
        req.session.lid = sel[0].lid;
        req.session.username = sel[0].username;
        res.redirect('/admin')

    }
    else{
        res.redirect('/admin/login')
    }
})

 routes.get('/logout',session_check,(req,res)=>{
    req.session.destroy();
    res.redirect('/admin/login')
})

// ======================================================================================

    // SKILL SECTION

routes.get('/add_skill',session_check,(req,res)=>{
    var username = req.session.username
    res.render('admin/add_skill.ejs',{username:username})
})



routes.post('/add_skill_save',session_check,async(req,res)=>{
    var {tecnology,percentage}=req.body;
    var insert =`insert into technicalskills(tecnology,percentage)values(?,?)`
    var ins = await query(insert,[tecnology,percentage]);
    res.redirect('/admin/add_skill')
})

routes.get('/edit_skill',session_check,async(req,res)=>{
    var username = req.session.username
    var select = `select * from technicalskills`
    var sel = await query(select)
    // res.send(sel)
    res.render('admin/edit_skill.ejs',{skill:sel,username:username})
})

routes.get('/del_tech/:id',session_check,async(req,res)=>{
  var id = req.params.id;
  var delete1 = `delete from technicalskills where tech_id=?`
  var del = await query(delete1,[id],(err,result)=>{
    res.redirect('/admin/edit_skill')
  });

})

// ===========================================================================================

        // ADMIN SECTION AND EDUCATION SECTION

       
routes.get('/add_experience',session_check,(req,res)=>{

    

    var username = req.session.username
    res.render('admin/add_experience.ejs',{username:username})
})

routes.post('/save_expirence',session_check,async(req,res)=>{
   var {experience_year,Position,experience_company,experience_disc}=req.body;
    var insert=`insert into experience(experience_year,Position,experience_company,experience_disc)values(?,?,?,?)`
    var ins = await query(insert,[experience_year,Position,experience_company,experience_disc]);
    res.redirect('/admin/add_experience')
})

routes.get('/manage_Experience',session_check,async(req,res)=>{

    var username = req.session.username

    var select = `select * from experience`
    var edu = `select * from education`
    var sel = await query(select)
    var educ = await query(edu)
    res.render('admin/manage_experience.ejs',{experience:sel,eduction:educ,username:username})
})

routes.post('/save_education',session_check,async(req,res)=>{
 var {eduction_year,qualification,university}=req.body;
    var insert = `insert into education(Eduction_year,Qualification,University)
                    values(?,?,?)`

    var ins = await query(insert,[eduction_year,qualification,university],(err,result)=>{
        res.redirect('/admin/add_experience')
    })
})

routes.get('/del_exp/:id',session_check,async(req,res)=>{
    var id = req.params.id;
    var delete1 = `delete from experience where experience_id=?`
    var del = await query(delete1,[id])
    res.redirect('/admin/manage_Experience')
    
})

routes.get('/del_edu/:id',session_check,async(req,res)=>{
    var id = req.params.id
    var delete2 =  `delete from education where edu_id=?`
    var del = await query(delete2,[id]);
    // res.send(del)
   res.redirect('/admin/manage_Experience')
})

// =================================================================================================
// =================================================================================================

routes.get('/add_service',session_check,(req,res)=>{
    var username = req.session.username
    res.render('admin/add_service.ejs',{username:username})
})


routes.post('/add_service',session_check,async(req,res)=>{
    var {Service_name,Service_icon,Service_discription}=req.body;

    var insert =`insert into services(Service_name,Service_icon,Service_discription)
                values(?,?,?)`
    var ins = await query(insert,[Service_name,Service_icon,Service_discription,]);
    res.redirect('/admin/add_service')
})

routes.get('/managae_service',session_check,async(req,res)=>{
    var username = req.session.username
    var select = `select * from services`
    var sel = await query(select);
    res.render('admin/manage_service.ejs',{service:sel,username:username})
})

routes.get('/del_ser/:id',session_check,async(req,res)=>{
    var id = req.params.id;
    var delete1 = `delete from services where sr_id=?`
    var del = await query(delete1,[id]);
    res.redirect('/admin/managae_service')
})

// ===============================================================================================
// ===============================================================================================



routes.get('/add_project',session_check,(req,res)=>{
    var username = req.session.username
    res.render('admin/add_project.ejs',{username:username})
})

routes.post('/add_project',session_check,async(req,res)=>{
   var {project_name,project_category}=req.body;

   var img = req.files.project_video;
    var newname = Date.now()+img.name;
    var imgpath = path.join(__dirname,'../','public',newname)
    img.mv(imgpath,(err)=>{})

   var insert = `insert into portfolio (Project_name,Project_category,Background_img)
                values(?,?,?)`

   var ins = await query(insert,[project_name,project_category,newname]);
   res.redirect('/admin/add_project');
})

routes.get('/manage_project',session_check,async(req,res)=>{
    var username = req.session.username
    var select = `select * from portfolio`
    var sel = await query(select)
   res.render('admin/manage_project.ejs',{project:sel,username:username})
})

routes.get('/add_certificate',(req,res)=>{
    res.render('admin/Add_certificate.ejs')
})

routes.post('/uploade_certificate',async(req,res)=>{
    var {certificate_name,institute_name}=req.body

    var certificat_img = req.files.certificate_image
    var new_name = Date.now()+certificat_img.name;
    var save_img_location = path.join(__dirname,'../','public',new_name)
    certificat_img.mv(save_img_location,(err)=>{})

    var save_certificate = `insert into certificates (certificate_name,certificate_decleare_institude,certificate_img)values(?,?,?)`

    var certificate = await query(save_certificate,[certificate_name,institute_name,new_name])
    
    res.redirect('/admin/add_certificate')

})

routes.get('/manage_manage',async(req,res)=>{
    var select_all_certificate = `select * from certificates`
    var certificate = await query(select_all_certificate)
    res.render('admin/Manage_certificate.ejs',{certificate:certificate})
    
})

routes.get('/delete_certificate/:id',async(req,res)=>{
    var id = req.params.id;
    var delete_certificate = `delete from certificates where cid=?`
    var delete1 = await query(delete_certificate,[id]);
    res.redirect('/admin/manage_manage')
})

routes.get('/del_project/:id/:img',session_check,async(req,res)=>{
    var id = req.params.id;
    var delimg = req.params.img
    var del = path.join(__dirname,'../','public',delimg)
    fs.unlink(del,(err)=>{})
    
    var delete1 = `delete from portfolio where id=?`
    var del = await query(delete1,[id]);
    res.redirect('/admin/manage_project')
})
// ================================================================================================================
// ================================================================================================================

routes.get('/add_post',session_check,(req,res)=>{
    var username = req.session.username
    res.render('admin/add_blog.ejs',{username:username})
})

routes.post('/add_post',session_check,async(req,res)=>{
   var {post_date,post_name,post_discription,post_url}=req.body;
   var img = req.files.image;
   var newname = Date.now()+img.name;
   var imglocation = path.join(__dirname,'../','public',newname)
    img.mv(imglocation,(err)=>{})

   var insert = `insert into blog (post_date,post_name,post_discription,Image,blog_link)
                values(?,?,?,?,?)`

   var inser = await query(insert,[post_date,post_name,post_discription,newname,post_url]);

   res.redirect('/admin/add_post')
   
})
 

routes.get('/manage_blog',session_check,async(req,res)=>{
    var username = req.session.username
    var select = `select * from blog`
    var sel = await query(select)
        res.render('admin/manage_blog.ejs',{data:sel,username:username})
})

routes.get('/del_post/:id/:img',session_check,async(req,res)=>{
    var id = req.params.id;
    var delimg = req.params.img;

    var del = path.join(__dirname,'../','public',delimg)
    fs.unlink(del,(err)=>{})
    
    var delete1 = `delete from blog where Post_id=?`
    var del = await query(delete1,[id])
    res.redirect('/admin/manage_blog')
})


// ====================================================================================================================

// ====================================================================================================================

routes.get('/add_testimonial',session_check,(req,res)=>{
    var username = req.session.username
    res.render('admin/add_testimonal.ejs',{username:username})
})

routes.post('/add_client',session_check,async(req,res)=>{
    var {clint_name,client_position,client_discription}=req.body;
    var insert = `insert into testimonial(clint_name,client_position,client_discription)
                values(?,?,?)`
    var ins =  await query(insert,[clint_name,client_position,client_discription]);

    res.redirect('/admin/add_testimonial')
})

routes.get('/manage_testimonials',session_check,async(req,res)=>{
    var username = req.session.username

    // res.render('admin/managate_testimonials.ejs')
    var select = `select * from testimonial`
    var sel = await query(select);
    res.render('admin/managate_testimonials.ejs',{deta:sel,username:username})

})

routes.get('/del_testimonials/:id',session_check,async(req,res)=>{
    var id = req.params.id;
    var delete1 = `delete from testimonial where test_id=?`
    var del = await query(delete1,[id]);
    res.redirect('/admin/manage_testimonials')
})




routes.get('/setting',session_check,async(req,res)=>{
    var select = `select * from contact`
    var select2 =`select * from social`

    var sel2 = await query(select2)
    var sel = await query(select)

    res.render('admin/settings.ejs',{data:sel[0],data2:sel2[0]})
})

routes.post('/save_contact/:img',session_check,async(req,res)=>{
   
   var {email,phone,address,map,old_logo}=req.body;
   var old_logo = req.params.img;

    if(req.files && req.files.logo){
        var logo = req.files.logo;
        var logoname = Date.now()+logo.name;
        var logopath = path.join(__dirname,'../','public',logoname);
        logo.mv(logopath,(err)=>{})

       var del = path.join(__dirname,'../','public',old_logo)
       fs.unlink(del,(err)=>{})

    }
    else{
        var logoname = old_logo;
    }

    var update = `update contact set Email=?,Phone=?,Address=?,Logo=?,Map=? where cid=1`

    var upd = await  query(update,[email,phone,address,logoname,map])

    res.redirect('/admin/setting')

})

routes.post('/social_save',session_check,async(req,res)=>{
        var {facebook,twitter,instagram,linkedin,github,youtube}=req.body;

        var update = `update social set facebook=?,twitter=?,instagram=?,linkedin=?,github=?,youtube=? where sid=1`
        var upda = await query(update,[facebook,twitter,instagram,linkedin,github,youtube])
        res.redirect('/admin/setting')
        
})

// ==========================================================================================

// ==========================================================================================

routes.get('/hero',session_check,async(req,res)=>{
    var select = `select * from hero`
    var sel = await query(select)
    res.render('admin/update_hero.ejs',{deta:sel[0]})
})

routes.post('/save_hero/:img',async(req,res)=>{
    var {name,Position,experience_disc}=req.body;
    var oldimg = req.params.img;
    
    if(req.files && req.files.Photo){
        var newimg = req.files.Photo;
        var newname = Date.now()+newimg.name;
        var newpath = path.join(__dirname,'../','public',newname);
        newimg.mv(newpath,(err)=>{})

        var delold = path.join(__dirname,'../','public',oldimg)
        fs.unlink(delold,(err)=>{})
    }
    else{

        var newname = oldimg
    }
    var update = `update hero set name=?,Position=?,experience_disc=?,Photo=? where sr_No=1 `
    var up = await query(update,[name,Position,experience_disc,newname])
   res.redirect('/admin/hero')
    // res.send()
})

// =====================================================================================================
// =====================================================================================================

    routes.get('/about',session_check,async(req,res)=>{
        var select = `select * from about`
        var sel = await query(select);

        res.render('admin/about.ejs',{deta:sel[0]})
    })

    routes.post('/save_about/:img',async(req,res)=>{
        var oldimg = req.params.img;
        var {position,expirience_dicription,name,email,location,freelance,Project_complete,happy_client,awards_won,year_of_expirence}=req.body;
        
        if(req.files && req.files.photo){
            var newimg = req.files.photo;
            var newname = Date.now()+newimg.name;
            var imglocation = path.join(__dirname,'../','public',newname);
            newimg.mv(imglocation,(err)=>{})

            var delold = path.join(__dirname,'../','public',oldimg);
            fs.unlink(delold,(err)=>{})
        }
        else{
           var newname = oldimg
        }
        var update =`update about set position=?,expirience_dicription=?,name=?,email=?,location=?,freelance=?,Project_complete=?,happy_client=?,Awards_won=?,year_of_expirence=?,Image=? where sid=1`
        var upd = await query(update,[position,expirience_dicription,name,email,location,freelance,Project_complete,happy_client,awards_won,year_of_expirence,newname]);

        res.redirect('/admin/about')
   
    })  

// ======================================================================================================

    routes.get('/pending_enq',session_check,async(req,res)=>{
        var select = `select * from contact_save where status='pending'`
        var sel = await query(select);
        res.render('admin/pending_enq.ejs',{penditreq:sel})
    })
    routes.get('/confirm_request/:id',session_check,async(req,res)=>{
        var id = req.params.id;
        var update = `update contact_save set status='Confirm' where cid=?`
        var upda = await query(update,[id])
        res.redirect('/admin/pending_enq')
    })

    routes.get('/confirm_enq',session_check,async(req,res)=>{
        var select = `select * from contact_save where status='Confirm'`
        var sel = await query(select)
        res.render('admin/confirm_enq.ejs',{confirm1:sel})
    })

    routes.get('/reject_req/:id',session_check,async(req,res)=>{
        var id = req.params.id;
        var update = `update contact_save set status='Reject' where cid=?`
        var upd =  await query(update,[id])
        res.redirect('/admin/pending_enq')
    })

    routes.get('/reject_req',session_check,async(req,res)=>{
        var select = `select * from contact_save where status='Reject'`
        var sel = await query(select)
        res.render('admin/reject_req.ejs',{reject:sel})
    })
module.exports=routes







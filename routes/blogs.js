const express = require('express')
const router = express.Router()
const multer = require('multer')

//Bring the mongoose model here
const Blog = require('./../models/Blog')

//define storage for the images
const storage = multer.diskStorage({

    //destination for file
    destination:function(req,file,cb){
        cb(null,'./public/uploads/images')
    },
    //add back the extension
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})

//upload parameters for multer
const upload = multer({
    storage:storage,
    limits:{
        fieldSize : 1024*1024*3
    }
})



//make the body of the router by using get
//send this to the server.js file
router.get('/',(req,res)=>{
    res.send('this is the blog')
})

router.get('/new',(req,res)=>{
    res.render('new')
})

// read blog by id
router.get('/:slug',async (req,res)=>{
    let blog = await Blog.findOne({slug:req.params.slug})
    if(blog){
        res.render('show',{blog:blog})
    }else{
        res.redirect('/')
    }
})
//routes that handle new post
router.post('/',upload.single('image'),async (req,res)=>{
    //  console.log(req.body)
    // console.log(req.file)
     let blog = new Blog({
         title:req.body.title,
         author:req.body.author,
         description:req.body.description,
         img:req.file.filename
    });
    try{
        blog = await blog.save()
        // console.log(blog.id)
        res.redirect(`blogs/${blog.slug}`)
    }catch(error){
        console.error(error)
    }
    
})
//route that handle edit view
router.get('/edit/:id',async (req,res)=>{
    let blog = await Blog.findById(req.params.id)
    res.render('edit',{blog:blog})
})
//route that handle update
router.put('/:id',upload.single('image'),async (req,res)=>{
    req.blog = await Blog.findById(req.params.id)
    let blog = req.blog
    blog.title = req.body.title,
    blog.author = req.body.author,
    blog.description = req.body.description
    blog.img = req.file.originalname
    try {
        blog = await blog.save()
        //rederect to the view route
        res.redirect(`/blogs/${blog.slug}`)
    } catch (error) {
        console.log(error)
        //blog:blog so that it doesn't look like empty
        res.redirect(`/seblogs/edit/${blog.id}`,{blog:blog})
    }
})
//route that handle delete
router.delete('/:id',async (req,res)=>{
    await Blog.findByIdAndDelete(req.params.id)
    res.redirect('/')
})



module.exports = router

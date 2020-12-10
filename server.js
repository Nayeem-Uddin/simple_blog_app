const express = require('express')
const app = express()

const blogRouter = require('./routes/blogs')
//bring in mongoose
const mongoose = require('mongoose')
//bring method override
const methodOverride = require('method-override')
//bring the blog here
const Blog = require('./models/Blog')

require('dotenv/config')
//connect with the database
mongoose.connect(process.env.db_connection, {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true});
    mongoose.connection.once('open', function(){
      console.log('Conection has been made!');
    }).on('error', function(error){
        console.log('Error is: ', error);
});

//make body-parser
app.use(express.urlencoded({extended:false}))
//make app.use function for method-override
app.use(methodOverride('_method'))
//route for the index
app.get('/',async (req,res)=>{
    // const blogs = await Blog.find.sort({timeCreated:'desc'})
    const blogs = await Blog.find().sort({timeCreated:'desc'})
    res.render('index',{blogs:blogs})
})
app.use(express.static('public'))

//use the blogRouter here
app.use('/blogs',blogRouter)

//set template engine
app.set('view engine','ejs')
//setting up the port number
const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

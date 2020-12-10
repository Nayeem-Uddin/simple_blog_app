const mongoose = require('mongoose')
const domPurifier = require('dompurify')
const { JSDOM} = require('jsdom')
const htmlPurify = domPurifier(new JSDOM().window)

const stripHtml = require('string-strip-html')

const slug = require('mongoose-slug-generator')
//initialize slug
mongoose.plugin(slug)
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
        
    },
    timeCreated:{
        type:Date,
        default:()=>new Date
    },
    snippet:{
        type:String
    },
    img:{
        type:String,
        default:'placeholder.jpg'
    },
    slug:{
        type:String,
        slug:'title',unique:true,
        slug_padding_size:2
    },
})

blogSchema.pre('validate',function(next){
    if(this.description){
        this.description = htmlPurify.sanitize(this.description)
        this.snippet = stripHtml(this.description.substring(0,200)).result
    }
    next()
})

 const Blog = mongoose.model('Blog',blogSchema)
 module.exports = Blog
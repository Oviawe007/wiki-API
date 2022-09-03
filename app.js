//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true})
.then(() => {console.log("Connected to MongoDB successfully");})
.catch((err) => {console.error(err);});


const ArticleSchema = {
    title : String,
    content : String
};


const Article = mongoose.model('Article', ArticleSchema);


//General routes

app.route('/articles')
.get(function(req,res){
    Article.find()
    .then((foundArticle)=>{if (foundArticle.length === 0){
        res.send("No articles found");
    } else{res.send(foundArticle)}})
    .catch(err=>{
        console.error(err);
    })
})
.post( function(req, res) {
    const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
    });
    newArticle.save()
    .then(() => {res.send("article saved successfully")})
    .catch(err => console.err(err))
})
.delete(function(req, res){

    Article.deleteMany({})
    .then(() => {res.status(200).send("Successfully cleared the Database.")})
    .catch(err => console.err(err));
});

// individual route

app.route('/articles/:articleTitle')
.get(function (req, res) {
    const articleTitle = req.params.articleTitle;
    
    Article.findOne({title: articleTitle})
    .then(function (foundArticle) {
        if(!foundArticle){
            res.send('No article found');
        }else {
            res.send(foundArticle)}})
    .catch(function (err) {console.error(err)});
})
.put(function (req, res) {
    Article.findOneAndUpdate({articleTitle: req.body.articleTitle},
        {$set :{title: req.body.title, content: req.body.content}}, 
        {new: true},
        function(err, result){
            if(!err){
                res.send(result);
            }
        });
})
.patch(function (req, res){
    Article.findOneAndUpdate({articleTitle: req.body.articleTitle},
        {$set :{title: req.body.title, content: req.body.content}},
        {new : true}, 
        function(err, result){
            if(!err){
                res.send(result);
            }
        })
})
.delete(function (req, res) {
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({title: articleTitle})
    .then(() => {res.send("Deleted successfully!!!")})
    .catch(err => {res.send(err);});

});


























app.listen(3000, function() {
  console.log("Server started on port 3000");
});
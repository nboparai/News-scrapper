// Dependencies
// =============================================================
// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
    
  app.get('/', function (req, res) {
    res.redirect('/articles');
  });

    app.get("/api/scrape", function(req, res){
        console.log("in scrape");
        axios.get('https://www.nytimes.com/section/world').then(result => {
            // console.log(`data is ${result.data}`);
            var $ = cheerio.load(result.data);
            // console.log(result.data)
           
            $("article h2").each(function(i, element) {
                // Save an empty result object
              
                var result = {};
                
                
                // Add the text and href of every link, and save them as properties of the result object
                
                 result.title = $(this).children().text();
            
                result.link = $(this).children().attr('href');

                result.summary = $(this).find(".summary").text();
                let headlineArray = [];
            
                // console.log(result.summary);
          
                // Create a new Article using the `result` object built from scraping
                db.Article.find({}).then(function(response){
                    // console.log(`response from database ${response}`);
                    response.forEach(record => {
                        headlineArray.push(record.title);
                    })

                    // console.log(headlineArray);
                });
                if(headlineArray.indexOf(result.title) == -1) {
                db.Article.create(result, function (err, data) { 
                  if (err) {
                    console.log(err)
                  }
                 else {
                   console.log(data);
                 }
                  
              
          
            // res.send("scrape complete")
                });
              }
        })
      
    })
    // res.redirect("/")
});
app.get("/articles", function (req, res) {
    // Grab every record 
    db.Article
      .find({}, function (error, data) {
        
        if (error) {
          console.log(error);// Or send the doc to the browser as a json object
          
        } else {
          res.render("index", {result: data});
          console.log(data);
        }
    
      })
      .sort({'_id': -1});
  });
           

  // Grab an article by it's ObjectId
  app.get("/articles/:id", function (req, res) {
    
    db.Article.findOne({"_id": req.params.id})
    // ..and populate all of the notes associated with it
      .populate("note")
    
      .exec(function (error, doc) {
        // Log any errors
        if (error) {
          console.log(error
          );
        } else {
          res.render("notes", {result: doc});
          
        }
      });
  });

  // Add a new note
  app.post("/articles/:id", function (req, res) {
    // Create a new note 
    db.Note
      .create(req.body, function (error, doc) {
        
        if (error) {
          console.log(error
          );
        } else {
          // Use the article id to find and update its note
          db.Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $push: {
              "note": doc._id
            }
          }, {
            safe: true,
            upsert: true,
            new: true
          })
          
            .exec(function (err, doc) {
              
              if (err) {
                console.log(err);
              } else {
                
                res.redirect('back');
              }
            });
        }
      });
  });

  app.delete("/articles/:id/:noteid", function (req, res) {
    db.Note
      .findByIdAndRemove(req.params.noteid, function (error, doc) {
        
        if (error) {
          console.log(error
          );
        } else {
          console.log(doc);
          db.Article.findOneAndUpdate({
            "_id": req.params.id
          }, {
            $pull: {
              "note": doc._id
            }
          })
          // 
            .exec(function (err, doc) {
              
              if (err) {
                console.log(err);
              }
            });
        }
      });
  });




}
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

    app.get("/api/scrape", function(req, res){
        console.log("in scrape");
        axios.get('https://www.nytimes.com/section/world').then(result => {
            // console.log(`data is ${result.data}`);
            var $ = cheerio.load(result.data);
            // console.log(result.data)
           
            $("article h2").each(function(i, element) {
                // Save an empty result object
              
                var result = {};
                var headlineArray = {}
                // Add the text and href of every link, and save them as properties of the result object
                
                 result.title = $(this).children().text();
            
                result.link = $(this).children().attr('href');

                result.summary = $(this).find(".summary").text();
                

                console.log(result.summary);
          
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                  .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(`artcle db ${dbArticle}`); 
                  })
                  .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                  });
              });
          
            res.send("scrape complete")
        })
      
    })

    app.get("/api/savedArticles", function(req, res){
        console.log("In saved articles");
     db.Article.find({}).then(function(result) {
         console.log(result, "from saved article")
         res.send(result);
     })
    })

}
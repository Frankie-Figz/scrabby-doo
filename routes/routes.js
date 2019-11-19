// Routes
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

// A GET route for scraping the echoJS website
module.exports = function(app) {
    app.get("/", (req, res) => {
        res.render('index');
    })

    app.get("/myarticles", (req, res) => {
        res.render("myarticles");
    })
    
    app.get("/savedarticles", (req, res) => {
      db.Article.find({saved: true}).then(data => {
        console.log(data);
        res.json(data);
      })
    })

    app.get("/scrape", (req, res) => {
      // Scrape the NYTimes website
      axios.get("http://www.nytimes.com").then(function(response) {
        var $ = cheerio.load(response.data);
        console.log("STARTED SCRAPING ....");
        // Now, find and loop through each element that has the ".assetWrapper" class
        // (i.e, the section holding the articles)
        $(".assetWrapper").each(function(i, element) {
          // In each article section, we grab the headline, URL, and summary
          // Grab the headline of the article
          var head = $(this).find("h2").text().trim();
          // Grab the URL of the article
          var url = $(this).find("a").attr("href");
          // Grab the summary of the article
          var sum = $(this).find("p").text().trim();
            // So long as our headline and sum and url aren't empty or undefined, do the following
            if (head && sum && url) {
              // This section uses regular expressions and the trim function to tidy our headlines and summaries
              // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
              var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
              var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
              // Initialize an object we will push to the articles array
              var dataToAdd = {
                title: headNeat,
                summary: sumNeat,
                link: "https://www.nytimes.com" + url
              };
              // Push new article into articles array
              db.Article.create(dataToAdd)
                .catch(function(err) {
                  return res.json(err);
                });
            // Ends IF statement   
            }
          // Ends each function iterating over the the asset wrappers
          });
          console.log("....DONE SCRAPING");
          // Stores the object created from the scrape in the database
          db.Article.find({}).then(data => {
            res.json(data);
          });
        // Ends the axios API call      
        });
      // Ends the GET call to NY times    
      });

      // Route for grabbing a specific Article by id, populate it with it's note
      app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
      
      // Route for saving/updating an Article's associated Note
      app.post("/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        console.log(req.body);
        db.Article.updateOne({_id: req.params.id}, req.body)
          .then(function(data) {
            console.log(data);
            res.status(200);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });

      app.post("/articles/:id/comments", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body, (err, val) => {
          console.log(val);
          db.Article.updateOne({_id: req.params.id},{$push: {"note":val}}).then((data) => {
            res.send(data);
          });
        })
      });

      app.get("/articles/:id/comments", function(req,res){
        // Get a note
        db.Article.findOne({_id : req.params.id}).then(function(data){
          // res.json(data);
          console.log(data.note);
          db.Note.find({_id: { $in: data.note}}).then(function(data){
            res.json(data);
          });
        });
      });

      app.get("/articles/comments/:id", function(req,res){
        // Get the comments from the note
        db.Note.findOne({_id: req.params.id}).then(function(data){
          res.json(data);
        });
      });

}


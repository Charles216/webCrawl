const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(
  "mongodb://localhost/scrapedNews",
  { useNewUrlParser: true }
);

// Routes
//+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+
console.log(`**Headline/Summary/URL/Photo?**`);

app.get("/scrape", function(req, res) {
  axios.get("http://www.echojs.com/").then(function(response) {
    const $ = cheerio.load(response.data);

    $("articleh2").each(function(i, element) {
      const results = {};

      results.title = $(this)
        .children("a")
        .text();
      results.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArtcile) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    res.send("Scrape completed");
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArtcile) {
      res, json(dbArtcile);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App is running live on: ", PORT + "  🌎!");
});

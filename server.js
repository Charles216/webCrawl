var cheerio = require("cheerio");
var request = require("request");

console.log(`**Headline/Summary/URL/Photo?**`);

request("http://www.chicagotribune.com/news/local/breaking/#", function(
  error,
  response,
  html
) {
  var $ = cheerio.load(html);

  var results = [];

  $("h3.trb_outfit_relatedListTitle").each(function(i, element) {
    var title = $(element).text();
    var link = $(element)
      .children()
      .attr("href");
    //var summary = $("p.trb_outfit_group_list_item_brief").text();

    results.push({
      title: title,
      link: link
      //summary: summary
    });
  });
  console.log(results);
});

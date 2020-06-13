const express = require('express');
const router = express.Router();

router.post('/twitter', (req, res) => {
  const { id } = req.body;
  
  var Twitter = require('twitter');
 
  var client = new Twitter({
    consumer_key: 'hg33qyBwiAdAqTbMjpw2hJval',
    consumer_secret: 'IrAmdPO82hCwqKa1eRS5so698FQLgqqmiV4zDm7MnYwp8nWo74',
    access_token_key: '1045386632759672832-un1zJmXjlz1Mcd3FxrzBWASiaQIfAU',
    access_token_secret: 'XpZNJn23pC85STGssfb6aKZeFuUDMQrIaRHn8T12HKNPi'
  });
   
  var params = {id: id};
  client.get('statuses/show', params, function(error, tweets, response) {
    if (!error) {
      res.send({
        tweets: tweets,
      })
    }
    else
      return res.status(400);
  });
});

router.post('/podcast', (req, res) => {
  const { url, type } = req.body;
  var request = require('request');
  var cheerio = require('cheerio');
  request(url, function(error, response, html) {
    // If the page was found...
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html, {
        xmlMode: true
      });
      var podcast = $('rss').get().length;
      if(podcast === 0) {
        res.send({
          success : false,
        })
      }
      else {
        var img = $('image').find('url').text();
        var title = $('title').eq(0).text();
        var description = $('description').eq(0).text();
        var author = $('itunes\\:author').eq(0).text();
        var items = [];
        if(type === 'soundcloud') {
          $('item').each(function(i, elem) {
            const title = $(this).find('title').text();
            const item_description = $(this).find('description').text();
            const date = $(this).find('pubDate').text();
            const link = $(this).find('link').text();
            items.push([title, item_description, date, link]);
            if(i === 2) return false;
          });
          items.join(', ');
        }
        else {
          $('item').each(function(i, elem) {
            const title = $(this).find('title').text();
            const item_description = $(this).find('description').text();
            const date = $(this).find('pubDate').text();
            const link = $(this).find('enclosure').attr('url');
            items.push([title, item_description, date, link]);
            if(i === 2) return false;
          });
          items.join(', ');
        }
        res.send({
          img:img,
          title:title,
          description:description,
          author:author,
          items:items,
          success : true
        })
      }
    }
    else {
      res.send({
        success : false,
      })
    }
  });
})

router.post('/image', (req, res) => {
  const { url } = req.body;
  var request = require('request');
  var cheerio = require('cheerio');
  request(url, function(error, response, body) {
    // If the page was found...
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);
      const title = $("title").text();
      const img_part = $(".largeview-item-wrapper").html();
      const img_body = cheerio.load(img_part);
      const img_url = img_body("img").attr('src');
      const img = 'https://www.image-story.com' + img_url;
      res.send({
        img:img,
        title:title,
      })
    }
  })
})

router.post('/iframeCheck', (req, res) => {
  const { url } = req.body;
  var request = require('request');
  var cheerio = require('cheerio');
  request(url, function(err, response, html) {
    // If the page was found...
    if (!err && response.statusCode == 200) {

      // Grab the headers
      var headers = response.headers;

      // Grab the x-frame-options header if it exists
      var xFrameOptions = headers['x-frame-options'] || '';

      // Normalize the header to lowercase
      xFrameOptions = xFrameOptions.toLowerCase();

      // Check if it's set to a blocking option
      if ( xFrameOptions === 'sameorigin' || xFrameOptions === 'deny') {
        res.send({
            sBlocked : true
        });
      }
      else {
        const $ = cheerio.load(html);
        const webpageTitle = $("title").text();
        const description = $("meta[name='description']").attr("content");
        const slide = $('ul[class=slides]').html() ? true : false;
        res.send({
          isBlocked : false,
          webpageTitle : webpageTitle,
          description,
          slide
        });
      }
    }
    else {
      res.send({
        isBlocked : true
      });
    }
  })
})

module.exports = router;

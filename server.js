var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var jsdom = require("jsdom");
var fs = require("fs");
var request = require("request");

var jquery = "http://code.jquery.com/jquery.js";
var token = '148205640:AAFwHnekNvg_6TAFUTiDr6f8l5jZXhgKlAo';


function getImage(query, callback){
	jsdom.env('http://images.google.com/search?tbm=isch&q=' + query + '&tbs=itp:photo', [jquery], function (err, window) {
		request(window.$('#res img')[0].src).pipe(fs.createWriteStream('img.jpg')).on('close', callback);
	});
}

var bot = new TelegramBot(process.env.TOKEN, {polling: true});
bot.on('text', function (msg) {
	jsdom.env('http://www.artlebedev.ru/tools/matrix/', [jquery], function (err, window) {
		if(!err){
			var titles = window.$('form[name="matrix"] td[colspan="2"]:not(.plus):not([align="left"]):not(#description)');
			var title = titles.eq(Math.floor(Math.random()*titles.length)).text();
			getImage(title, function(){
				bot.sendPhoto(msg.chat.id, 'img.jpg', {caption: title});
			});
		}
	});
});

http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'no-cache'
  });
  res.end('<p>Telegram bot <a href="http://telegram.me/TopicGeneratorBot">@TopicGeneratorBot</a></p>');
}).listen(process.env.PORT || 8080);


console.log('start server on port ', process.env.PORT || 8080);
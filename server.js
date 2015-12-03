var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var jsdom = require("jsdom");
var fs = require("fs");
var request = require("request");

var jquery = "http://code.jquery.com/jquery.js";


function getImage(query, callback){
	jsdom.env('https://yandex.ru/images/search?text=' + query, [jquery], function (err, window) {
		request(window.$('div.serp-item__preview a')[0].getAttribute('onmousedown').match(/"href":"(.*)"/)[1])
			.pipe(fs.createWriteStream('img.jpg')).on('close', callback);
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
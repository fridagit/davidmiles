var express = require('express');
var mongojs = require('mongojs');
var app = express();
var fs = require('fs');

var path = require('path');
var config = require('./env').config();

var collectionName = config.collection;
var db = mongojs(config.dbUrl, [collectionName]);
var collection = db[collectionName];

//cors middleware
var allowCrossDomain = function (req, res, next) {
	res.header('access-control-allow-origin', '*');
	res.header('access-control-allow-methods', 'get,put,post,delete');
	res.header('access-control-allow-headers', 'content-type');

	next();
};

// expire items
collection.ensureIndex({ "time": 1 }, { expireAfterSeconds: config.expireAfterSeconds });

app.use(allowCrossDomain);
var PUBLIC_DIR = path.join(__dirname, 'client/builds/web/development');

app.use(express.static(PUBLIC_DIR));
app.use(express.bodyParser());

app.get('/', function (req, res) {

	if (req.query) {
		var record = {
			time: new Date().toString(),
			eventkey: req.query.eventkey,
			eventvalue: req.query.eventvalue,
			ua: req.query.ua,
			platform: req.query.platform,
			vendor: req.query.vendor,
			version: req.query.version,
			timeout: req.query.timeout
		};

		if (record.eventkey && record.eventvalue) {
			collection.save(record);
		}
	}
	res.send('done');
});

app.post('/', function (req, res) {
	console.log('post recieved');
	if (req.body) {
		var record = {};
		record.time = new Date().toString();
		record.eventkey = req.body.eventkey;
		record.eventvalue = req.body.eventvalue;
		record.ua = req.body.ua || 'no-set';
		record.platform = req.body.platform || '';
		record.vendor = req.body.vendor || '';
		record.version = req.body.version || '';
		record.timeout = req.body.timeout || false;


		if (record.eventkey && record.eventvalue) {
			collection.save(record);
			console.log('record saved');
		}
		res.writeHead(200);
		res.end();
		return;
	}
	res.writeHead(500);
	res.end();

});

app.post('/data', function (req, res) {
	var startDate = new Date(req.body.fromDate + 'T' + req.body.fromTime);
	var endDate = new Date(req.body.toDate + 'T' + req.body.toTime);

	collection.find({time: {$gte: startDate, $lt: endDate}}, {limit: req.body.limit}, function (err, data) {
		res.json(data);
	});
});

app.get('/*', function (req, res) {
	fs.readFile(path.join(PUBLIC_DIR, 'index.html'), 'utf8', function (err, data) {
		if (!err) {
			res.status(200).send(data);
		} else {
			res.status(500).send(err);
		}
	});

});


app.listen(8888);

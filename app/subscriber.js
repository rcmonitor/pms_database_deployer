/**
 * //@by_rcmonitor@//
 * on 05.03.2015.
 */

var amqp = require('amqp');
var cEventEmitter = require('events').EventEmitter;

var amqpHacks = require('./amqp_hacks.js');
var hpg = require('helpers-global');

var oExchangeParameters = {
	"type": "topic"
	, "autoDelete": false
	, "durable": true
	, "confirm": true
};

var oQueueParameters = {
	"passive": false,
	"durable": false,
	"exclusive": true,
	"autoDelete": false
};

var oDeployer = new cEventEmitter();
//var oDate = new Date();

oDeployer.validEvents = {
	"deployed": "deployed",
	"message": "message"
};

var timeStarted = new Date().getTime();

oDeployer.wait = function(oRabbitProperties){

	amqpConnection = amqp.createConnection(oRabbitProperties);

	amqpConnection.on('ready', function(){

		hpg.log('connection established in ' + hpg.diff(timeStarted));

		amqpConnection.exchange('parser_exchange', oExchangeParameters, function(amqpExchange){

			hpg.log('exchange validated on ' + hpg.diff(timeStarted));

			amqpConnection.queue('parsed_queue', oQueueParameters, function(amqpQueue){

				hpg.log('queue created on ' + hpg.diff(timeStarted) + ' and callback fired');

				amqpQueue.bind('parser_exchange', 'parser.out', function(){

					hpg.log('queue bounded on ' + hpg.diff(timeStarted) + ' waiting for messages');

					var intMsgCount = 0;
					amqpQueue.subscribe(function(msg){
						intMsgCount ++;
						hpg.log(msg.data.toString('utf-8'), 'message #' + intMsgCount);

						oDeployer.emit(oDeployer.validEvents.message, msg.data);
					});
				});

			});

		});

	});

};


module.exports = oDeployer;
/**
 * Created by jack on 05.03.2015.
 */

var oDeployer = require('./app/subscriber');
var path = require('path');

var hpg = require('helpers-global');

var strLogFilePath = path.join(__dirname, 'log', 'messages.log');
var fl = new hpg.fileLogger(strLogFilePath);

$oRabbitProperties = {
	"host": 'localhost'
};

oDeployer.wait($oRabbitProperties);

oDeployer.on(oDeployer.validEvents.message, function(message){
	fl.log(message);
});
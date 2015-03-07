/**
 * Created by jack on 05.03.2015.
 */

oDeployer = require('./app/subscriber');

$oRabbitProperties = {
	"host": 'localhost'
};

oDeployer.wait($oRabbitProperties);
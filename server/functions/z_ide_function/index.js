'use strict';
const Cliq = require('zcatalyst-integ-cliq');

module.exports = async (request, response) => {
	try {
		const handlerResponse = await Cliq.default(request);
		response.end(handlerResponse);
	} catch (err) {
		console.log('Error while executing handler. ', err);
		throw err;
	}
};

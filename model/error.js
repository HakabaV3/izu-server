const Error = {};

Error.pipeErrorRender = function(req, res, err) {
	return res.ng(err.code, {
		error: err.error
	});
};

Error.mongoose = function(code, err) {
	return {
		code: code,
		error: {
			message: err.errmsg
		}
	};
};

Error.invalidParameter = {
	code: 400,
	error: {
		message: 'INVALID_PARAMETER'
	}
};

Error.unauthorized = {
	code: 401,
	error: {
		message: 'Unauthorized'
	}
};

module.exports = Error;
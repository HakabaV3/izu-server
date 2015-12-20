var error = {};

error.pipeErrorRender = function(req, res, err) {
	return res.ng(err.code, {
		error: err.error
	});
}

module.exports = error;
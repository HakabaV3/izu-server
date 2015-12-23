var _ = {},
	CronJob = require('cron').CronJob,
	Auth = require('../model/auth.js');

_.setup = function() {
	_cCleanupExpiredAuth();
};

function _cCleanupExpiredAuth() {
	var job = new CronJob({
		cronTime: '00 00 03 * * *',
		onTick: function() {
			console.log('【Cron】clean up expired Auth');
			Auth.removeExpiredObject(parseInt(Date.now() / 1000));
		},
		start: false,
		timeZone: 'Asia/Tokyo'
	});
	job.start()
}

module.exports = _;
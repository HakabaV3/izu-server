const config = {
	ENV: process.env.ENV || 'development-local',
	SERVER_PROTOCOL: 'http',
};

switch (config.ENV) {
	case 'development-sakura':
		Object.assign(config, {
			DB_HOST: 'localhost',
			DB_PORT: 27017,
			DB_NAME: 'izu-server-dev',
			EXPRESS_PORT: 3000,
			SERVER_HOST: 'izu.hakaba.xyz'
		});
		break;
	case 'development-local':
		Object.assign(config, {
			DB_HOST: 'localhost',
			DB_PORT: 27017,
			DB_NAME: 'izu-server-dev',
			EXPRESS_PORT: 3000,
			SERVER_HOST: 'localhost:3000'
		});
		break;

	case 'staging':
		Object.assign(config, {
			DB_HOST: 'localhost',
			DB_PORT: 27018,
			DB_NAME: 'izu-server-staging',
			EXPRESS_PORT: 3001,
			SERVER_HOST: 'izu-staging.hakaba.xyz'
		});
		break;

	case 'production':
	default:
		console.error("Unknown ENV");
		process.exit();
}

console.log(`Welcome to izu-server! Environment is ${config.ENV} now!!`);

module.exports = config;
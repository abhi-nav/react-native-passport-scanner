module.exports = function (api) {
	api.cache(false);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module:react-native-dotenv",
				{
					moduleName: "@env",
					path: ".env",
					blacklist: null,
					whitelist: null,
					safe: false,
					allowUndefined: true,
				},
			],
			// "react-native-reanimated/plugin",
		],
	};
};

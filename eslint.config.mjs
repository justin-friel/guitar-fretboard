import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: globals.browser
		}
	},
	prettierRecommended
];

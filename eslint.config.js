import eslintPluginSvelte from 'eslint-plugin-svelte';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import svelteParser from 'svelte-eslint-parser';

export default tseslint.config(
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'test-results/',
			'playwright-report/',
			'test-visual.cjs'
		]
	},
	{
		files: ['**/*.{ts,js}'],
		extends: [...tseslint.configs.recommended]
	},
	{
		files: ['**/*.svelte'],
		plugins: { svelte: eslintPluginSvelte },
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser
			}
		},
		rules: {
			...eslintPluginSvelte.configs.recommended.rules,
			'svelte/no-at-html-tags': 'warn',
			'svelte/require-each-key': 'warn',
			'svelte/no-dupe-style-properties': 'warn',
			'svelte/no-navigation-without-resolve': 'warn'
		}
	},
	{
		files: ['**/*.{ts,js}'],
		rules: {
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-require-imports': 'warn'
		}
	},
	prettierConfig
);

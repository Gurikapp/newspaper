
import root from '../root.svelte';
import { set_building, set_prerendering } from '$app/env/internal';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';
import error from '../shared/error-template.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	service_worker_options: undefined,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"ru\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <link rel=\"icon\" href=\"" + assets + "/favicon.png\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    " + head + "\n    <style>\n      @font-face {\n        font-family: \"Cheshirskiy Cat\";\n        src: url(\"/fonts/Cheshirskiy Cat.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"Kot Leopold\";\n        src: url(\"/fonts/Kot Leopold.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"Matreshka\";\n        src: url(\"/fonts/Matreshka.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"CoquetteC\";\n        src: url(\"/fonts/CoquetteC.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"Neucha\";\n        src: url(\"/fonts/Cheshirskiy Cat.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"Old Comedy\";\n        src: url(\"/fonts/Old Comedy.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"Realize My Passion\";\n        src: url(\"/fonts/Realize My Passion.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n\n      @font-face {\n        font-family: \"Samba\";\n        src: url(\"/fonts/Samba.ttf\") format(\"truetype\");\n        font-weight: 400;\n        font-style: normal;\n        font-display: swap;\n      }\n    </style>\n  </head>\n  <body data-sveltekit-preload-data=\"hover\">\n    <div style=\"display: contents\">" + body + "</div>\n  </body>\n</html>\n",
		error
	},
	version_hash: "ngtp2y"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };

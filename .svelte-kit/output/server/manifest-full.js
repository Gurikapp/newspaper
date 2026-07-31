export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["fonts/Cheshirskiy Cat.ttf","fonts/CoquetteC.ttf","fonts/Kot Leopold.ttf","fonts/Matreshka.ttf","fonts/Neucha.ttf","fonts/Old Comedy.ttf","fonts/Realize My Passion.ttf","fonts/Samba.ttf"]),
	mimeTypes: {".ttf":"font/ttf"},
	_: {
		client: {start:"_app/immutable/entry/start.BnCyqy_d.js",app:"_app/immutable/entry/app.DlGAjbLb.js",imports:["_app/immutable/entry/start.BnCyqy_d.js","_app/immutable/chunks/BXK_Vm_B.js","_app/immutable/chunks/BukE7bu8.js","_app/immutable/entry/app.DlGAjbLb.js","_app/immutable/chunks/BukE7bu8.js","_app/immutable/chunks/VYYGQr0M.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin/login",
				pattern: /^\/admin\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

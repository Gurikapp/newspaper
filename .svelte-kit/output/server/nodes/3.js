

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.DdoItnWP.js","_app/immutable/chunks/BukE7bu8.js","_app/immutable/chunks/VYYGQr0M.js"];
export const stylesheets = [];
export const fonts = [];

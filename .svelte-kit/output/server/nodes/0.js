import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BHWJ9__0.js","_app/immutable/chunks/BukE7bu8.js","_app/immutable/chunks/VYYGQr0M.js"];
export const stylesheets = ["_app/immutable/assets/0.UYjZsC43.css"];
export const fonts = [];

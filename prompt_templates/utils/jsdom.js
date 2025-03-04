import {JSDOM} from 'jsdom';
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`); 
export const document = dom.window.document;

import { Ajax } from './modules/ajax.js';

let ajax = new Ajax("nick", "color", ["red", "blue", "green", "yellow"], {}, false, new Date(), "id", 0);
ajax.init();

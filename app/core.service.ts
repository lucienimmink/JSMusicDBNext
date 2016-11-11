import { musicdbcore } from './org/arielext/musicdb/core';

export class CoreService {
    protected core: musicdbcore = null;
    constructor() {
        this.core = new musicdbcore();
    }
    getCore(): musicdbcore {
        return this.core;
    }
}
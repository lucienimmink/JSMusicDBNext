import { musicdbcore } from './../org/arielext/musicdb/core';

export class CoreService {
  protected core: musicdbcore;

  constructor() {
    this.core = new musicdbcore();
  }
   public getCore(): musicdbcore {
     return this.core;
   }

}

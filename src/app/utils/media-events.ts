import { EventManager } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class MediaEvents {
    manager: EventManager;

    supports(eventName: string): boolean {
        let ret = false;
        if (eventName.indexOf('mdb') === 0) {
            ret = true;
        }
        return ret;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): any {
        const zone = this.manager.getZone();

        // Entering back into angular to trigger changeDetection
        const outsideHandler = (event: any) => {
            zone.run(() => handler(event));
        };

        // Executed outside of angular so that change detection is not constantly triggered.
        const addAndRemoveHostListenersForOutsideEvents = () => {
            this.manager.addEventListener(element, 'external.' + eventName, outsideHandler);
        };

        return this.manager.getZone().runOutsideAngular(addAndRemoveHostListenersForOutsideEvents);
    }

    addGlobalEventListener(target: string, eventName: string, handler: Function): any {
        const zone = this.manager.getZone();
        const outsideHandler = (event: any) => zone.run(() => handler(event));

        return this.manager.getZone().runOutsideAngular(() => {
            this.manager.addGlobalEventListener(target, eventName, outsideHandler);
        });
    }
}

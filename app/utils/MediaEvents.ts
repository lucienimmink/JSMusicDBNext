import {EventManagerPlugin, EventManager} from '@angular/platform-browser/src/dom/events/event_manager';
import {Injectable} from '@angular/core';

@Injectable()
export class MediaEvents extends EventManagerPlugin {
    manager: EventManager;

    supports(eventName: string):boolean {
        var ret = false;
        if (eventName.indexOf('mbd') === 0) {
            ret = true;
        }
        // console.log('supports event?', eventName, ret);
        return ret;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
        console.log('adding normal eventlistener for', element, eventName, handler);
        let zone = this.manager.getZone();

        // Entering back into angular to trigger changeDetection
        var outsideHandler = (event: any) => {
            zone.run(() => handler(event));
        };

        // Executed outside of angular so that change detection is not constantly triggered.
        var addAndRemoveHostListenersForOutsideEvents = () => {
            this.manager.addEventListener(element, 'mdb.prev', outsideHandler);
        }

        return this.manager.getZone().runOutsideAngular(addAndRemoveHostListenersForOutsideEvents);
    }

    addGlobalEventListener(target: string, eventName: string, handler: Function): Function {
        console.log('adding global eventlistener for', target, eventName, handler);
        var zone = this.manager.getZone();
        var outsideHandler = (event: any) => zone.run(() => handler(event));

        return this.manager.getZone().runOutsideAngular(() => {
            this.manager.addGlobalEventListener(target, 'mdb.prev', outsideHandler);
        });
    }
}
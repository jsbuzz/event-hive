export class EventGateway {
    trigger(hiveEvent) {
        return new Promise(
            resolve => resolve(this.triggerSync(hiveEvent))
        );
    }

    triggerSync(hiveEvent) {
        return this.element.dispatchEvent(hiveEvent.event());
    }

    listen(...listeners) {
        for(let i=0; i < listeners.length; i+=2) {
            this.addEventListener(listeners[i], listeners[i+1]);
        }
    }

    addEventListener(hiveEvent, eventHandler) {
        let realHandler;
        const events = [];
        if(typeof hiveEvent == 'string') {
            realHandler = eventHandler;
            hiveEvent.trim().split(/\s+/).forEach(strEvent => {
                events.push(strEvent);
                this.element.addEventListener(
                    strEvent,
                    realHandler
                );
            })
        } else if(!(hiveEvent instanceof Event) && hiveEvent.namespace instanceof EventGateway) {
            return hiveEvent.namespace.addEventListener(
                hiveEvent.event,
                eventHandler
            );
        } else {
            realHandler = event => eventHandler(event.detail);
            this.element.addEventListener(
                hiveEvent.EventName,
                realHandler
            );
            events.push(hiveEvent.EventName);
        }
        return {
            callback: realHandler,
            events: events,
            element: this.element,
        };
    }

    static forElement(element, component) {
        let instance = new this();

        instance.name = component && component.constructor.name;
        instance.element = element;

        return instance;
    }
}

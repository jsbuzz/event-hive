import ReadOnly from './read-only';
import { Optional, Mixed } from './domain';

let eventId = 0;

export class Event {
    constructor() {
        this.name = this.constructor.EventName;
    }

    event() {
        if(!this.originalEvent) {
            this.originalEvent = new CustomEvent(this.name, {
                detail     : this,
                bubbles    : !this.constructor._cancelBubble,
                cancelable : true
            });
        }
        return this.originalEvent;
    }

    stopPropagation() {
        this.originalEvent && this.originalEvent.stopPropagation();
    }

    preventDefault() {
        this.originalEvent && this.originalEvent.preventDefault();
    }

    static bubbles(bubbles) {
        this._cancelBubble = !bubbles;
        return this;
    }

    static alias(name) {
        this.EventName = name;
        return this;
    }

    static on(namespace) {
        return {
            namespace,
            event: this,
        };
    }
}

export function basicEvent(name) {
    return (
        class extends Event {}
    ).alias(name || `Event${++eventId}`);
};

export function defineEvent(EventType, name) {
    return (
        class extends EventType {}
    ).alias(name || `Event${++eventId}`);
};

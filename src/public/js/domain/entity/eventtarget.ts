module Prgr {
    export class EventTarget {
        private events = {};

        constructor(private thisArg: any) {
        }

        addEventListener(type:string, listener:Function) {
            if (this.events[type] == null)
                this.events[type] = [];
            this.events[type].push(listener);
        }

        removeEventListener(type: string, listener: Function) {
            if (this.events[type] == null)
                return;
            remove(this.events[type], listener);
        }

        dispatchEvent(type: string) {
            var list: Function[] = this.events[type];
            list.forEach(x => {
                x.call(this.thisArg);
            });
        }
    }
}

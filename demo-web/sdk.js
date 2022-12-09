class SDK {
    constructor(global) {
        this.global = global;
        this.callbacks = {};
        this.mobile = global.ReactNativeWebView;
        global.addEventListener("message", message => {
            try {
                const obj = JSON.parse(message.data);
                const {event, payload} = obj;
                if (this.callbacks[event]) {
                    this.callbacks[event].forEach(fn => {
                        fn(payload);
                    })
                }
            }
            catch (e) {}
            
        });
    }
    sendMessage() {
        this.mobile.postMessage('Data from WebView / Website');
    }

    emit(event, data) {
        const json = JSON.stringify({
            event,
            payload: data
        })
        this.mobile.postMessage(json);
    }

    on(event, cb) {
        this.callbacks[event] = this.callbacks[event] || [];
        this.callbacks[event].push(cb);
    }
}

const sdk = new SDK(window);

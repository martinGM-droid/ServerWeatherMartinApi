import { error } from 'console';
import fs from 'fs/promises';
const statusCodeList = {
    success: {
        200: "OK",
        201: "Created",
        202: "Accepted",
        204: "No Content",
        301: "Moved Permanently",
        302: "Found",
        304: "Not Modified",
    },
    error: {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        408: "Request Timeout",
        409: "Conflict",
        413: "Payload Too Large",
        415: "Unsupported Media Type",
        429: "Too Many Requests",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
    }
};
const ErrorLogStore = {
    logArchive: {
        filePath: 'Data saved in',
        responseText: 'SERVER RESPONSE'
    },
    errorVault: {
        invalidTypeError: 'Data error: the processed data type does not match the documentation.',
        classMethodError: 'ApiManager--error',
        responseError: 'SERVER ERROR'
    }
};
//? >>>>>>>>>>
//* Manager class for reusable use, created to quickly work with multiple API services <<<develop methods for generalized use>>>
//? >>>>>>>>>>
export class ApiManager {
    state = {}; //!  Use state to ensure correct operation of methods in case of errors in pillar methods.
    url;
    dataMediator;
    constructor(url, dataMediator) {
        this.url = url;
        this.dataMediator = dataMediator;
    }
    async getRequest() {
        try {
            await this.#fetch(this.url);
            return this;
        }
        catch (error) {
            this.#print(ErrorLogStore.errorVault.classMethodError, error, '>>>', 'error');
            return this;
        }
    }
    ;
    async createFile(path) {
        const trigger = this.state.fetch.trigger;
        if (trigger) {
            await fs.writeFile(path, JSON.stringify(this.dataMediator, null, 2), 'utf-8');
            this.#print(ErrorLogStore.logArchive.filePath, path, ':', 'log');
        }
        else {
            this.#print(ErrorLogStore.errorVault.classMethodError, this.state.fetch.error, '>>>', 'error');
        }
    }
    async #fetch(url) {
        const res = await fetch(url);
        // console.log(res.status, 'status')
        // console.log(res.statusText, 'statusText')
        await this.#manageState(res.status, 'fetch');
        if (!res.ok) {
            await this.#manageState(res.status, 'fetch');
            throw new Error(`${ErrorLogStore.errorVault.responseError}: ${res.status}`);
        }
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [data];
        this.dataMediator.splice(0, this.dataMediator.length, ...arr);
        // this.#print(ErrorLogStore.logArchive.responseText, data, ':')
    }
    async #manageState(resOrError, keyName) {
        let stateTracker;
        const processObject = async (obj) => {
            if (typeof resOrError === 'number') {
                if (obj.success.hasOwnProperty(resOrError)) {
                    // console.log(obj.success[resOrError])
                    stateTracker = true;
                    if (!this.state[keyName]) {
                        this.state[keyName] = {
                            trigger: true,
                            error: null
                        };
                    }
                    this.state[keyName].trigger = stateTracker;
                    this.state[keyName].error = null;
                }
                if (obj.error.hasOwnProperty(resOrError)) {
                    // console.log(obj.error[resOrError])
                    stateTracker = false;
                    if (!this.state[keyName]) {
                        this.state[keyName] = {
                            trigger: false,
                            error: null
                        };
                    }
                    this.state[keyName].trigger = stateTracker;
                    this.state[keyName].error = obj.error[resOrError];
                }
            }
            else {
                stateTracker = false;
                if (!this.state[keyName]) {
                    this.state[keyName] = {
                        trigger: false,
                        error: null
                    };
                }
                this.state[keyName].trigger = stateTracker;
                this.state[keyName].error = ErrorLogStore.errorVault.invalidTypeError;
                this.#print(ErrorLogStore.errorVault.invalidTypeError, resOrError, '<<<>>>', 'error');
            }
        };
        await processObject(statusCodeList);
    }
    #print(message, details, marks, typelog) {
        //! Built-in logging for strict output of information depending on its type and description templates.
        if (typelog === 'log') {
            console.log(message, marks, details);
        }
        if (typelog === 'error') {
            error(message, marks, details);
        }
    }
}

import { error } from 'console';
import fs from 'fs/promises';
import { ErrorLogStore, DebugError } from './debug.js';
const logArch = ErrorLogStore.logArchive;
const errVault = ErrorLogStore.errorVault;
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
//? >>>>>>>>>>>>>>>>>>>>>>>>>>
//! <<<<<<<<<<<<<<<<<<<<<<<<<<
//* Manager class for reusable use, 
//* created to quickly work with multiple API services,
//* <<<develop methods for generalized use>>>
//! <<<<<<<<<<<<<<<<<<<<<<<<<<
//? >>>>>>>>>>>>>>>>>>>>>>>>>>>
export class ApiManager {
    state = {}; //!  Use state to ensure correct operation of methods in case of errors in pillar methods.
    instances = [];
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
            if (error instanceof DebugError) {
                this.#print(errVault.classMethodError, error.message, '>>>', 'error');
                DebugError.throw(errVault.classMethodError, error.statusCode);
            }
            else {
                throw error; //* Just in case, so that TS knows all code paths are covered.
            }
        }
        finally {
        }
    }
    ;
    async multiRequests(url) {
        const fabrycClass = async () => {
            if (Array.isArray(url)) {
                const count = url.length;
                const classArr = [];
                for (let i = 1; i < count; i++) {
                    const DynamicClass = new ApiManager(url[i], this.dataMediator);
                    await classArr.push(DynamicClass);
                    await DynamicClass.getRequest();
                    this.instances.push(DynamicClass);
                }
            }
        };
        await fabrycClass();
    }
    async createFile(path) {
        const trigger = this.state.fetch.trigger;
        if (trigger) {
            await fs.writeFile(path, JSON.stringify(this.dataMediator, null, 2), 'utf-8');
            this.#print(logArch.filePath, path, ':', 'log');
        }
        else {
            this.#print(errVault.classMethodError, this.state.fetch.error, '>>>', 'error');
        }
    }
    async multiCreateFile(pathPrefix) {
        for (let i = 0; i < this.instances.length; i++) {
            await this.instances[i].createFile(`${pathPrefix}${i + 1}.json`);
        }
    }
    async #fetch(url) {
        const res = await fetch(url);
        await this.#manageState(res.status, 'fetch');
        if (!res.ok) {
            await this.#manageState(res.status, 'fetch');
            this.#print(`${errVault.responseError}: ${res.status}`, '', '>>>', 'error');
            DebugError.throw(`${errVault.responseError}: ${res.status}`, res.status);
        }
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [data];
        this.dataMediator.push(...arr);
        // this.dataMediator.splice(0, this.dataMediator.length, ...arr);
    }
    async #manageState(resOrError, keyName) {
        let stateTracker;
        const processObject = async (obj) => {
            if (typeof resOrError === 'number') { //? checking the type
                if (obj.success.hasOwnProperty(resOrError)) { //* we check if there is a state, if not,
                    if (!this.state[keyName]) { //* it creates it based on the conditions
                        this.state[keyName] = {
                            trigger: true,
                            error: null
                        };
                    }
                    stateTracker = true;
                    this.state[keyName].trigger = stateTracker;
                    this.state[keyName].error = null;
                }
                if (obj.error.hasOwnProperty(resOrError)) { //* we check if there is a state, if not,
                    if (!this.state[keyName]) { //* it creates it based on the conditions
                        this.state[keyName] = {
                            trigger: false,
                            error: null
                        };
                    }
                    stateTracker = false;
                    this.state[keyName].trigger = stateTracker;
                    this.state[keyName].error = obj.error[resOrError];
                }
            }
            else { //? if not that tupe
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

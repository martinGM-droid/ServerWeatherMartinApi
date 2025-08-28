import { error, log } from 'console';
import fs from 'fs/promises';
import { IErrorLogStore, ErrorLogStore, DebugError } from './debug.js';
import { TimeDetector } from './debug.js';
const logArch = ErrorLogStore.logArchive
const errVault = ErrorLogStore.errorVault

// interface IStatusCodeList {
//   success: {
//     200: string;
//     201: string;
//     202: string;
//     204: string;
//     301: string;
//     302: string;
//     304: string;
//   };
//   error: {
//     400: string;
//     401: string;
//     403: string;
//     404: string;
//     405: string;
//     408: string;
//     409: string;
//     413: string;
//     415: string;
//     429: string;
//     500: string;
//     501: string;
//     502: string;
//     503: string;
//     504: string;
//   };
// }

interface IStatusCodeList { //* interface for status list
  success: {
    [key: number]: string;
  };
  error: {
    [key: number]: string;
  };
}

const statusCodeList: IStatusCodeList = {  //* status list
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
}


type ErrorLogContext = { //! type for dynamic use
  [KEY in keyof IErrorLogStore]: IErrorLogStore[KEY][keyof IErrorLogStore[KEY]];
}[keyof IErrorLogStore];

type ErrorContext = keyof IErrorLogStore['errorVault'];

interface State {  //* interface for Class state
  [key: string]: {
    trigger: boolean;
    error: string | null;
  };
}



type MyltUrl = string[] | string

// export interface ApiResponse<T> {
//   data?: T[];
//   debugError?: DebugError;
//   error?: unknown;
// }

export type ApiResponse<T> =
  | { data: [T] }
  | { debugError: [DebugError] }
  | { error: [unknown] };


export type DistributorResponse<T> =
  {
    data: T[] | [];
    debugError: DebugError[] | [] | null;
    error: unknown[] | [] | null
  }

type PromiseResponse<T> = Promise<DistributorResponse<T>>;

//? >>>>>>>>>>>>>>>>>>>>>>>>>>
//! <<<<<<<<<<<<<<<<<<<<<<<<<<
//* Manager class for reusable use, 
//* created to quickly work with multiple API services,
//* <<<develop methods for generalized use>>>
//! <<<<<<<<<<<<<<<<<<<<<<<<<<
//? >>>>>>>>>>>>>>>>>>>>>>>>>>
export class ApiManager {
  url: string
  constructor(url: string,) {
    this.url = url
  }

  async getRequest<T>(queryUrl?: MyltUrl): PromiseResponse<T> {
    if (queryUrl === undefined) {
      return this.#distributor(await this.#handleFetch<T>(this.url));
    }
    if (Array.isArray(queryUrl)) {
      return this.#distributor( await Promise.all(queryUrl.map(q => this.#handleFetch<T>(this.#joinStrings(this.url, q)))));
    }
    return this.#distributor( await this.#handleFetch<T>(this.#joinStrings(this.url, queryUrl)));
  }

  #joinStrings(api: string, query: string) {
    return api.trimEnd() + query.trimStart();
  }

  #distributor<T>(res: ApiResponse<T> | ApiResponse<T>[]): DistributorResponse<T> {
    if (!Array.isArray(res)) {
      if ("data" in res) {
        return { data: res.data, debugError: null, error: null }
      } else if ("debugError" in res) {
        return { data: [], debugError: res.debugError, error: null }
      } else {
        return { data: [], debugError: null, error: res.error }
      }
    } else {
      const result = {
        data: [] as T[],
        debugError: [] as DebugError[] ,
        error: [] as unknown[]
      };
      res.forEach(q => {
        if ("data" in q) {
          result.data.push(q.data[0])
        } if ("debugError" in q) {
          result.debugError.push(q.debugError[0])
        } if ("error" in q) {
          result.error.push(q.error[0])
        }
      })
      return result
    }
  }

  async #handleFetch<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const data = await this.#fetch<T>(url);
      return { data: [data] } // оборачиваем результат в поле data
    } catch (error) {
      if (error instanceof DebugError) {
        this.#print(errVault.classMethodError, error.message, '>Fetch>', 'error');
        const debugError = DebugError.return(`${errVault.classMethodError} >>> ${error.message}`, error.statusCode, error.name);
        return { debugError: [debugError] }; // строго [DebugError]
      } else {
        return { error: [error] };
      }
    }
  }

  async #fetch<T>(url: string): Promise<T> { //* Sends a request to the URL (API).
    const res = await fetch(url);
    const status = res.status
    const statusCodeInfo = statusCodeList.error[404]
    if (!res.ok) DebugError.throw(`${errVault.responseError}: ${status} --- ${statusCodeInfo}`, res.status, "FetchFailedErro")
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  }

  #print<DETAILS>(message: ErrorLogContext, details: DETAILS, marks: string, typelog: 'log' | 'error') {
    //! Built-in logging for strict output of information depending on its type and description templates.
    if (typelog === 'log') {
      console.log(message, marks, details);
    }
    if (typelog === 'error') {
      error(message, marks, details);
    }
  }
}



export class File {

  static async create(path: string, dataMediator: unknown) { //! Creates a file with data based on the state.
    await fs.writeFile(path, JSON.stringify(dataMediator, null, 2), 'utf-8');
    this.#print(logArch.filePath, path, ':', 'log')

  }

  static #print<DETAILS>(message: ErrorLogContext, details: DETAILS, marks: string, typelog: 'log' | 'error') {
    //! Built-in logging for strict output of information depending on its type and description templates.
    if (typelog === 'log') {
      console.log(message, marks, details);
    }
    if (typelog === 'error') {
      error(message, marks, details);
    }
  }
}


// async #fetch(url: string) { //* Sends a request to the URL (API).
//   const res = await fetch(url);
//   await this.#manageState(res.status, 'fetch')
//   if (!res.ok) {
//     await this.#manageState(res.status, 'fetch')
//     this.#print(`${errVault.responseError}: ${res.status}`, '', '>>>', 'error')
//     DebugError.throw(`${errVault.responseError}: ${res.status}`, res.status)
//   }
//   const data = await res.json();
//   const arr = Array.isArray(data) ? data : [data];
//   this.dataMediator.push(...arr);
//   // this.dataMediator.splice(0, this.dataMediator.length, ...arr);
// }


// async multiRequests(url: MyltUrl) {
//   console.log('Mult')
//   const fabrycClass = async () => {
//     if (Array.isArray(url)) {
//       const count = url.length
//       const classArr = []
//       for (let i = 1; i < count; i++) {
//         const DynamicClass = new ApiManager(url[i], this.dataMediator)
//         await classArr.push(DynamicClass)
//         console.log('Get-Mult')
//         await DynamicClass.getRequest()
//         this.instances.push(DynamicClass);
//       }
//     }
//   }
//   await fabrycClass();
// }



// async multiCreateFile(pathPrefix: string) {
//   for (let i = 0; i < this.instances.length; i++) {
//     await this.instances[i].createFile(`${pathPrefix}${i + 1}.json`);
//   }
// }
// async  #manageState(resOrError: number | boolean, keyName: string) { //* Sets the state based on the response.
//   let stateTracker!: boolean
//   const processObject = async (obj: IStatusCodeList) => {
//     if (typeof resOrError === 'number') {//? checking the type
//       if (obj.success.hasOwnProperty(resOrError)) {//* we check if there is a state, if not,
//         if (!this.state[keyName]) { //* it creates it based on the conditions
//           this.state[keyName] = {
//             trigger: true,
//             error: null
//           };
//         }
//         stateTracker = true
//         this.state[keyName].trigger = stateTracker;
//         this.state[keyName].error = null
//       }
//       if (obj.error.hasOwnProperty(resOrError)) {//* we check if there is a state, if not,
//         if (!this.state[keyName]) {//* it creates it based on the conditions
//           this.state[keyName] = {
//             trigger: false,
//             error: null
//           };
//         }
//         stateTracker = false
//         this.state[keyName].trigger = stateTracker;
//         this.state[keyName].error = obj.error[resOrError]
//       }
//     } else { //? if not that tupe
//       stateTracker = false
//       if (!this.state[keyName]) {
//         this.state[keyName] = {
//           trigger: false,
//           error: null
//         };
//       }
//       this.state[keyName].trigger = stateTracker;
//       this.state[keyName].error = ErrorLogStore.errorVault.invalidTypeError
//       this.#print(ErrorLogStore.errorVault.invalidTypeError, resOrError, '<<<>>>', 'error')
//     }
//   }
//   await processObject(statusCodeList)
// }

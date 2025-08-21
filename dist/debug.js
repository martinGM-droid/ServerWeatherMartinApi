export async function TestPost(Data, Port, Endpoint) {
    try {
        const response = await fetch(`http://localhost:${Port}/${Endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Data)
        });
        const data = await response.json();
        return data; // возвращаем ответ от сервера
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
;
;
export class TimeDetector {
    result;
    startCash = 0;
    endCash = 0;
    name;
    constructor(name) {
        this.name = name;
        this.result = { name: this.name, time: 0 };
    }
    start() {
        this.startCash = performance.now();
    }
    end() {
        this.endCash = performance.now();
        this.result.time = this.endCash - this.startCash;
    }
    getResult() {
        const time = this.result.time;
        const tascName = this.name;
        const tineParts = this.#formatTime(time);
        const timeObject = { tascName: tascName, taskSpeed: tineParts };
        return timeObject;
    }
    #formatTime(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 100);
        if (hours > 0) {
            return { hours, minutes, seconds, milliseconds };
        }
        else if (minutes > 0) {
            return { minutes, seconds, milliseconds };
        }
        else if (seconds > 0) {
            return { seconds, milliseconds };
        }
        else {
            return { milliseconds };
        }
    }
}
;
class DataTimeManager {
    result;
    repository;
    constructor(result) {
        this.result = result;
        this.repository = [];
    }
    static ranker(tiSpRe, rank) {
        const rankResult = { ...tiSpRe, rank: rank };
        return rankResult;
    }
    mergeData(spReRa) {
        this.repository.push(...Object.values(spReRa));
        return this.repository;
    }
    fileCreate() {
    }
}
export const ErrorLogStore = {
    logArchive: {
        filePath: 'Data saved in',
        responseText: 'SERVER RESPONSE',
        timerText: 'Elapsed time'
    },
    errorVault: {
        invalidTypeError: 'Data error: the processed data type does not match the documentation.',
        classMethodError: 'ApiManager--error',
        responseError: 'SERVER ERROR'
    }
};
export class DebugError extends Error {
    statusCode;
    constructor(message, statusCode = 500, nameError = "CustomError") {
        super(message);
        this.name = nameError;
        this.statusCode = statusCode;
    }
    static throw(message, statusCode, nameError) {
        throw new DebugError(message, statusCode, nameError);
    }
}
export class SavingSystemData {
    constructor() {
    }
}

import fs from 'fs/promises';

export async function TestPost(Data: unknown, Port: number, Endpoint: string) {
  try {
    const response = await fetch(`http://localhost:${Port}/${Endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Data)
    });
    const data = await response.json();
    return data; // возвращаем ответ от сервера
  } catch (error) {
    console.error(error);
    return null;
  }
}


// type TimerState = "paused" | "running";
// export class Timer {
//   private state: TimerState;
//   private delay: number;
//   private value: number; // миллисекунды
//   private interval: NodeJS.Timeout | null;

//   constructor(delay: number = 100) {
//     this.state = "paused";
//     this.delay = delay;
//     this.value = 0;
//     this.interval = null;
//   }

//   private formatTime(ms: number): string {
//     const hours = Math.floor(ms / 3600000);
//     const minutes = Math.floor((ms % 3600000) / 60000);
//     const seconds = Math.floor((ms % 60000) / 1000);
//     const ds = Math.floor((ms % 1000) / 100);

//     return (
//       String(hours).padStart(2, "0") + ":" +
//       String(minutes).padStart(2, "0") + ":" +
//       String(seconds).padStart(2, "0") + "." +
//       ds
//     );
//   }

//   private update(): void {
//     if (this.state === "running") {
//       this.value += this.delay;
//     }
//   }

//   public start(): void {
//     if (this.state === "paused") {
//       this.state = "running";
//       this.interval = setInterval(() => this.update(), this.delay);
//     }
//   }

//   public stop(): void {
//     if (this.state === "running") {
//       this.state = "paused";
//       if (this.interval) {
//         clearInterval(this.interval);
//         this.interval = null;
//       }
//     }
//   }

//   public reset(): void {
//     this.stop();
//     this.value = 0;
//   }

//   public getTime(): number {
//     return this.value;
//   }

//   public getFormattedTime(): string {
//     return this.formatTime(this.value);
//   }
// }

interface Result { name: string, time: number };

type TimeParts =
  | { hours: number; minutes: number; seconds: number; milliseconds: number }
  | { minutes: number; seconds: number; milliseconds: number; hours?: undefined }
  | { seconds: number; milliseconds: number; hours?: undefined; minutes?: undefined }
  | { milliseconds: number; hours?: undefined; minutes?: undefined; seconds?: undefined };

interface TaskSpeedRepo { tascName: string, taskSpeed: TimeParts };


export class TimeDetector {
  result: Result
  startCash: number = 0
  endCash: number = 0
  name: string
  constructor(name: string) {
    this.name = name
    this.result = { name: this.name, time: 0 }
  }
  start() {
    this.startCash = performance.now()
  }
  end() {
    this.endCash = performance.now()
    this.result.time = this.endCash - this.startCash
  }

  getResult() {
    const time = this.result.time
    const tascName = this.name
    const tineParts: TimeParts = this.#formatTime(time)
    const timeObject: TaskSpeedRepo = { tascName: tascName, taskSpeed: tineParts }
    return timeObject
  }

  #formatTime(ms: number): TimeParts {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    if (hours > 0) {
      return { hours, minutes, seconds, milliseconds };
    } else if (minutes > 0) {
      return { minutes, seconds, milliseconds };
    } else if (seconds > 0) {
      return { seconds, milliseconds };
    } else {
      return { milliseconds };
    }
  }

}
type rank = 'machine' | 'tool' | 'details';
interface SpeedRepoRank extends TaskSpeedRepo {
  rank: rank
};
type SpeedRepoArray = SpeedRepoRank[];

class DataTimeManager {
  result: TaskSpeedRepo
  repository: SpeedRepoArray
  constructor(result: TaskSpeedRepo) {
    this.result = result
    this.repository = []
  }

  static ranker(tiSpRe: TaskSpeedRepo, rank: rank) {
    const rankResult: SpeedRepoRank = { ...tiSpRe, rank: rank }
    return rankResult
  }

  mergeData(spReRa: SpeedRepoRank) {
    this.repository.push(spReRa)
    return this.repository
  }
  // mergeData(spReRa: SpeedRepoRank) {
  //   this.repository.push(...Object.values(spReRa))
  //   return this.repository
  // }
  
  fileCreate() {

  }
}

export interface IErrorLogStore {   //* interface for logs or error
  logArchive: {
    filePath: string,
    responseText: string,
    timerText: string
  },
  errorVault: {
    invalidTypeError: string,
    classMethodError: string,
    responseError: string
  }
}

export const ErrorLogStore: IErrorLogStore = { //* add if necessary logs or error
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
}

export class DebugError extends Error { 
  statusCode: number; //* Additional field to store HTTP status codes (e.g., 404, 500)

  constructor(
    message: string, 
    statusCode: number = 500, //! Default to internal server error
    nameError: string = "CustomError" //* Custom name for better error identification
  ) {
    super(message); //! Call the parent Error constructor
    this.name = nameError; //* Set custom error name
    this.statusCode = statusCode; //* Save the HTTP status code
  }

  static return(
    message: string, 
    statusCode?: number, 
    nameError?: string
  ){
   return new DebugError(message, statusCode, nameError);
  }

  static throw(
    message: string, 
    statusCode?: number, 
    nameError?: string
  ): never {
    //* Static method to throw this error without manually creating an instance
    throw new DebugError(message, statusCode, nameError);
  }
}



export class SavingSystemData {//? test ErThrow then develop this class martin
  constructor() {

  }
}



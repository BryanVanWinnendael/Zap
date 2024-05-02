export interface Result {
  [disk: string]: string[]
}

export interface History {
  [query: string]: Result
}

export interface Info {
  [drive: string]: number;
}
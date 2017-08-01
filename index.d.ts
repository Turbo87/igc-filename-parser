export interface IGCFilenameData {
    callsign: string | null;
    date: string;
    manufacturer: string | null;
    loggerId: string | null;
    numFlight: number | null;
}

declare function parse(filename: string, maxYear?: number): IGCFilenameData | null;

export = parse;

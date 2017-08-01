declare namespace parse {
    export interface IGCFilenameData {
        callsign: string | null;
        date: string;
        manufacturer: string | null;
        loggerId: string | null;
        numFlight: number | null;
    }
}

declare function parse(filename: string, maxYear?: number): parse.IGCFilenameData | null;

export = parse;

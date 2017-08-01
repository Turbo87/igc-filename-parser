const lookupManufacturer = require('flight-recorder-manufacturers/lookup');

const RE_SEEYOU = /^(\d)([1-9a-c])([1-9a-v])_([\da-z]{1,3})\.igc$/i;
const RE_STREPLA_PREFIX = /^([\da-z]{1,3})_(.*)$/i;
const RE_SHORT = /^(\d)([1-9a-c])([1-9a-v])([\da-z])([\da-z]{3})([\da-z]).*\.igc$/i;
const RE_LONG = /^(\d{4}-\d{2}-\d{2})(?:-([\da-z]{3})-([\da-z]{3})-(\d{2})|_flight_(\d+))?.*\.igc$/i;
const RE_FULL_DATE = /^(\d{4}_\d{2}_\d{2})_\d{2}_\d{2}_\d{2}.*\.igc$/i;
const RE_SHORT_DATE = /^(19\d{2}|20\d{2})[\.-_]?(\d{2})[\.-_]?(\d{2}).*\.igc$/i;
const RE_IGC_DROID = /^igcdroid_(\d{4})_([a-z]{3})_(\d{2}).*\.igc$/i;

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

const MONTHS = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
};

const PARSERS = [
  parseShort,
  parseLong,
  parseSeeyou,
  parseStrepla,
  parseShortDate,
  parseFullDate,
  parseIGCDroid,
];

module.exports = function parse(filename, maxYear) {
  if (arguments.length === 1) {
    maxYear = (new Date()).getUTCFullYear();
  }

  for (let parser of PARSERS) {
    let result = parser(filename, maxYear);
    if (result) {
      return result;
    }
  }

  return null;
};

function parseShort(filename, maxYear) {
  let match = filename.match(RE_SHORT);
  if (!match) {
    return null;
  }

  let callsign = null;
  let date = charsToDate(match[1], match[2], match[3], maxYear);
  let manufacturer = lookupManufacturer(match[4], true);

  let loggerId = match[5].toUpperCase();
  let numFlight = charToNumber(match[6]);

  return { callsign, date, manufacturer, loggerId, numFlight };
}

function parseSeeyou(filename, maxYear) {
  let match = filename.match(RE_SEEYOU);
  if (!match) {
    return null;
  }

  let callsign = match[4] || null;
  let date = charsToDate(match[1], match[2], match[3], maxYear);
  let manufacturer = null;
  let loggerId = null;
  let numFlight = null;

  return { callsign, date, manufacturer, loggerId, numFlight };
}

function parseStrepla(filename, maxYear) {
  let match = filename.match(RE_STREPLA_PREFIX);
  if (!match) {
    return null;
  }

  let callsign = match[1];
  let result = parseLong(match[2]) || parseShort(match[2], maxYear);
  if (result) {
    result.callsign = callsign;
  }

  return result;
}

function parseIGCDroid(filename) {
  let match = filename.match(RE_IGC_DROID);
  if (!match) {
    return null;
  }

  let month = MONTHS[match[2]];
  if (!month) {
    return null;
  }

  let callsign = null;
  let date = `${match[1]}-${month}-${match[3]}`;
  let manufacturer = null;
  let loggerId = null;
  let numFlight = null;

  return { callsign, date, manufacturer, loggerId, numFlight };
}

function parseLong(filename) {
  let match = filename.match(RE_LONG);
  if (!match) {
    return null;
  }

  let callsign = null;
  let date = match[1];
  let manufacturer = match[2] ? lookupManufacturer(match[2]) : null;
  let loggerId = match[3] ? match[3].toUpperCase() : null;

  let numFlight = null;
  if (match[4]) {
    numFlight = parseInt(match[4], 10);
  } else if (match[5]) {
    numFlight = parseInt(match[5], 10);
  }

  return { callsign, date, manufacturer, loggerId, numFlight };
}

function parseFullDate(filename) {
  let match = filename.match(RE_FULL_DATE);
  if (!match) {
    return null;
  }

  let callsign = null;
  let date = match[1].replace(/_/g, '-');
  let manufacturer = null;
  let loggerId = null;
  let numFlight = null;

  return { callsign, date, manufacturer, loggerId, numFlight };
}

function parseShortDate(filename) {
  let match = filename.match(RE_SHORT_DATE);
  if (!match) {
    return null;
  }

  let callsign = null;
  let date = `${match[1]}-${match[2]}-${match[3]}`;
  let manufacturer = null;
  let loggerId = null;
  let numFlight = null;

  return { callsign, date, manufacturer, loggerId, numFlight };
}

function charsToDate(y, m, d, maxYear) {
  let yearDigit = charToNumber(y);
  let monthDigit = charToNumber(m);
  let dayDigit = charToNumber(d);

  let yearDiff = (maxYear % 10) - yearDigit;
  if (yearDiff < 0) {
    yearDiff += 10;
  }

  let year = maxYear - yearDiff;
  let month = `${monthDigit < 10 ? '0' : ''}${monthDigit}`;
  let day = `${dayDigit < 10 ? '0' : ''}${dayDigit}`;
  return `${year}-${month}-${day}`;
}

function charToNumber(char) {
  let index = CHARS.indexOf(char.toLowerCase());
  if (index === -1) {
    throw new Error(`Unknown character: ${char}`);
  }
  return index;
}

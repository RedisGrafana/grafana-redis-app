import { HelpCommand } from '../types';

/**
 * RedisJSON
 *
 * @see https://oss.redislabs.com/redisjson/
 */
export const RedisJSONHelp: { [key: string]: HelpCommand } = {
  JSON: {
    syntax:
      'JSON.DEL, JSON.GET, JSON.MGET, JSON.SET, JSON.TYPE, JSON.NUMINCRBY, JSON.NUMMULTBY, JSON.STRAPPEND, \
    JSON.STRLEN, JSON.ARRAPPEND, JSON.ARRINDEX, JSON.ARRINSERT, JSON.ARRLEN, JSON.ARRPOP, JSON.ARRTRIM, JSON.OBJKEYS, \
    JSON.OBJLEN, JSON.DEBUG, JSON.RESP',
    summary:
      'RedisJSON is a Redis module that implements ECMA-404 The JSON Data Interchange Standard as a native data type.',
    url: 'https://oss.redislabs.com/redisjson/',
  },
  'JSON DEL': {
    syntax: 'JSON.DEL <key> [path]',
    summary: 'Delete a value.',
    complexity: 'O(N), where N is the size of the deleted value.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsondel',
  },
  'JSON GET': {
    syntax:
      'JSON.GET <key> [INDENT indentation-string] [NEWLINE line-break-string] [SPACE space-string] [NOESCAPE] [path ...]',
    summary: 'Return the value at path in JSON serialized form.',
    complexity: 'O(N), where N is the size of the value.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonget',
  },
  'JSON MGET': {
    syntax: 'JSON.MGET <key> [key ...] <path>',
    summary:
      'Returns the values at path from multiple key s. Non-existing keys and non-existing paths are reported as null.',
    complexity: 'O(M*N), where M is the number of keys and N is the size of the value.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonmget',
  },
  'JSON SET': {
    syntax: 'JSON.SET <key> <path> <json> [NX | XX]',
    summary: 'Sets the JSON value at path in key.',
    complexity: 'O(M+N), where M is the size of the original value (if it exists) and N is the size of the new value.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonset',
  },
  'JSON TYPE': {
    syntax: 'JSON.TYPE <key> [path]',
    summary: 'Report the type of JSON value at path.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsontype',
  },
  'JSON NUMINCRBY': {
    syntax: 'JSON.NUMINCRBY <key> <path> <number>',
    summary: 'Increments the number value stored at path by number.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonnumincrby',
  },
  'JSON NUMMULTBY': {
    syntax: 'JSON.NUMMULTBY <key> <path> <number>',
    summary: 'Multiplies the number value stored at path by number.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonnummultby',
  },
  'JSON STRAPPEND': {
    syntax: 'JSON.STRAPPEND <key> [path] <json-string>',
    summary: 'Append the json-string value(s) the string at path.',
    complexity: "O(N), where N is the new string's length.",
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonstrappend',
  },
  'JSON STRLEN': {
    syntax: 'JSON.STRLEN <key> [path]',
    summary: 'Report the length of the JSON String at path in key.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonstrlen',
  },
  'JSON ARRAPPEND': {
    syntax: 'JSON.ARRAPPEND <key> <path> <json> [json ...]',
    summary: 'Append the json value(s) into the array at path after the last element in it.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonarrappend',
  },
  'JSON ARRINDEX': {
    syntax: 'JSON.ARRINDEX <key> <path> <json-scalar> [start [stop]]',
    summary: 'Search for the first occurrence of a scalar JSON value in an array.',
    complexity: "O(N), where N is the array's size.",
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonarrindex',
  },
  'JSON ARRINSERT': {
    syntax: 'JSON.ARRINSERT <key> <path> <index> <json> [json ...]',
    summary: 'Insert the json value(s) into the array at path before the index (shifts to the right).',
    complexity: "O(N), where N is the array's size.",
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonarrinsert',
  },
  'JSON ARRLEN': {
    syntax: 'JSON.ARRLEN <key> [path]',
    summary: 'Report the length of the JSON Array at path in key.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonarrlen',
  },
  'JSON ARRPOP': {
    syntax: 'JSON.ARRPOP <key> [path [index]]',
    summary: 'Remove and return element from the index in the array.',
    complexity: "O(N), where N is the array's size for index other than the last element, O(1) otherwise.",
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonarrpop',
  },
  'JSON ARRTRIM': {
    syntax: 'JSON.ARRTRIM <key> <path> <start> <stop>',
    summary: 'Trim an array so that it contains only the specified inclusive range of elements.',
    complexity: "O(N), where N is the array's size.",
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonarrtrim',
  },
  'JSON OBJKEYS': {
    syntax: 'JSON.OBJKEYS <key> [path]',
    summary: "Return the keys in the object that's referenced by path.",
    complexity: 'O(N), where N is the number of keys in the object.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonobjkeys',
  },
  'JSON OBJLEN': {
    syntax: 'JSON.OBJLEN <key> [path]',
    summary: 'Report the number of keys in the JSON Object at path in key.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonobjlen',
  },
  'JSON DEBUG': {
    syntax: 'JSON.DEBUG <subcommand & arguments>',
    summary: 'Report information.',
    complexity: 'O(N), where N is the size of the JSON value.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsondebug',
  },
  'JSON RESP': {
    syntax: 'JSON.RESP <key> [path]',
    summary: 'Return the JSON in key in Redis Serialization Protocol (RESP).',
    complexity: 'O(N), where N is the size of the JSON value.',
    url: 'https://oss.redislabs.com/redisjson/commands/#jsonresp',
  },
};

import { HelpCommand } from '../types';

/**
 * RediSearch
 *
 * @see https://oss.redislabs.com/redisearch/
 */
export const RedisSearchHelp: { [key: string]: HelpCommand } = {
  FT: {
    syntax:
      'FT.CREATE, FT.SEARCH, FT.AGGREGATE, FT.EXPLAIN, FT.EXPLAINCLI, FT.ALTER, FT.DROPINDEX, FT.ALIASADD, FT.ALIASUPDATE \
    FT.ALIASDEL, FT.TAGVALS, FT.SUGADD, FT.SUGGET, FT.SUGDEL, FT.SUGLEN, FT.SYNUPDATE, FT.SYNDUMP, FT.SPELLCHECK, FT.DICTADD, \
    FT.DICTDEL, FT.DICTDUMP, FT.INFO, FT.CONFIG',
    summary: 'RediSearch is a Full-Text and Secondary Index engine over Redis.',
    url: 'https://oss.redislabs.com/redisearch/',
  },
  'FT CREATE': {
    syntax:
      'FT.CREATE {index} [ON {structure}] [PREFIX {count} {prefix} [{prefix} ..] [FILTER {filter}] [LANGUAGE {default_lang}] \
    [LANGUAGE_FIELD {lang_field}] [SCORE {default_score}] [SCORE_FIELD {score_field}] [PAYLOAD_FIELD {payload_field}] [MAXTEXTFIELDS] \
    [TEMPORARY {seconds}] [NOOFFSETS] [NOHL] [NOFIELDS] [NOFREQS] [SKIPINITIALSCAN] [STOPWORDS {num} {stopword} ...] \
    SCHEMA {field} [TEXT [NOSTEM] [WEIGHT {weight}] [PHONETIC {matcher}] | NUMERIC | GEO | TAG [SEPARATOR {sep}] ] [SORTABLE][NOINDEX] ...',
    summary: 'Create an index with the given spec.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftcreate',
  },
  'FT SEARCH': {
    syntax:
      'FT.SEARCH {index} {query} [NOCONTENT] [VERBATIM] [NOSTOPWORDS] [WITHSCORES] [WITHPAYLOADS] [WITHSORTKEYS] \
    [FILTER {numeric_field} {min} {max}] ... [GEOFILTER {geo_field} {lon} {lat} {radius} m|km|mi|ft] \
    [INKEYS {num} {key} ... ] [INFIELDS {num} {field} ... ] \
    [RETURN {num} {field} ... ] [SUMMARIZE [FIELDS {num} {field} ... ] [FRAGS {num}] [LEN {fragsize}] [SEPARATOR {separator}]] \
    [HIGHLIGHT [FIELDS {num} {field} ... ] [TAGS {open} {close}]] [SLOP {slop}] [INORDER] \
    [LANGUAGE {language}] [EXPANDER {expander}] [SCORER {scorer}] [EXPLAINSCORE] [PAYLOAD {payload}] [SORTBY {field} [ASC|DESC]] \
    [LIMIT offset num]',
    summary: 'Search the index with a textual query, returning either documents or just ids.',
    complexity:
      'O(n) for single word queries. n is the number of the results in the result set. Finding all the documents that \
    have a specific term is O(1), however, a scan on all those documents is needed to load the documents data from redis hashes \
    and return them.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsearch',
  },
  'FT AGGREGATE': {
    syntax:
      'FT.AGGREGATE {index_name} {query_string} [VERBATIM] \
    [LOAD {nargs} {property} ...] [GROUPBY {nargs} {property} ... \
      REDUCE {func} {nargs} {arg} ... [AS {name:string}] ... ] ... \
    [SORTBY {nargs} {property} [ASC|DESC] ... [MAX {num}]] [APPLY {expr} AS {alias}] ... \
    [LIMIT {offset} {num}] ... [FILTER {expr}] ...',
    summary:
      'Run a search query on an index, and performs aggregate transformations on the results, extracting statistics etc from them.',
    complexity:
      'Non-deterministic. Depends on the query and aggregations performed, but it is usually linear to the number \
    of results returned.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftaggregate',
  },
  'FT EXPLAIN': {
    syntax: 'FT.EXPLAIN {index} {query}',
    summary: 'Return the execution plan for a complex query.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftexplain',
  },
  'FT EXPLAINCLI': {
    syntax: 'FT.EXPLAINCLI {index} {query}',
    summary: 'Return the execution plan for a complex query but formatted for easier reading',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftexplaincli',
  },
  'FT ALTER': {
    syntax: 'FT.ALTER {index} SCHEMA ADD {field} {options} ...',
    summary: 'Add a new field to the index.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftalter_schema_add',
  },
  'FT DROPINDEX': {
    syntax: 'FT.DROPINDEX {index} [DD]',
    summary: 'Delete the index.',
    since: 'RediSearch 2.0',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftdropindex',
  },
  'FT ALIASADD': {
    syntax: 'FT.ALIASADD {name} {index}',
    summary: 'Add an alias from an index.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftaliasadd',
  },
  'FT ALIASUPDATE': {
    syntax: 'FT.ALIASUPDATE {name} {index}',
    summary:
      'The FT.ALIASUPDATE command differs from the FT.ALIASADD command in that it will remove the alias association \
    with a previous index, if any. FT.ALIASDD will fail, on the other hand, if the alias is already associated with another index.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftaliasupdate',
  },
  'FT ALIASDEL': {
    syntax: 'FT.ALIASDEL {name}',
    summary: 'Remove an alias from an index.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftaliasdel',
  },
  'FT TAGVALS': {
    syntax: 'FT.TAGVALS {index} {field_name}',
    summary: 'Return the distinct tags indexed in a Tag field.',
    complexity: 'O(n), n being the cardinality of the tag field.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#fttagvals',
  },
  'FT SUGADD': {
    syntax: 'FT.SUGADD {key} {string} {score} [INCR] [PAYLOAD {payload}]',
    summary:
      'Add a suggestion string to an auto-complete suggestion dictionary. This is disconnected from the index definitions, \
    and leaves creating and updating suggestions dictionaries to the user.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsugadd',
  },
  'FT SUGGET': {
    syntax: 'FT.SUGGET {key} {prefix} [FUZZY] [WITHSCORES] [WITHPAYLOADS] [MAX num]',
    summary: 'Get completion suggestions for a prefix.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsugget',
  },
  'FT SUGDEL': {
    syntax: 'FT.SUGDEL {key} {string}',
    summary: 'Delete a string from a suggestion index.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsugdel',
  },
  'FT SUGLEN': {
    syntax: 'FT.SUGLEN {key}',
    summary: 'Get the size of an auto-complete suggestion dictionary.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsuglen',
  },
  'FT SYNUPDATE': {
    syntax: 'FT.SYNUPDATE <index name> <synonym group id> [SKIPINITIALSCAN] <term1> <term2> ...',
    summary: 'Update a synonym group.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsynupdate',
  },
  'FT SYNDUMP': {
    syntax: 'FT.SYNDUMP <index name>',
    summary: 'Dump the contents of a synonym group.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftsyndump',
  },
  'FT SPELLCHECK': {
    syntax: 'FT.SPELLCHECK {index} {query} [DISTANCE dist] [TERMS {INCLUDE | EXCLUDE} {dict} [TERMS ...]]',
    summary: 'Performs spelling correction on a query, returning suggestions for misspelled terms.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftspellcheck',
  },
  'FT DICTADD': {
    syntax: 'FT.DICTADD {dict} {term} [{term} ...]',
    summary: 'Add terms to a dictionary.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftdictadd',
  },
  'FT DICTDEL': {
    syntax: 'FT.DICTDEL {dict} {term} [{term} ...]',
    summary: 'Delete terms from a dictionary.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftdictdel',
  },
  'FT DICTDUMP': {
    syntax: 'FT.DICTDUMP {dict}',
    summary: 'Dump all terms in the given dictionary.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftdictdump',
  },
  'FT INFO': {
    syntax: 'FT.INFO {index}',
    summary: 'Return information and statistics on the index.',
    complexity: 'O(n), n being the cardinality of the tag field.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftinfo',
  },
  'FT CONFIG': {
    syntax: 'FT.CONFIG <GET|HELP> {option}, FT.CONFIG SET {option} {value}',
    summary: 'Retrieves, describes and sets runtime configuration options.',
    url: 'https://oss.redislabs.com/redisearch/Commands/#ftconfig',
  },
};

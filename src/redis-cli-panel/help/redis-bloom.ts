import { HelpCommand } from '../types';

/**
 * RedisBloom
 *
 * @see https://oss.redislabs.com/redisbloom/
 */
export const RedisBloomHelp: { [key: string]: HelpCommand } = {
  BF: {
    syntax: 'BF.RESERVE, BF.ADD, BF.MADD, BF.INSERT, BF.EXISTS, BF.MEXISTS, BF.SCANDUMP, BF.LOADCHUNK, BF.INFO',
    summary: 'RedisBloom Bloom Filter',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/',
  },
  'BF RESERVE': {
    syntax: 'BF.RESERVE {key} {error_rate} {capacity} [EXPANSION expansion] [NONSCALING]',
    summary: 'Create an empty Bloom Filter with a given desired error ratio and initial capacity.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfreserve',
  },
  'BF ADD': {
    syntax: 'BF.ADD {key} {item}',
    summary: 'Add an item to the Bloom Filter, creating the filter if it does not yet exist.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfadd',
  },
  'BF MADD': {
    syntax: 'BF.MADD {key} {item} [item...]',
    summary: 'Add one or more items to the Bloom Filter, creating the filter if it does not yet exist.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfmadd',
  },
  'BF INSERT': {
    syntax:
      'BF.INSERT {key} [CAPACITY {cap}] [ERROR {error}] [EXPANSION expansion] [NOCREATE] [NONSCALING] ITEMS {item...}',
    summary: 'Add one or more items to the bloom filter, by default creating it if it does not yet exist.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfinsert',
  },
  'BF EXISTS': {
    syntax: 'BF.EXISTS {key} {item}',
    summary: 'Determine whether an item may exist in the Bloom Filter or not.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfexists',
  },
  'BF MEXISTS': {
    syntax: 'BF.MEXISTS {key} {item} [item...]',
    summary: 'Determine if one or more items may exist in the filter or not.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfmexists',
  },
  'BF SCANDUMP': {
    syntax: 'BF.SCANDUMP {key} {iter}',
    summary: 'Begin an incremental save of the bloom filter.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfscandump',
  },
  'BF LOADCHUNK': {
    syntax: 'BF.LOADCHUNK {key} {iter} {data}',
    summary: 'Restore a filter previously saved using SCANDUMP.',
    complexity: 'O(log N), where N is the number of stacked filters in the data structure.',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfloadchunk',
  },
  'BF INFO': {
    syntax: 'BF.INFO {key}',
    summary: 'Return information about key.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/Bloom_Commands/#bfinfo',
  },
  CF: {
    syntax:
      'CF.RESERVE, CF.ADD, CF.ADDNX, CF.INSERT, CF.INSERTNX, CF.EXISTS, CF.DEL, CF.COUNT, CF.SCANDUMP, CF.LOADCHUNK, CF.INFO',
    summary: 'RedisBloom Cuckoo Filter',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/',
  },
  'CF RESERVE': {
    syntax: 'CF.RESERVE {key} {capacity} [BUCKETSIZE bucketSize] [MAXITERATIONS maxIterations] [EXPANSION expansion]',
    summary: 'Create an empty cuckoo filter with an initial capacity of {capacity} items.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfreserve',
  },
  'CF ADD': {
    syntax: 'CF.ADD {key} {item}',
    summary: 'Add an item to the cuckoo filter, creating the filter if it does not exist.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfadd',
  },
  'CF ADDNX': {
    syntax: 'CF.ADDNX {key} {item}',
    summary: 'Add an item to a cuckoo filter if the item did not exist previously.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfaddnx',
  },
  'CF INSERT': {
    syntax: 'CF.INSERT {key} [CAPACITY {cap}] [NOCREATE] ITEMS {item ...}',
    summary: 'Add one or more items to a cuckoo filter.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfinsert',
  },
  'CF INSERTNX': {
    syntax: 'CF.INSERTNX {key} [CAPACITY {cap}] [NOCREATE] ITEMS {item ...}',
    summary:
      'Add one or more items to a cuckoo filter, allowing the filter to be created with a custom capacity if it does not yet exist.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfinsertnx',
  },
  'CF EXISTS': {
    syntax: 'CF.EXISTS {key} {item}',
    summary: 'Check if an item exists in a Cuckoo Filter.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfexists',
  },
  'CF DEL': {
    syntax: 'CF.DEL {key} {item}',
    summary: 'Deletes an item once from the filter.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfdel',
  },
  'CF COUNT': {
    syntax: 'CF.COUNT {key} {item}',
    summary: 'Returns the number of times an item may be in the filter.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfcount',
  },
  'CF SCANDUMP': {
    syntax: 'CF.SCANDUMP {key} {iter}',
    summary: 'Begins an incremental save of the cuckoo filter.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfscandump',
  },
  'CF LOADCHUNK': {
    syntax: 'CF.LOADCHUNK {key} {iter} {data}',
    summary: 'Restores a filter previously saved using SCANDUMP.',
    complexity: 'O(log N)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfloadchunk',
  },
  'CF INFO': {
    syntax: 'CF.INFO {key}',
    summary: 'Return information about key.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/Cuckoo_Commands/#cfinfo',
  },
  CMS: {
    syntax: 'CMS.INITBYDIM, CMS.INITBYPROB, CMS.INCRBY, CMS.QUERY, CMS.MERGE, CMS.INFO',
    summary: 'RedisBloom Count-Min Sketch',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/',
  },
  'CMS INITBYDIM': {
    syntax: 'CMS.INITBYDIM key width depth',
    summary: 'Initializes a Count-Min Sketch to dimensions specified by user.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/#cmsinitbydim',
  },
  'CMS INITBYPROB': {
    syntax: 'CMS.INITBYPROB key error probability',
    summary: 'Initializes a Count-Min Sketch to accommodate requested capacity.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/#cmsinitbyprob',
  },
  'CMS INCRBY': {
    syntax: 'CMS.INCRBY key item increment [item increment ...]',
    summary: 'Increases the count of item by increment.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/#cmsincrby',
  },
  'CMS QUERY': {
    syntax: 'CMS.QUERY key item [item ...]',
    summary: 'Returns count for item. Multiple items can be queried with one call.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/#cmsquery',
  },
  'CMS MERGE': {
    syntax: 'CMS.MERGE dest numKeys src1 [src2 ...] [WEIGHTS weight1 ...]',
    summary: 'Merges several sketches into one sketch.',
    complexity: 'O(n)',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/#cmsmerge',
  },
  'CMS INFO': {
    syntax: 'CMS.INFO key',
    summary: 'Returns width, depth and total count of the sketch.',
    complexity: 'O(n) due to fill rate percentage',
    url: 'https://oss.redislabs.com/redisbloom/CountMinSketch_Commands/#cmsinfo',
  },
  TOPK: {
    syntax: 'TOPK.RESERVE, TOPK.ADD, TOPK.INCRBY, TOPK.QUERY, TOPK.COUNT, TOPK.LIST, TOPK.INFO',
    summary: 'RedisBloom TopK Filter',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/',
  },
  'TOPK RESERVE': {
    syntax: 'TOPK.RESERVE key topk width depth decay',
    summary: 'Initializes a TopK with specified parameters.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topkreserve',
  },
  'TOPK ADD': {
    syntax: 'TOPK.ADD key item [item ...]',
    summary: 'Adds an item to the data structure',
    complexity: 'O(k + depth)',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topkadd',
  },
  'TOPK INCRBY': {
    syntax: 'TOPK.INCRBY key item increment [item increment ...]',
    summary: 'Increase the score of an item in the data structure by increment.',
    complexity: 'O(k + (increment * depth))',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topkincrby',
  },
  'TOPK QUERY': {
    syntax: 'TOPK.QUERY key item [item ...]',
    summary: 'Checks whether an item is one of Top-K items.',
    complexity: 'O(k)',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topkquery',
  },
  'TOPK COUNT': {
    syntax: 'TOPK.COUNT key item [item ...]',
    summary: 'Returns count for an item.',
    complexity: 'O(k + depth)',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topkcount',
  },
  'TOPK LIST': {
    syntax: 'TOPK.LIST key',
    summary: 'Return full list of items in Top K list.',
    complexity: 'O(k)',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topklist',
  },
  'TOPK INFO': {
    syntax: 'TOPK.INFO key',
    summary: 'Returns number of required items (k), width, depth and decay values.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redisbloom/TopK_Commands/#topkinfo',
  },
};

import { HelpCommand } from '../types';

/**
 * Native Redis commands
 *
 * @see https://redis.io/commands
 * @see https://github.com/redis/redis-doc/blob/master/commands.json
 */
export const RedisHelp: { [key: string]: HelpCommand } = {
  /**
   * ACL
   * @see https://redis.io/topics/acl
   */
  ACL: {
    syntax: 'ACL LOAD | SAVE | LIST | USERS | GETUSER | SETUSER | DELUSER | CAT | GENPASS | WHOAMI | LOG | HELP',
    summary:
      'The Redis ACL, short for Access Control List, is the feature that allows certain connections to be \
      limited in terms of the commands that can be executed and the keys that can be accessed.',
    since: '6.0.0',
    url: 'https://redis.io/topics/acl',
  },
  'ACL LOAD': {
    syntax: 'ACL LOAD',
    summary: 'Reload the ACLs from the configured ACL file.',
    complexity: 'O(N). Where N is the number of configured users.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-load',
  },
  'ACL SAVE': {
    syntax: 'ACL SAVE',
    summary: 'Save the current ACL rules in the configured ACL file.',
    complexity: 'O(N). Where N is the number of configured users.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-save',
  },
  'ACL LIST': {
    syntax: 'ACL LIST',
    summary: 'List the current ACL rules in ACL config file format.',
    complexity: 'O(N). Where N is the number of configured users.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-list',
  },
  'ACL USERS': {
    syntax: 'ACL USERS',
    summary: 'List the username of all the configured ACL rules.',
    complexity: 'O(N). Where N is the number of configured users.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-users',
  },
  'ACL GETUSER': {
    syntax: 'ACL GETUSER username',
    summary: 'Get the rules for a specific ACL user.',
    complexity: 'O(N). Where N is the number of password, command and pattern rules that the user has.',
    since: '6.0.0, >= 6.2: Added Pub/Sub channel patterns.',
    url: 'https://redis.io/commands/acl-getuser',
  },
  'ACL SETUSER': {
    syntax: 'ACL SETUSER username [rule [rule ...]]',
    summary: 'Modify or create the rules for a specific ACL user.',
    complexity: 'O(N). Where N is the number of rules provided.',
    since: '6.0.0, >= 6.2: Added Pub/Sub channel patterns.',
    url: 'https://redis.io/commands/acl-setuser',
  },
  'ACL DELUSER': {
    syntax: 'ACL DELUSER username [username ...]',
    summary: 'Remove the specified ACL users and the associated rules.',
    complexity: 'O(1) amortized time considering the typical user.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-deluser',
  },
  'ACL CAT': {
    syntax: 'ACL CAT [categoryname]',
    summary: 'List the ACL categories or the commands inside a category.',
    complexity: 'O(1) since the categories and commands are a fixed set.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-cat',
  },
  'ACL GENPASS': {
    syntax: 'ACL GENPASS [bits]',
    summary: 'Generate a pseudorandom secure password to use for ACL users.',
    complexity: 'O(1)',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-genpass',
  },
  'ACL WHOAMI': {
    syntax: 'ACL WHOAMI',
    summary: 'Return the name of the user associated to the current connection.',
    complexity: 'O(1)',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-whoami',
  },
  'ACL LOG': {
    syntax: 'ACL LOG [count or RESET]',
    summary: 'List latest events denied because of ACLs in place.',
    complexity: 'O(N) with N being the number of entries shown.',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-log',
  },
  'ACL HELP': {
    syntax: 'ACL HELP',
    summary: 'Show helpful text about the different subcommands.',
    complexity: 'O(1)',
    since: '6.0.0',
    url: 'https://redis.io/commands/acl-help',
  },
  APPEND: {
    syntax: 'APPEND key value',
    summary: 'Append a value to a key.',
    complexity:
      'O(1). The amortized time complexity is O(1) assuming the appended value is small and \
      the already present value is of any size, since the dynamic string library used by Redis \
      will double the free space available on every reallocation.',
    since: '2.0.0',
    url: 'https://redis.io/commands/append',
  },
  AUTH: {
    syntax: 'AUTH [username] password',
    summary: 'Authenticate to the server.',
    since: '1.0.0',
    url: 'https://redis.io/commands/auth',
  },
  BGREWRITEAOF: {
    syntax: 'BGREWRITEAOF',
    summary: 'Asynchronously rewrite the append-only file.',
    since: '1.0.0',
    url: 'https://redis.io/commands/bgrewriteaof',
  },
  BGSAVE: {
    syntax: 'BGSAVE [SCHEDULE]',
    summary: 'Asynchronously save the dataset to disk.',
    since: '1.0.0',
    url: 'https://redis.io/commands/bgsave',
  },
  BITCOUNT: {
    syntax: 'BITCOUNT key [start end [BYTE|BIT]]',
    summary: 'Count the number of set bits (population counting) in a string.',
    complexity: 'O(N)',
    since: '2.6.0, >= 7.0: Added the BYTE|BIT option.',
    url: 'https://redis.io/commands/bitcount',
  },
  BITFIELD: {
    syntax:
      'BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]',
    summary: 'Perform arbitrary bitfield integer operations on strings.',
    complexity: 'O(1) for each subcommand specified.',
    since: '3.2.0',
    url: 'https://redis.io/commands/bitfield',
  },
  BITFIELD_RO: {
    syntax: 'BITFIELD_RO key GET type offset',
    summary: 'Perform arbitrary bitfield integer operations on strings. Read-only variant of BITFIELD.',
    complexity: 'O(1) for each subcommand specified.',
    since: '6.2.0',
    url: 'https://redis.io/commands/bitfield_ro',
  },
  BITOP: {
    syntax: 'BITOP operation destkey key [key ...]',
    summary: 'Perform bitwise operations between strings.',
    complexity: 'O(N)',
    since: '2.6.0',
    url: 'https://redis.io/commands/bitop',
  },
  BITPOS: {
    syntax: 'BITPOS key bit [start [end [BYTE|BIT]]]',
    summary: 'Return the position of the first bit set to 1 or 0 in a string.',
    complexity: 'O(N)',
    since: '2.8.7, >= 7.0: Added the BYTE|BIT option.',
    url: 'https://redis.io/commands/bitpos',
  },
  BLPOP: {
    syntax: 'BLPOP key [key ...] timeout',
    summary: 'Remove and get the first element in a list, or block until one is available.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/blpop',
  },
  BRPOP: {
    syntax: 'BRPOP key [key ...] timeout',
    summary: 'Remove and get the last element in a list, or block until one is available.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/brpop',
  },
  BRPOPLPUSH: {
    syntax: 'BRPOPLPUSH source destination timeout',
    summary: 'Pop an element from a list, push it to another list and return it; or block until one is available.',
    warning: 'As per Redis 6.2.0, BRPOPLPUSH is considered deprecated. Please prefer `BLMOVE` in new code.',
    complexity: 'O(1)',
    since: '2.2.0',
    url: 'https://redis.io/commands/brpoplpush',
  },
  BLMOVE: {
    syntax: 'BLMOVE source destination LEFT|RIGHT LEFT|RIGHT timeout',
    summary: 'Pop an element from a list, push it to another list and return it; or block until one is available.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/blmove',
  },
  BZPOPMIN: {
    syntax: 'BZPOPMIN key [key ...] timeout',
    summary:
      'Remove and return the member with the lowest score from one or more sorted sets, or block until one is available.',
    complexity: 'O(log(N)) with N being the number of elements in the sorted set.',
    since: '5.0.0',
    url: 'https://redis.io/commands/bzpopmin',
  },
  BZPOPMAX: {
    syntax: 'BZPOPMAX key [key ...] timeout',
    summary:
      'Remove and return the member with the highest score from one or more sorted sets, or block until one is available.',
    complexity: 'O(log(N)) with N being the number of elements in the sorted set.',
    since: '5.0.0',
    url: 'https://redis.io/commands/bzpopmax',
  },

  /**
   * Client
   *
   * @see https://redis.io/topics/client-side-caching
   */
  CLIENT: {
    syntax:
      'CLIENT CACHING | ID | INFO | KILL | LIST | GETNAME | GETREDIR | UNPAUSE | PAUSE | REPLY | SETNAME | TRACKING | TRACKINGINFO | UNBLOCK',
    summary: 'Client connections.',
    url: 'https://redis.io/commands',
  },
  'CLIENT CACHING': {
    syntax: 'CLIENT CACHING YES|NO',
    summary: 'Instruct the server about tracking or not keys in the next request.',
    complexity: 'O(1)',
    since: '6.0.0',
    url: 'https://redis.io/commands/client-caching',
  },
  'CLIENT ID': {
    syntax: 'CLIENT ID',
    summary: 'Returns the client ID for the current connection.',
    complexity: 'O(1)',
    since: '5.0.0',
    url: 'https://redis.io/commands/client-id',
  },
  'CLIENT INFO': {
    syntax: 'CLIENT INFO',
    summary: 'Returns information about the current client connection.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/client-info',
  },
  'CLIENT KILL': {
    syntax:
      'CLIENT KILL [ip:port] [ID client-id] [TYPE normal|master|slave|pubsub] [USER username] [ADDR ip:port] [SKIPME yes/no]',
    summary: 'Kill the connection of a client.',
    complexity: 'O(N) where N is the number of client connections.',
    since: '2.4.0, >= 6.2: LADDR option.',
    url: 'https://redis.io/commands/client-kill',
  },
  'CLIENT LIST': {
    syntax: 'CLIENT LIST [TYPE normal|master|replica|pubsub] [ID client-id [client-id ...]]',
    summary: 'Get the list of client connections.',
    complexity: 'O(N) where N is the number of client connections.',
    since: '2.4.0, >= 6.2: Added laddr field and the optional ID filter.',
    url: 'https://redis.io/commands/client-list',
  },
  'CLIENT GETNAME': {
    syntax: 'CLIENT GETNAME',
    summary: 'Get the current connection name.',
    complexity: 'O(1)',
    since: '2.6.9',
    url: 'https://redis.io/commands/client-getname',
  },
  'CLIENT GETREDIR': {
    syntax: 'CLIENT GETREDIR',
    summary: 'Get tracking notifications redirection client ID if any.',
    complexity: 'O(1)',
    since: '6.0.0',
    url: 'https://redis.io/commands/client-getredir',
  },
  'CLIENT UNPAUSE': {
    syntax: 'CLIENT UNPAUSE',
    summary: 'Resume processing of clients that were paused.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/client-unpause',
  },
  'CLIENT PAUSE': {
    syntax: 'CLIENT PAUSE timeout [WRITE|ALL]',
    summary: 'Stop processing commands from clients for some time.',
    complexity: 'O(1)',
    since: '2.9.50, >= 6.2: CLIENT PAUSE WRITE mode added along with the mode option.',
    url: 'https://redis.io/commands/client-pause',
  },
  'CLIENT REPLY': {
    syntax: 'CLIENT REPLY ON|OFF|SKIP',
    summary: 'Instruct the server whether to reply to commands.',
    complexity: 'O(1)',
    since: '3.2.0',
    url: 'https://redis.io/commands/client-reply',
  },
  'CLIENT SETNAME': {
    syntax: 'CLIENT SETNAME connection-name',
    summary: 'Set the current connection name.',
    complexity: 'O(1)',
    since: '2.6.9',
    url: 'https://redis.io/commands/client-setname',
  },
  'CLIENT TRACKING': {
    syntax:
      'CLIENT TRACKING ON|OFF [REDIRECT client-id] [PREFIX prefix [PREFIX prefix ...]] [BCAST] [OPTIN] [OPTOUT] [NOLOOP]',
    summary: 'Enable or disable server assisted client side caching support.',
    complexity: 'O(1). Some options may introduce additional complexity.',
    since: '6.0.0',
    url: 'https://redis.io/commands/client-tracking',
  },
  'CLIENT TRACKINGINFO': {
    syntax: 'CLIENT TRACKINGINFO',
    summary: 'Return information about server assisted client side caching for the current connection.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/client-trackinginfo',
  },
  'CLIENT UNBLOCK': {
    syntax: 'CLIENT UNBLOCK client-id [TIMEOUT|ERROR]',
    summary: 'Unblock a client blocked in a blocking command from a different connection.',
    complexity: 'O(log N) where N is the number of client connections.',
    since: '5.0.0',
    url: 'https://redis.io/commands/client-unblock',
  },

  /**
   * Cluster
   *
   * @see https://redis.io/topics/cluster-spec
   */
  CLUSTER: {
    syntax:
      'CLUSTER ADDSLOTS | ADDSLOTSRANGE | BUMPEPOCH | COUNT-FAILURE-REPORTS | COUNTKEYSINSLOT | DELSLOTS | DELSLOTSRANGE \
      | FAILOVER | FLUSHSLOTS | FORGET | GETKEYSINSLOT | INFO | KEYSLOT | MEET | MYID | NODES | REPLICATE | RESET \
      | SAVECONFIG | SET-CONFIG-EPOCH | SETSLOT | SLAVES | REPLICAS | SLOTS',
    summary: 'Redis Cluster is a distributed implementation of Redis.',
    since: '3.0.0',
    url: 'https://redis.io/topics/cluster-spec',
  },
  'CLUSTER ADDSLOTS': {
    syntax: 'CLUSTER ADDSLOTS slot [slot ...]',
    summary: 'Assign new hash slots to receiving node.',
    complexity: 'O(N) where N is the total number of hash slot arguments.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-addslots',
  },
  'CLUSTER ADDSLOTSRANGE': {
    syntax: 'CLUSTER ADDSLOTSRANGE start-slot end-slot [start-slot end-slot ...]',
    summary:
      'The CLUSTER ADDSLOTSRANGE is similar to the CLUSTER ADDSLOTS command in that they both assign hash slots to nodes.',
    complexity: 'O(N) where N is the total number of the slots between the start slot and end slot arguments.',
    since: '7.0.0',
    url: 'https://redis.io/commands/cluster-addslotsrange',
  },
  'CLUSTER BUMPEPOCH': {
    syntax: 'CLUSTER BUMPEPOCH',
    summary: 'Advance the cluster config epoch.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-bumpepoch',
  },
  'CLUSTER COUNT-FAILURE-REPORTS': {
    syntax: 'CLUSTER COUNT-FAILURE-REPORTS node-id',
    summary: 'Return the number of failure reports active for a given node.',
    complexity: 'O(N) where N is the number of failure reports.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-count-failure-reports',
  },
  'CLUSTER COUNTKEYSINSLOT': {
    syntax: 'CLUSTER COUNTKEYSINSLOT slot',
    summary: 'Return the number of local keys in the specified hash slot.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-countkeysinslot',
  },
  'CLUSTER DELSLOTS': {
    syntax: 'CLUSTER DELSLOTS slot [slot ...]',
    summary: 'Set hash slots as unbound in receiving node.',
    complexity: 'O(N) where N is the total number of hash slot arguments.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-delslots',
  },
  'CLUSTER DELSLOTSRANGE': {
    syntax: 'CLUSTER DELSLOTSRANGE start-slot end-slot [start-slot end-slot ...]',
    summary:
      'The CLUSTER DELSLOTSRANGE command is similar to the CLUSTER DELSLOTS command in that they both remove hash slots from the node.',
    complexity: 'O(N) where N is the total number of the slots between the start slot and end slot arguments.',
    since: '7.0.0',
    url: 'https://redis.io/commands/cluster-delslotsrange',
  },
  'CLUSTER FAILOVER': {
    syntax: 'CLUSTER FAILOVER [FORCE|TAKEOVER]',
    summary: 'Forces a replica to perform a manual failover of its master.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-failover',
  },
  'CLUSTER FLUSHSLOTS': {
    syntax: 'CLUSTER FLUSHSLOTS',
    summary: "Delete a node's own slots information.",
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-flushslots',
  },
  'CLUSTER FORGET': {
    syntax: 'CLUSTER FORGET node-id',
    summary: 'Remove a node from the nodes table.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-forget',
  },
  'CLUSTER GETKEYSINSLOT': {
    syntax: 'CLUSTER GETKEYSINSLOT slot count',
    summary: 'Return local key names in the specified hash slot.',
    complexity: 'O(log(N)) where N is the number of requested keys.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-getkeysinslot',
  },
  'CLUSTER INFO': {
    syntax: 'CLUSTER INFO',
    summary: 'Provides info about Redis Cluster node state.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-info',
  },
  'CLUSTER KEYSLOT': {
    syntax: 'CLUSTER KEYSLOT key',
    summary: 'Returns the hash slot of the specified key.',
    complexity: 'O(N) where N is the number of bytes in the key.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-keyslot',
  },
  'CLUSTER MEET': {
    syntax: 'CLUSTER MEET ip port',
    summary: 'Force a node cluster to handshake with another node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-meet',
  },
  'CLUSTER MYID': {
    syntax: 'CLUSTER MYID',
    summary: 'Return the node id.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-myid',
  },
  'CLUSTER NODES': {
    syntax: 'CLUSTER NODES',
    summary: 'Get Cluster config for the node.',
    complexity: 'O(N) where N is the total number of Cluster nodes.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-nodes',
  },
  'CLUSTER REPLICATE': {
    syntax: 'CLUSTER REPLICATE node-id',
    summary: 'Reconfigure a node as a replica of the specified master node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-replicate',
  },
  'CLUSTER RESET': {
    syntax: 'CLUSTER RESET [HARD|SOFT]',
    summary: 'Reset a Redis Cluster node.',
    danger: 'The command may execute a FLUSHALL as a side effect.',
    complexity: 'O(N) where N is the number of known nodes.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-reset',
  },
  'CLUSTER SAVECONFIG': {
    syntax: 'CLUSTER SAVECONFIG',
    summary: 'Forces the node to save cluster state on disk.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-saveconfig',
  },
  'CLUSTER SET-CONFIG-EPOCH': {
    syntax: 'CLUSTER SET-CONFIG-EPOCH config-epoch',
    summary: 'Set the configuration epoch in a new node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-set-config-epoch',
  },
  'CLUSTER SETSLOT': {
    syntax: 'CLUSTER SETSLOT slot IMPORTING|MIGRATING|STABLE|NODE [node-id]',
    summary: 'Bind a hash slot to a specific node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-setslot',
  },
  'CLUSTER SLAVES': {
    syntax: 'CLUSTER SLAVES node-id',
    summary: 'List replica nodes of the specified master node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-slaves',
  },
  'CLUSTER REPLICAS': {
    syntax: 'CLUSTER REPLICAS node-id',
    summary: 'List replica nodes of the specified master node.',
    complexity: 'O(1)',
    since: '5.0.0',
    url: 'https://redis.io/commands/cluster-replicas',
  },
  'CLUSTER SLOTS': {
    syntax: 'CLUSTER SLOTS',
    summary: 'Get array of Cluster slot to node mappings.',
    complexity: 'O(N) where N is the total number of Cluster nodes.',
    since: '3.0.0',
    url: 'https://redis.io/commands/cluster-slots',
  },

  /**
   * Command
   */
  COMMAND: {
    syntax: 'COMMAND',
    summary: 'Get array of Redis command details.',
    complexity: 'O(N) where N is the total number of Redis commands.',
    since: '2.8.13',
    url: 'https://redis.io/commands/command',
  },
  'COMMAND COUNT': {
    syntax: 'COMMAND COUNT',
    summary: 'Get total number of Redis commands.',
    complexity: 'O(1)',
    since: '2.8.13',
    url: 'https://redis.io/commands/command-count',
  },
  'COMMAND GETKEYS': {
    syntax: 'COMMAND GETKEYS',
    summary: 'Extract keys given a full Redis command.',
    complexity: 'O(N) where N is the number of arguments to the command.',
    since: '2.8.13',
    url: 'https://redis.io/commands/command-getkeys',
  },
  'COMMAND INFO': {
    syntax: 'COMMAND INFO command-name [command-name ...]',
    summary: 'Get array of specific Redis command details.',
    complexity: 'O(N) when N is number of commands to look up.',
    since: '2.8.13',
    url: 'https://redis.io/commands/command-info',
  },

  /**
   * Config
   */
  CONFIG: {
    syntax: 'CONFIG GET | REWRITE | SET | RESETSTAT',
    summary: 'Configuration related commands.',
    since: '2.0.0',
    url: 'https://redis.io/topics/config',
  },
  'CONFIG GET': {
    syntax: 'CONFIG GET parameter',
    summary: 'Get the value of a configuration parameter.',
    since: '2.0.0',
    url: 'https://redis.io/commands/config-get',
  },
  'CONFIG REWRITE': {
    syntax: 'CONFIG REWRITE',
    summary: 'Rewrite the configuration file with the in memory configuration.',
    since: '2.8.0',
    url: 'https://redis.io/commands/config-rewrite',
  },
  'CONFIG SET': {
    syntax: 'CONFIG SET parameter value',
    summary: 'Set a configuration parameter to the given value.',
    since: '2.0.0',
    url: 'https://redis.io/commands/config-set',
  },
  'CONFIG RESETSTAT': {
    syntax: 'CONFIG RESETSTAT',
    summary: 'Reset the stats returned by INFO.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/config-resetstat',
  },
  COPY: {
    syntax: 'COPY source destination [DB destination-db] [REPLACE]',
    summary: 'Copy a key.',
    complexity: 'O(N) worst case for collections, where N is the number of nested items. O(1) for string values.',
    since: '6.2.0',
    url: 'https://redis.io/commands/copy',
  },
  DBSIZE: {
    syntax: 'DBSIZE',
    summary: 'Return the number of keys in the selected database.',
    since: '1.0.0',
    url: 'https://redis.io/commands/dbsize',
  },
  'DEBUG OBJECT': {
    syntax: 'DEBUG OBJECT key',
    summary: 'Get debugging information about a key.',
    warning: 'Debugging command that should not be used by clients.',
    since: '1.0.0',
    url: 'https://redis.io/commands/debug-object',
  },
  'DEBUG SEGFAULT': {
    syntax: 'DEBUG SEGFAULT',
    summary: 'Make the server crash.',
    danger: 'Performs an invalid memory access that crashes Redis.',
    since: '1.0.0',
    url: 'https://redis.io/commands/debug-segfault',
  },
  DECR: {
    syntax: 'DECR key',
    summary: 'Decrement the integer value of a key by one.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/decr',
  },
  DECRBY: {
    syntax: 'DECRBY key decrement',
    summary: 'Decrement the integer value of a key by the given number.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/decrby',
  },
  DEL: {
    syntax: 'DEL key [key ...]',
    summary: 'Delete a key.',
    complexity:
      'O(N) where N is the number of keys that will be removed. When a key to remove holds a value \
      other than a string, the individual complexity for this key is O(M) where M is the number of elements \
      in the list, set, sorted set or hash. Removing a single key that holds a string value is O(1).',
    since: '1.0.0',
    url: 'https://redis.io/commands/del',
  },
  DISCARD: {
    syntax: 'DISCARD',
    summary: 'Discard all commands issued after MULTI.',
    since: '2.0.0',
    url: 'https://redis.io/commands/discard',
  },
  DUMP: {
    syntax: 'DUMP key',
    summary: 'Return a serialized version of the value stored at the specified key.',
    complexity:
      'O(1) to access the key and additional O(N*M) to serialize it, where N is the number of \
      Redis objects composing the value and M their average size. For small string values the time \
      complexity is thus O(1)+O(1*M) where M is small, so simply O(1).',
    since: '2.6.0',
    url: 'https://redis.io/commands/dump',
  },
  ECHO: {
    syntax: 'ECHO message',
    summary: 'Echo the given string.',
    since: '1.0.0',
    url: 'https://redis.io/commands/echo',
  },
  EVAL: {
    syntax: 'EVAL script numkeys key [key ...] arg [arg ...]',
    summary: 'Execute a Lua script server side.',
    complexity: 'Depends on the script that is executed.',
    since: '2.6.0',
    url: 'https://redis.io/commands/eval',
  },
  EVALSHA: {
    syntax: 'EVALSHA sha1 numkeys key [key ...] arg [arg ...]',
    summary: 'Execute a Lua script server side.',
    complexity: 'Depends on the script that is executed.',
    since: '2.6.0',
    url: 'https://redis.io/commands/evalsha',
  },
  EXEC: {
    syntax: 'EXEC',
    summary: 'Execute all commands issued after MULTI.',
    since: '1.2.0',
    url: 'https://redis.io/commands/exec',
  },
  EXISTS: {
    syntax: 'EXISTS key [key ...]',
    summary: 'Determine if a key exists.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/exists',
  },
  EXPIRE: {
    syntax: 'EXPIRE key seconds [NX|XX|GT|LT]',
    summary: "Set a key's time to live in seconds.",
    complexity: 'O(1)',
    since: '1.0.0, >= 7.0: Added options: NX, XX, GT and LT.',
    url: 'https://redis.io/commands/expire',
  },
  EXPIREAT: {
    syntax: 'EXPIREAT key timestamp [NX|XX|GT|LT]',
    summary: 'Set the expiration for a key as a UNIX timestamp.',
    complexity: 'O(1)',
    since: '1.2.0, >= 7.0: Added options: NX, XX, GT and LT.',
    url: 'https://redis.io/commands/expireat',
  },
  FAILOVER: {
    syntax: 'FAILOVER [TO host port [FORCE]] [ABORT] [TIMEOUT milliseconds]',
    summary: 'Start a coordinated failover between this server and one of its replicas.',
    since: '6.2.0',
    url: 'https://redis.io/commands/failover',
  },
  FLUSHALL: {
    syntax: 'FLUSHALL [ASYNC|SYNC]',
    summary: 'Remove all keys from all databases.',
    complexity: 'O(N) where N is the number of keys in the selected database.',
    danger: 'May cause data loss in Production environment.',
    since: '1.0.0, >= 6.2.0: Added the ASYNC and SYNC flushing mode modifiers.',
    url: 'https://redis.io/commands/flushall',
  },
  FLUSHDB: {
    syntax: 'FLUSHDB [ASYNC|SYNC]',
    summary: 'Remove all keys from the current database.',
    complexity: 'O(N) where N is the number of keys in the selected database.',
    danger: 'May cause data loss in Production environment.',
    since: '1.0.0, >= 6.2.0: Added the ASYNC and SYNC flushing mode modifiers.',
    url: 'https://redis.io/commands/flushdb',
  },

  /**
   * Geospatial
   */
  GEOADD: {
    syntax: 'GEOADD key [NX|XX] [CH] longitude latitude member [longitude latitude member ...]',
    summary: 'Add one or more geospatial items in the geospatial index represented using a sorted set.',
    complexity: 'O(log(N)) for each item added, where N is the number of elements in the sorted set.',
    since: '3.2.0, >= 6.2: Added the CH, NX and XX options.',
    url: 'https://redis.io/commands/geoadd',
  },
  GEOHASH: {
    syntax: 'GEOHASH key member [member ...]',
    summary: 'Returns members of a geospatial index as standard geohash strings.',
    complexity: 'O(log(N)) for each member requested, where N is the number of elements in the sorted set.',
    since: '3.2.0',
    url: 'https://redis.io/commands/geohash',
  },
  GEOPOS: {
    syntax: 'GEOPOS key member [member ...]',
    summary: 'Returns longitude and latitude of members of a geospatial index.',
    complexity: 'O(log(N)) for each member requested, where N is the number of elements in the sorted set.',
    since: '3.2.0',
    url: 'https://redis.io/commands/geopos',
  },
  GEODIST: {
    syntax: 'GEODIST key member1 member2 [m|km|ft|mi]',
    summary: 'Returns the distance between two members of a geospatial index.',
    complexity: 'O(log(N))',
    since: '3.2.0',
    url: 'https://redis.io/commands/geodist',
  },
  GEORADIUS: {
    syntax:
      'GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] \
      [COUNT count [ANY]] [ASC|DESC] [STORE key] [STOREDIST key]',
    summary:
      'Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.',
    complexity:
      'O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited \
      by center and radius and M is the number of items inside the index.',
    warning:
      'As per Redis 6.2.0, GEORADIUS command family are considered deprecated. Please prefer `GEOSEARCH` and `GEOSEARCHSTORE` in new code.',
    since: '3.2.0, >= 6.2: Added the ANY option for COUNT.',
    url: 'https://redis.io/commands/georadius',
  },
  GEORADIUSBYMEMBER: {
    syntax:
      'GEORADIUSBYMEMBER key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] \
      [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]',
    summary:
      'Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.',
    complexity:
      'O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center \
      and radius and M is the number of items inside the index.',
    warning:
      'As per Redis 6.2.0, GEORADIUS command family are considered deprecated. Please prefer `GEOSEARCH` and `GEOSEARCHSTORE` in new code.',
    since: '3.2.0',
    url: 'https://redis.io/commands/georadiusbymember',
  },
  GEOSEARCH: {
    syntax:
      'GEOSEARCH key [FROMMEMBER member] [FROMLONLAT longitude latitude] [BYRADIUS radius m|km|ft|mi] \
      [BYBOX width height m|km|ft|mi] [ASC|DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST] [WITHHASH]',
    summary:
      'Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle. \
    This command comes in place of the now deprecated `GEORADIUS` and `GEORADIUSBYMEMBER`.',
    complexity:
      'O(N+log(M)) where N is the number of elements in the grid-aligned bounding box area around the shape provided as the filter and M is the number of items inside the shape.',
    since: '6.2.0',
    url: 'https://redis.io/commands/geosearch',
  },
  GEOSEARCHSTORE: {
    syntax:
      'GEOSEARCHSTORE destination source [FROMMEMBER member] [FROMLONLAT longitude latitude] [BYRADIUS radius m|km|ft|mi] \
      [BYBOX width height m|km|ft|mi] [ASC|DESC] [COUNT count [ANY]] [WITHCOORD] [WITHDIST] [WITHHASH] [STOREDIST]',
    summary:
      'Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle, and store the result in another key. \
      This command comes in place of the now deprecated `GEORADIUS` and `GEORADIUSBYMEMBER`.',
    complexity:
      'O(N+log(M)) where N is the number of elements in the grid-aligned bounding box area around the shape provided as the filter and M is the number of items inside the shape.',
    since: '6.2.0',
    url: 'https://redis.io/commands/geosearchstore',
  },
  GET: {
    syntax: 'GET key',
    summary: 'Get the value of a key.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/get',
  },
  GETBIT: {
    syntax: 'GETBIT key offset',
    summary: 'Returns the bit value at offset in the string value stored at key.',
    complexity: 'O(1)',
    since: '2.2.0',
    url: 'https://redis.io/commands/getbit',
  },
  GETDEL: {
    syntax: 'GETDEL key',
    summary: 'Get the value of a key and delete the key.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/getdel',
  },
  GETEX: {
    syntax: 'GETEX key [EX seconds|PX milliseconds|EXAT timestamp|PXAT milliseconds-timestamp|PERSIST]',
    summary: 'Get the value of a key and optionally set its expiration.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/getex',
  },
  GETRANGE: {
    syntax: 'GETRANGE key start end',
    summary: 'Get a substring of the string stored at a key.',
    complexity:
      'O(N) where N is the length of the returned string. The complexity is ultimately determined \
      by the returned length, but because creating a substring from an existing string is very cheap, \
      it can be considered O(1) for small strings.',
    since: '2.4.0',
    url: 'https://redis.io/commands/getrange',
  },
  GETSET: {
    syntax: 'GETSET key value',
    summary: 'Set the string value of a key and return its old value.',
    complexity: 'O(1)',
    warning: 'As per Redis 6.2, GETSET is considered deprecated. Please prefer `SET` with `GET` parameter in new code.',
    since: '1.0.0',
    url: 'https://redis.io/commands/getset',
  },
  HDEL: {
    syntax: 'HDEL key field [field ...]',
    summary: 'Delete one or more hash fields.',
    complexity: 'O(N) where N is the number of fields to be removed.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hdel',
  },
  HELLO: {
    syntax: 'HELLO [protover [AUTH username password] [SETNAME clientname]]',
    summary: 'Handshake with Redis.',
    complexity: 'O(1)',
    since:
      "6.0.0, >= 6.2: protover made optional; when called without arguments the command reports the current connection's context.",
    url: 'https://redis.io/commands/hello',
  },
  HEXISTS: {
    syntax: 'HEXISTS key field',
    summary: 'Determine if a hash field exists.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/hexists',
  },
  HGET: {
    syntax: 'HGET key field',
    summary: 'Get the value of a hash field.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/hget',
  },
  HGETALL: {
    syntax: 'HGETALL key',
    summary: 'Get all the fields and values in a hash.',
    complexity: 'O(N) where N is the size of the hash.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hgetall',
  },
  HINCRBY: {
    syntax: 'HINCRBY key field increment',
    summary: 'Increment the integer value of a hash field by the given number.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/hincrby',
  },
  HINCRBYFLOAT: {
    syntax: 'HINCRBYFLOAT key field increment',
    summary: 'Increment the float value of a hash field by the given amount.',
    complexity: 'O(1)',
    since: '2.6.0',
    url: 'https://redis.io/commands/hincrbyfloat',
  },
  HKEYS: {
    syntax: 'HKEYS key',
    summary: 'Get all the fields in a hash.',
    complexity: 'O(N) where N is the size of the hash.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hkeys',
  },
  HLEN: {
    syntax: 'HLEN key',
    summary: 'Get the number of fields in a hash.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/hlen',
  },
  HMGET: {
    syntax: 'HMGET key field [field ...]',
    summary: 'Get the values of all the given hash fields.',
    complexity: 'O(N) where N is the number of fields being requested.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hmget',
  },
  HMSET: {
    syntax: 'HMSET key field value [field value ...]',
    summary: 'Set multiple hash fields to multiple values.',
    complexity: 'O(N) where N is the number of fields being set.',
    warning: 'As per Redis 4.0.0, HMSET is considered deprecated. Please prefer `HSET` in new code.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hmset',
  },
  HSET: {
    syntax: 'HSET key field value [field value ...]',
    summary: 'Set the string value of a hash field.',
    complexity:
      'O(1) for each field/value pair added, so O(N) to add N field/value pairs when the \
      command is called with multiple field/value pairs.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hset',
  },
  HSETNX: {
    syntax: 'HSETNX key field value',
    summary: 'Set the value of a hash field, only if the field does not exist.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/hsetnx',
  },
  HRANDFIELD: {
    syntax: 'HRANDFIELD key [count [WITHVALUES]]',
    summary: 'Get one or multiple random fields from a hash.',
    complexity: 'O(N) where N is the number of fields returned.',
    since: '6.2.0',
    url: 'https://redis.io/commands/hrandfield',
  },
  HSTRLEN: {
    syntax: 'HSTRLEN key field',
    summary: 'Get the length of the value of a hash field.',
    complexity: 'O(1)',
    since: '3.2.0',
    url: 'https://redis.io/commands/hstrlen',
  },
  HVALS: {
    syntax: 'HVALS key',
    summary: 'Get all the values in a hash.',
    complexity: 'O(N) where N is the size of the hash.',
    since: '2.0.0',
    url: 'https://redis.io/commands/hvals',
  },
  INCR: {
    syntax: 'INCR key',
    summary: 'Increment the integer value of a key by one.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/incr',
  },
  INCRBY: {
    syntax: 'INCRBY key increment',
    summary: 'Increment the integer value of a key by the given amount.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/incrby',
  },
  INCRBYFLOAT: {
    syntax: 'INCRBYFLOAT key increment',
    summary: 'Increment the float value of a key by the given amount.',
    complexity: 'O(1)',
    since: '2.6.0',
    url: 'https://redis.io/commands/incrbyfloat',
  },
  INFO: {
    syntax: 'INFO [section]',
    summary:
      'Get information and statistics about the server: SERVER (General information about the Redis server), \
    CLIENTS (Client connections), MEMORY (Memory consumption), PERSISTENCE (RDB and AOF), STATS (General statistics), \
    REPLICATION (Master/replica replication information), CPU (CPU consumption), COMMANDSTATS (Command statistics), \
    CLUSTER (Redis Cluster), MODULES (Modules), KEYSPACE (Database related statistics), ERRORSTATS (Redis error statistics)',
    since: '1.0.0, >=6.2 Added ERRORSTATS and updated COMMANDSTATS.',
    url: 'https://redis.io/commands/info',
  },
  LOLWUT: {
    syntax: 'LOLWUT [VERSION version]',
    summary: 'Display some computer art and the Redis version.',
    since: '5.0.0',
    url: 'https://redis.io/commands/lolwut',
  },
  KEYS: {
    syntax: 'KEYS pattern',
    summary: 'Find all keys matching the given pattern.',
    warning:
      'Consider KEYS as a command that should only be used in production environments with extreme care. This command is \
      intended for debugging and special operations, such as changing your keyspace layout.',
    complexity:
      'O(N) with N being the number of keys in the database, under the assumption that the key names \
      in the database and the given pattern have limited length.',
    since: '1.0.0',
    url: 'https://redis.io/commands/keys',
  },
  LASTSAVE: {
    syntax: 'LASTSAVE',
    summary: 'Get the UNIX time stamp of the last successful save to disk.',
    since: '1.0.0',
    url: 'https://redis.io/commands/lastsave',
  },
  LINDEX: {
    syntax: 'LINDEX key index',
    summary: 'Get an element from a list by its index.',
    complexity:
      'O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for \
      the first or the last element of the list O(1).',
    since: '1.0.0',
    url: 'https://redis.io/commands/lindex',
  },
  LINSERT: {
    syntax: 'LINSERT key BEFORE|AFTER pivot element',
    summary: 'Insert an element before or after another element in a list.',
    complexity:
      'O(N) where N is the number of elements to traverse before seeing the value pivot. This means that inserting \
      somewhere on the left end on the list (head) can be considered O(1) and inserting somewhere on the right \
      end (tail) is O(N).',
    since: '2.2.0',
    url: 'https://redis.io/commands/linsert',
  },
  LLEN: {
    syntax: 'LLEN key',
    summary: 'Get the length of a list.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/llen',
  },
  LPOP: {
    syntax: 'LPOP key [count]',
    summary: 'Remove and get the first element in a list.',
    complexity: 'O(N) where N is the number of elements returned.',
    since: '1.0.0, >= 6.2: Added the count argument.',
    url: 'https://redis.io/commands/lpop',
  },
  LMPOP: {
    syntax: 'LMPOP numkeys key [key ...] LEFT|RIGHT [COUNT count]',
    summary: 'Pop elements from a list.',
    complexity: 'O(N+M) where N is the number of provided keys and M is the number of elements returned.',
    since: '7.0.0',
    url: 'https://redis.io/commands/lmpop',
  },
  BLMPOP: {
    syntax: 'BLMPOP timeout numkeys key [key ...] LEFT|RIGHT [COUNT count]',
    summary: 'Pop elements from a list, or block until one is available.',
    complexity: 'O(N+M) where N is the number of provided keys and M is the number of elements returned.',
    since: '7.0.0',
    url: 'https://redis.io/commands/blmpop',
  },
  LPOS: {
    syntax: 'LPOS key element [RANK rank] [COUNT num-matches] [MAXLEN len]',
    summary: 'Return the index of matching elements on a list.',
    complexity:
      'O(N) where N is the number of elements in the list, for the average case. When searching \
      for elements near the head or the tail of the list, or when the MAXLEN option is provided, \
      the command may run in constant time.',
    since: '6.0.6',
    url: 'https://redis.io/commands/lpos',
  },
  LPUSH: {
    syntax: 'LPUSH key element [element ...]',
    summary: 'Prepend one or multiple elements to a list.',
    complexity:
      'O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.',
    since: '1.0.0',
    url: 'https://redis.io/commands/lpush',
  },
  LPUSHX: {
    syntax: 'LPUSHX key element [element ...]',
    summary: 'Prepend an element to a list, only if the list exists.',
    complexity:
      'O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.',
    since: '2.2.0',
    url: 'https://redis.io/commands/lpushx',
  },
  LRANGE: {
    syntax: 'LRANGE key start stop',
    summary: 'Get a range of elements from a list.',
    complexity:
      'O(S+N) where S is the distance of start offset from HEAD for small lists, from nearest \
      end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.',
    since: '1.0.0',
    url: 'https://redis.io/commands/lrange',
  },
  LREM: {
    syntax: 'LREM key count element',
    summary: 'Remove elements from a list.',
    complexity: 'O(N+M) where N is the length of the list and M is the number of elements removed.',
    since: '1.0.0',
    url: 'https://redis.io/commands/lrem',
  },
  LSET: {
    syntax: 'LSET key index element',
    summary: 'Set the value of an element in a list by its index.',
    complexity:
      'O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).',
    since: '1.0.0',
    url: 'https://redis.io/commands/lset',
  },
  LTRIM: {
    syntax: 'LTRIM key start stop',
    summary: 'Trim a list to the specified range.',
    complexity: 'O(N) where N is the number of elements to be removed by the operation.',
    since: '1.0.0',
    url: 'https://redis.io/commands/ltrim',
  },
  MEMORY: {
    syntax: 'MEMORY DOCTOR | HELP | MALLOC-STATS | PURGE | STATS | USAGE',
    summary: 'Memory related commands.',
    since: '4.0.0',
    url: 'https://redis.io/topics/memory-optimization',
  },
  'MEMORY DOCTOR': {
    syntax: 'MEMORY DOCTOR',
    summary: 'Outputs memory problems report.',
    since: '4.0.0',
    url: 'https://redis.io/commands/memory-doctor',
  },
  'MEMORY HELP': {
    syntax: 'MEMORY HELP',
    summary: 'Show helpful text about the different subcommands.',
    since: '4.0.0',
    url: 'https://redis.io/commands/memory-help',
  },
  'MEMORY MALLOC-STATS': {
    syntax: 'MEMORY MALLOC-STATS',
    summary: 'Show allocator internal stats.',
    since: '4.0.0',
    url: 'https://redis.io/commands/memory-malloc-stats',
  },
  'MEMORY PURGE': {
    syntax: 'MEMORY PURGE',
    summary: 'Ask the allocator to release memory.',
    since: '4.0.0',
    url: 'https://redis.io/commands/memory-purge',
  },
  'MEMORY STATS': {
    syntax: 'MEMORY STATS',
    summary: 'Show memory usage details.',
    since: '4.0.0',
    url: 'https://redis.io/commands/memory-stats',
  },
  'MEMORY USAGE': {
    syntax: 'MEMORY USAGE key [SAMPLES count]',
    summary: 'Estimate the memory usage of a key.',
    complexity: 'O(N) where N is the number of samples.',
    since: '4.0.0',
    url: 'https://redis.io/commands/memory-usage',
  },
  MGET: {
    syntax: 'MGET key [key ...]',
    summary: 'Get the values of all the given keys.',
    complexity: 'O(N) where N is the number of keys to retrieve.',
    since: '1.0.0',
    url: 'https://redis.io/commands/mget',
  },
  MIGRATE: {
    syntax:
      'MIGRATE host port key|"" destination-db timeout [COPY] [REPLACE] [AUTH password] [AUTH2 username password] [KEYS key [key ...]]',
    summary: 'Atomically transfer a key from a Redis instance to another one.',
    complexity:
      'This command actually executes a DUMP+DEL in the source instance, and a RESTORE \
      in the target instance. See the pages of these commands for time complexity. Also an O(N) \
      data transfer between the two instances is performed.',
    since: '2.6.0',
    url: 'https://redis.io/commands/migrate',
  },

  /**
   * Module
   * @see https://redis.io/topics/modules-intro
   */
  MODULE: {
    syntax: 'MODULE LIST | LOAD | UNLOAD',
    summary:
      'Redis modules make possible to extend Redis functionality using external modules, \
    implementing new Redis commands at a speed and with features similar to what can be done inside the core itself.',
    complexity: 'O(N) where N is the number of loaded modules.',
    since: '4.0.0',
    url: 'https://redis.io/topics/modules-intro',
  },
  'MODULE LIST': {
    syntax: 'MODULE LIST',
    summary: 'List all modules loaded by the server.',
    complexity: 'O(N) where N is the number of loaded modules.',
    since: '4.0.0',
    url: 'https://redis.io/commands/module-list',
  },
  'MODULE LOAD': {
    syntax: 'MODULE LOAD path [ arg [arg ...]]',
    summary: 'Load a module.',
    complexity: 'O(1)',
    since: '4.0.0',
    url: 'https://redis.io/commands/module-load',
  },
  'MODULE UNLOAD': {
    syntax: 'MODULE UNLOAD name',
    summary: 'Unload a module.',
    complexity: 'O(1)',
    since: '4.0.0',
    url: 'https://redis.io/commands/module-unload',
  },
  MONITOR: {
    syntax: 'MONITOR',
    summary: 'Listen for all requests received by the server in real time.',
    since: '1.0.0, >= 6.2: RESET can be called to exit monitor mode.',
    danger: 'COMMAND IS NOT SUPPORTED AND WILL OVERFLOW CONNECTION POOL',
    url: 'https://redis.io/commands/monitor',
  },
  MOVE: {
    syntax: 'MOVE key db',
    summary: 'Move a key to another database.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/move',
  },
  MSET: {
    syntax: 'MSET key value [key value ...]',
    summary: 'Set multiple keys to multiple values.',
    complexity: 'O(N) where N is the number of keys to set.',
    since: '1.0.1',
    url: 'https://redis.io/commands/mset',
  },
  MSETNX: {
    syntax: 'MSETNX key value [key value ...]',
    summary: 'Set multiple keys to multiple values, only if none of the keys exist.',
    complexity: 'O(N) where N is the number of keys to set.',
    since: '1.0.1',
    url: 'https://redis.io/commands/msetnx',
  },
  MULTI: {
    syntax: 'MULTI',
    summary: 'Mark the start of a transaction block.',
    since: '1.2.0',
    url: 'https://redis.io/commands/multi',
  },
  OBJECT: {
    syntax: 'OBJECT subcommand [arguments [arguments ...]]',
    summary: 'Inspect the internals of Redis objects.',
    complexity: 'O(1) for all the currently implemented subcommands.',
    since: '2.2.3',
    url: 'https://redis.io/commands/object',
  },
  PERSIST: {
    syntax: 'PERSIST key',
    summary: 'Remove the expiration from a key.',
    complexity: 'O(1)',
    since: '2.2.0',
    url: 'https://redis.io/commands/persist',
  },
  PEXPIRE: {
    syntax: 'PEXPIRE key milliseconds [NX|XX|GT|LT]',
    summary: "Set a key's time to live in milliseconds.",
    complexity: 'O(1)',
    since: '2.6.0, >= 7.0: Added options: NX, XX, GT and LT.',
    url: 'https://redis.io/commands/pexpire',
  },
  PEXPIREAT: {
    syntax: 'PEXPIREAT key milliseconds-timestamp [NX|XX|GT|LT]',
    summary: 'Set the expiration for a key as a UNIX timestamp specified in milliseconds.',
    complexity: 'O(1)',
    since: '2.6.0, >= 7.0: Added options: NX, XX, GT and LT.',
    url: 'https://redis.io/commands/pexpireat',
  },
  PFADD: {
    syntax: 'PFADD key element [element ...]',
    summary: 'Adds the specified elements to the specified HyperLogLog.',
    complexity: 'O(1) to add every element.',
    since: '2.8.9',
    url: 'https://redis.io/commands/pfadd',
  },
  PFCOUNT: {
    syntax: 'PFCOUNT key [key ...]',
    summary: 'Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).',
    complexity:
      'O(1) with a very small average constant time when called with a single key. O(N) with N being the \
      number of keys, and much bigger constant times, when called with multiple keys.',
    since: '2.8.9',
    url: 'https://redis.io/commands/pfcount',
  },
  PFMERGE: {
    syntax: 'PFMERGE destkey sourcekey [sourcekey ...]',
    summary: 'Merge N different HyperLogLogs into a single one.',
    complexity: 'O(N) to merge N HyperLogLogs, but with high constant times.',
    since: '2.8.9',
    url: 'https://redis.io/commands/pfmerge',
  },
  PING: {
    syntax: 'PING [message]',
    summary: 'Ping the server.',
    since: '1.0.0',
    url: 'https://redis.io/commands/ping',
  },
  PSETEX: {
    syntax: 'PSETEX key milliseconds value',
    summary: 'Set the value and expiration in milliseconds of a key.',
    complexity: 'O(1)',
    since: '2.6.0',
    url: 'https://redis.io/commands/psetex',
  },
  PSUBSCRIBE: {
    syntax: 'PSUBSCRIBE pattern [pattern ...]',
    summary: 'Listen for messages published to channels matching the given patterns.',
    complexity: 'O(N) where N is the number of patterns the client is already subscribed to.',
    since: '2.0.0',
    url: 'https://redis.io/commands/psubscribe',
  },
  PUBSUB: {
    syntax: 'PUBSUB subcommand [argument [argument ...]]',
    summary: 'Inspect the state of the Pub/Sub subsystem.',
    complexity:
      'O(N) for the CHANNELS subcommand, where N is the number of active channels, and assuming \
      constant time pattern matching (relatively short channels and patterns). O(N) for the NUMSUB \
      subcommand, where N is the number of requested channels. O(1) for the NUMPAT subcommand.',
    since: '2.8.0',
    url: 'https://redis.io/commands/pubsub',
  },
  PTTL: {
    syntax: 'PTTL key',
    summary: 'Get the time to live for a key in milliseconds.',
    complexity: 'O(1)',
    since: '2.6.0',
    url: 'https://redis.io/commands/pttl',
  },
  PUBLISH: {
    syntax: 'PUBLISH channel message',
    summary: 'Post a message to a channel.',
    complexity:
      'O(N+M) where N is the number of clients subscribed to the receiving channel and M is the total \
      number of subscribed patterns (by any client).',
    since: '2.0.0',
    url: 'https://redis.io/commands/publish',
  },
  PUNSUBSCRIBE: {
    syntax: 'PUNSUBSCRIBE [pattern [pattern ...]]',
    summary: 'Stop listening for messages posted to channels matching the given patterns.',
    complexity:
      'O(N+M) where N is the number of patterns the client is already subscribed and M is the \
      number of total patterns subscribed in the system (by any client).',
    since: '2.0.0',
    url: 'https://redis.io/commands/punsubscribe',
  },
  QUIT: {
    syntax: 'QUIT',
    summary: 'Close the connection.',
    since: '1.0.0',
    url: 'https://redis.io/commands/quit',
  },
  RANDOMKEY: {
    syntax: 'RANDOMKEY',
    summary: 'Return a random key from the keyspace.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/randomkey',
  },
  READONLY: {
    syntax: 'READONLY',
    summary: 'Enables read queries for a connection to a cluster replica node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/readonly',
  },
  READWRITE: {
    syntax: 'READWRITE',
    summary: 'Disables read queries for a connection to a cluster replica node.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/readwrite',
  },
  RENAME: {
    syntax: 'RENAME key newkey',
    summary: 'Rename a key.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/rename',
  },
  RENAMENX: {
    syntax: 'RENAMENX key newkey',
    summary: 'Rename a key, only if the new key does not exist.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/renamenx',
  },
  RESET: {
    syntax: 'RESET',
    summary: 'Reset the connection.',
    since: '6.2.0',
    url: 'https://redis.io/commands/reset',
  },
  RESTORE: {
    syntax: 'RESTORE key ttl serialized-value [REPLACE] [ABSTTL] [IDLETIME seconds] [FREQ frequency]',
    summary: 'Create a key using the provided serialized value, previously obtained using DUMP.',
    complexity:
      'O(1) to create the new key and additional O(N*M) to reconstruct the serialized value, where N \
      is the number of Redis objects composing the value and M their average size. For small string values \
      the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1). However for sorted set values \
      the complexity is O(N*M*log(N)) because inserting values into sorted sets is O(log(N)).',
    since: '2.6.0',
    url: 'https://redis.io/commands/restore',
  },
  ROLE: {
    syntax: 'ROLE',
    summary: 'Return the role of the instance in the context of replication.',
    since: '2.8.12',
    url: 'https://redis.io/commands/role',
  },
  RPOP: {
    syntax: 'RPOP key [count]',
    summary: 'Remove and get the last element in a list.',
    complexity: 'O(N) where N is the number of elements returned.',
    since: '1.0.0, >= 6.2: Added the count argument.',
    url: 'https://redis.io/commands/rpop',
  },
  RPOPLPUSH: {
    syntax: 'RPOPLPUSH source destination',
    summary: 'Remove the last element in a list, prepend it to another list and return it.',
    complexity: 'O(1)',
    warning: 'As per Redis 6.2.0, RPOPLPUSH is considered deprecated. Please prefer `LMOVE` in new code.',
    since: '1.2.0',
    url: 'https://redis.io/commands/rpoplpush',
  },
  LMOVE: {
    syntax: 'LMOVE source destination LEFT|RIGHT LEFT|RIGHT',
    summary: 'Pop an element from a list, push it to another list and return it.',
    complexity: 'O(1)',
    since: '6.2.0',
    url: 'https://redis.io/commands/lmove',
  },
  RPUSH: {
    syntax: 'RPUSH key element [element ...]',
    summary: 'Append one or multiple elements to a list.',
    complexity:
      'O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.',
    since: '1.0.0',
    url: 'https://redis.io/commands/rpush',
  },
  RPUSHX: {
    syntax: 'RPUSHX key element [element ...]',
    summary: 'Append an element to a list, only if the list exists.',
    complexity:
      'O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.',
    since: '2.2.0',
    url: 'https://redis.io/commands/rpushx',
  },
  SADD: {
    syntax: 'SADD key member [member ...]',
    summary: 'Add one or more members to a set.',
    complexity:
      'O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sadd',
  },
  SAVE: {
    syntax: 'SAVE',
    summary: 'Synchronously save the dataset to disk.',
    warning: 'You almost never want to call SAVE in production environments where it will block all the other clients.',
    since: '1.0.0',
    url: 'https://redis.io/commands/save',
  },
  SCARD: {
    syntax: 'SCARD key',
    summary: 'Get the number of members in a set.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/scard',
  },
  SINTERCARD: {
    syntax: 'SINTERCARD numkeys key [key ...] [LIMIT limit]',
    summary: 'Returns the cardinality of the set which would result from the intersection of all the given sets.',
    complexity: 'O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.',
    since: '7.0.0',
    url: 'https://redis.io/commands/sintercard',
  },

  /**
   * Script
   *
   * @see https://redis.io/commands/eval
   */
  SCRIPT: {
    syntax: 'SCRIPT DEBUG | EXISTS | FLUSH | KILL | LOAD',
    summary: 'Redis Lua scripting.',
    since: '3.2.0',
    url: 'https://redis.io/commands/eval',
  },
  'SCRIPT DEBUG': {
    syntax: 'SCRIPT DEBUG YES|SYNC|NO',
    summary: 'Set the debug mode for executed scripts.',
    warning: 'Avoid debugging Lua scripts using your Redis production server. Use a development server instead.',
    complexity: 'O(1)',
    since: '3.2.0',
    url: 'https://redis.io/commands/script-debug',
  },
  'SCRIPT EXISTS': {
    syntax: 'SCRIPT EXISTS sha1 [sha1 ...]',
    summary: 'Check existence of scripts in the script cache.',
    complexity: 'O(N) with N being the number of scripts to check (so checking a single script is an O(1) operation).',
    since: '2.6.0',
    url: 'https://redis.io/commands/script-exists',
  },
  'SCRIPT FLUSH': {
    syntax: 'SCRIPT FLUSH [ASYNC|SYNC]',
    summary: 'Remove all the scripts from the script cache.',
    complexity: 'O(N) with N being the number of scripts in cache.',
    since: '2.6.0, >= 6.2.0: Added the ASYNC and SYNC flushing mode modifiers.',
    url: 'https://redis.io/commands/script-flush',
  },
  'SCRIPT KILL': {
    syntax: 'SCRIPT FLUSH',
    summary: 'Kill the script currently in execution.',
    complexity: 'O(1)',
    since: '2.6.0',
    url: 'https://redis.io/commands/script-kill',
  },
  'SCRIPT LOAD': {
    syntax: 'SCRIPT LOAD script',
    summary: 'Load the specified Lua script into the script cache.',
    complexity: 'O(N) with N being the length in bytes of the script body.',
    since: '2.6.0',
    url: 'https://redis.io/commands/script-load',
  },
  SDIFF: {
    syntax: 'SDIFF key [key ...]',
    summary: 'Subtract multiple sets.',
    complexity: 'O(N) where N is the total number of elements in all given sets.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sdiff',
  },
  SDIFFSTORE: {
    syntax: 'SDIFFSTORE destination key [key ...]',
    summary: 'Subtract multiple sets and store the resulting set in a key.',
    complexity: 'O(N) where N is the total number of elements in all given sets.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sdiffstore',
  },
  SELECT: {
    syntax: 'SELECT index',
    summary: 'Change the selected database for the current connection.',
    since: '1.0.0',
    url: 'https://redis.io/commands/select',
  },
  SET: {
    syntax: 'SET key value [EX seconds|PX milliseconds] [NX|XX] [KEEPTTL]',
    summary: 'Set the string value of a key.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/set',
  },
  SETBIT: {
    syntax: 'SETBIT key offset value',
    summary: 'Sets or clears the bit at offset in the string value stored at key.',
    complexity: 'O(1)',
    since: '2.2.0',
    url: 'https://redis.io/commands/setbit',
  },
  SETEX: {
    syntax: 'SETEX key seconds value',
    summary: 'Set the value and expiration of a key.',
    complexity: 'O(1)',
    since: '2.0.0',
    url: 'https://redis.io/commands/setex',
  },
  SETNX: {
    syntax: 'SETNX key value',
    summary: 'Set the value of a key, only if the key does not exist.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/setnx',
  },
  SETRANGE: {
    syntax: 'SETRANGE key offset value',
    summary: 'Overwrite part of a string at key starting at the specified offset.',
    complexity:
      'O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the \
      amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.',
    since: '2.2.0',
    url: 'https://redis.io/commands/setrange',
  },
  SHUTDOWN: {
    syntax: 'SHUTDOWN [NOSAVE|SAVE]',
    summary: 'Synchronously save the dataset to disk and then shut down the server.',
    danger: 'May cause data loss in Production environment.',
    since: '1.0.0',
    url: 'https://redis.io/commands/shutdown',
  },
  SINTER: {
    syntax: 'SINTER key [key ...]',
    summary: 'Intersect multiple sets.',
    complexity: 'O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sinter',
  },
  SINTERSTORE: {
    syntax: 'SINTERSTORE destination key [key ...]',
    summary: 'Intersect multiple sets and store the resulting set in a key.',
    complexity: 'O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sinterstore',
  },
  SISMEMBER: {
    syntax: 'SISMEMBER key member',
    summary: 'Determine if a given value is a member of a set.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/sismember',
  },
  SMISMEMBER: {
    syntax: 'SMISMEMBER key member [member ...]',
    summary: 'Returns the membership associated with the given elements for a set.',
    complexity: 'O(N) where N is the number of elements being checked for membership.',
    since: '6.2.0',
    url: 'https://redis.io/commands/smismember',
  },
  SLAVEOF: {
    syntax: 'SLAVEOF host port',
    summary:
      'Make the server a replica of another instance, or promote it as master. Deprecated starting with Redis 5. Use REPLICAOF instead.',
    since: '1.0.0',
    url: 'https://redis.io/commands/slaveof',
  },
  REPLICAOF: {
    syntax: 'REPLICAOF host port',
    summary: 'Make the server a replica of another instance, or promote it as master.',
    since: '5.0.0',
    url: 'https://redis.io/commands/replicaof',
  },
  SLOWLOG: {
    syntax: 'SLOWLOG subcommand [argument]',
    summary: 'Manages the Redis slow queries log.',
    since: '2.2.12',
    url: 'https://redis.io/commands/slowlog',
  },
  SMEMBERS: {
    syntax: 'SMEMBERS key',
    summary: 'Get all the members in a set.',
    complexity: 'O(N) where N is the set cardinality.',
    since: '1.0.0',
    url: 'https://redis.io/commands/smembers',
  },
  SMOVE: {
    syntax: 'SMOVE source destination member',
    summary: 'Move a member from one set to another.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/smove',
  },
  SORT: {
    syntax:
      'SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]',
    summary: 'Sort the elements in a list, set or sorted set.',
    complexity:
      'O(N+M*log(M)) where N is the number of elements in the list or set to sort, and M \
      the number of returned elements. When the elements are not sorted, complexity is \
      currently O(N) as there is a copy step that will be avoided in next releases.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sort',
  },
  SORT_RO: {
    syntax: 'SORT_RO key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA]',
    summary: 'Sort the elements in a list, set or sorted set. Read-only variant of SORT.',
    complexity:
      'O(N+M*log(M)) where N is the number of elements in the list or set to sort, and M the number of \
      returned elements. When the elements are not sorted, complexity is O(N).',
    since: '7.0.0',
    url: 'https://redis.io/commands/sort_ro',
  },
  SPOP: {
    syntax: 'SPOP key [count]',
    summary: 'Remove and return one or multiple random members from a set.',
    complexity: 'O(1)',
    since: '1.0.0, >= 3.2: Added the count argument.',
    url: 'https://redis.io/commands/spop',
  },
  SRANDMEMBER: {
    syntax: 'SRANDMEMBER key [count]',
    summary: 'Get one or multiple random members from a set.',
    complexity: 'Without the count argument O(1), otherwise O(N) where N is the absolute value of the passed count.',
    since: '1.0.0',
    url: 'https://redis.io/commands/srandmember',
  },
  SREM: {
    syntax: 'SREM key member [member ...]',
    summary: 'Remove one or more members from a set.',
    complexity: 'O(N) where N is the number of members to be removed.',
    since: '1.0.0',
    url: 'https://redis.io/commands/srem',
  },
  STRALGO: {
    syntax: 'STRALGO LCS algo-specific-argument [algo-specific-argument ...]',
    summary: 'Run algorithms (currently LCS) against strings.',
    complexity: 'For LCS O(strlen(s1)*strlen(s2)).',
    since: '6.0.0',
    url: 'https://redis.io/commands/stralgo',
  },
  STRLEN: {
    syntax: 'STRLEN key',
    summary: 'Get the length of the value stored in a key.',
    complexity: 'O(1)',
    since: '2.2.0',
    url: 'https://redis.io/commands/strlen',
  },
  SUBSCRIBE: {
    syntax: 'SUBSCRIBE channel [channel ...]',
    summary: 'Listen for messages published to the given channels.',
    complexity: 'O(N) where N is the number of channels to subscribe to.',
    since: '2.0.0, >= 6.2: RESET can be called to exit subscribed state.',
    url: 'https://redis.io/commands/subscribe',
  },
  SUNION: {
    syntax: 'SUNION key [key ...]',
    summary: 'Add multiple sets.',
    complexity: 'O(N) where N is the total number of elements in all given sets.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sunion',
  },
  SUNIONSTORE: {
    syntax: 'SUNIONSTORE destination key [key ...]',
    summary: 'Add multiple sets and store the resulting set in a key.',
    complexity: 'O(N) where N is the total number of elements in all given sets.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sunionstore',
  },
  SWAPDB: {
    syntax: 'SWAPDB index1 index2',
    summary: 'Swaps two Redis databases.',
    complexity: 'O(N) where N is the count of clients watching or blocking on keys from both databases.',
    since: '4.0.0',
    url: 'https://redis.io/commands/swapdb',
  },
  SYNC: {
    syntax: 'SYNC',
    summary: 'Internal command used for replication.',
    since: '1.0.0',
    url: 'https://redis.io/commands/sync',
  },
  PSYNC: {
    syntax: 'PSYNC replicationid offset',
    summary: 'Internal command used for replication.',
    since: '2.8.0',
    url: 'https://redis.io/commands/psync',
  },
  TIME: {
    syntax: 'TIME',
    summary: 'Return the current server time.',
    complexity: 'O(1)',
    since: '2.6.0',
    url: 'https://redis.io/commands/time',
  },
  TOUCH: {
    syntax: 'TOUCH key [key ...]',
    summary: 'Alters the last access time of a key(s). Returns the number of existing keys specified.',
    complexity: 'O(N) where N is the number of keys that will be touched.',
    since: '3.2.1',
    url: 'https://redis.io/commands/touch',
  },
  TTL: {
    syntax: 'TTL key',
    summary: 'Get the time to live for a key.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/ttl',
  },
  TYPE: {
    syntax: 'TYPE key',
    summary: 'Determine the type stored at key.',
    complexity: 'O(1)',
    since: '1.0.0',
    url: 'https://redis.io/commands/type',
  },
  UNSUBSCRIBE: {
    syntax: 'UNSUBSCRIBE [channel [channel ...]]',
    summary: 'Stop listening for messages posted to the given channels.',
    complexity: 'O(N) where N is the number of clients already subscribed to a channel.',
    since: '2.0.0',
    url: 'https://redis.io/commands/unsubscribe',
  },
  UNLINK: {
    syntax: 'UNLINK key [key ...]',
    summary: 'Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.',
    complexity:
      'O(1) for each key removed regardless of its size. Then the command does O(N) work in a different thread \
      in order to reclaim memory, where N is the number of allocations the deleted objects where composed of.',
    since: '4.0.0',
    url: 'https://redis.io/commands/unlink',
  },
  UNWATCH: {
    syntax: 'UNWATCH',
    summary: 'Forget about all watched keys.',
    complexity: 'O(1)',
    since: '2.2.0',
    url: 'https://redis.io/commands/unwatch',
  },
  WAIT: {
    syntax: 'WAIT numreplicas timeout',
    summary:
      'Wait for the synchronous replication of all the write commands sent in the context of the current connection.',
    complexity: 'O(1)',
    since: '3.0.0',
    url: 'https://redis.io/commands/wait',
  },
  WATCH: {
    syntax: 'WATCH key [key ...]',
    summary: 'Watch the given keys to determine execution of the MULTI/EXEC block.',
    complexity: 'O(1) for every key.',
    since: '2.2.0',
    url: 'https://redis.io/commands/watch',
  },

  /**
   * Sorted Set
   */
  ZADD: {
    syntax: 'ZADD key [NX|XX] [GT|LT] [CH] [INCR] score member [score member ...]',
    summary: 'Add one or more members to a sorted set, or update its score if it already exists.',
    complexity: 'O(log(N)) for each item added, where N is the number of elements in the sorted set.',
    since: '1.2.0, >= 6.2: Added the GT and LT options.',
    url: 'https://redis.io/commands/zadd',
  },
  ZCARD: {
    syntax: 'ZCARD key',
    summary: 'Get the number of members in a sorted set.',
    complexity: 'O(1)',
    since: '1.2.0',
    url: 'https://redis.io/commands/zcard',
  },
  ZINTERCARD: {
    syntax: 'ZINTERCARD numkeys key [key ...] [LIMIT limit]',
    summary:
      'This command is similar to ZINTER, but instead of returning the result set, it returns just the cardinality of the result.',
    complexity:
      'O(N*K) worst case with N being the smallest input sorted set, K being the number of input sorted sets.',
    since: '7.0.0',
    url: 'https://redis.io/commands/zintercard',
  },
  ZCOUNT: {
    syntax: 'ZCOUNT key min max',
    summary: 'Count the members in a sorted set with scores within the given values.',
    complexity: 'O(log(N)) with N being the number of elements in the sorted set.',
    since: '2.0.0',
    url: 'https://redis.io/commands/zcount',
  },
  ZDIFF: {
    syntax: 'ZDIFF numkeys key [key ...] [WITHSCORES]',
    summary: 'Subtract multiple sorted sets.',
    complexity:
      'O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zdiff',
  },
  ZDIFFSTORE: {
    syntax: 'ZDIFFSTORE destination numkeys key [key ...]',
    summary:
      'O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.',
    complexity:
      'O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zdiffstore',
  },
  ZINCRBY: {
    syntax: 'ZINCRBY key increment member',
    summary: 'Increment the score of a member in a sorted set.',
    complexity: 'O(log(N)) where N is the number of elements in the sorted set.',
    since: '1.2.0',
    url: 'https://redis.io/commands/zincrby',
  },
  ZINTER: {
    syntax: 'ZINTER numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]',
    summary: 'Intersect multiple sorted sets.',
    complexity:
      'O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of \
      input sorted sets and M being the number of elements in the resulting sorted set.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zinter',
  },
  ZINTERSTORE: {
    syntax: 'ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]',
    summary: 'Intersect multiple sorted sets and store the resulting sorted set in a new key.',
    complexity:
      'O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of input \
      sorted sets and M being the number of elements in the resulting sorted set.',
    since: '2.0.0',
    url: 'https://redis.io/commands/zinterstore',
  },
  ZLEXCOUNT: {
    syntax: 'ZLEXCOUNT key min max',
    summary: 'Count the number of members in a sorted set between a given lexicographical range.',
    complexity: 'O(log(N)) with N being the number of elements in the sorted set.',
    since: '2.8.9',
    url: 'https://redis.io/commands/zlexcount',
  },
  ZPOPMAX: {
    syntax: 'ZPOPMAX key [count]',
    summary: 'Remove and return members with the highest scores in a sorted set.',
    complexity:
      'O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.',
    since: '5.0.0',
    url: 'https://redis.io/commands/zpopmax',
  },
  ZPOPMIN: {
    syntax: 'ZPOPMIN key [count]',
    summary: 'Remove and return members with the lowest scores in a sorted set.',
    complexity:
      'O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.',
    since: '5.0.0',
    url: 'https://redis.io/commands/zpopmin',
  },
  ZRANDMEMBER: {
    syntax: 'ZRANDMEMBER key [count [WITHSCORES]]',
    summary: 'Get one or multiple random elements from a sorted set.',
    complexity: 'O(N) where N is the number of elements returned.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zrandmember',
  },
  ZRANGESTORE: {
    syntax: 'ZRANGESTORE dst src min max [BYSCORE|BYLEX] [REV] [LIMIT offset count]',
    summary: 'Store a range of members from sorted set into another key.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements stored into the destination key.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zrangestore',
  },
  ZRANGE: {
    syntax: 'ZRANGE key min max [BYSCORE|BYLEX] [REV] [LIMIT offset count] [WITHSCORES]',
    summary: 'Return a range of members in a sorted set, by index.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.',
    since: '1.2.0, >= 6.2: Added the REV, BYSCORE, BYLEX and LIMIT options.',
    url: 'https://redis.io/commands/zrange',
  },
  ZRANGEBYLEX: {
    syntax: 'ZRANGEBYLEX key min max [LIMIT offset count]',
    summary: 'Return a range of members in a sorted set, by lexicographical range.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being \
      returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).',
    since: '2.8.9',
    warning:
      'As per Redis 6.2.0, this command is considered deprecated. Please prefer using the `ZRANGE` command with the `BYLEX` argument in new code.',
    url: 'https://redis.io/commands/zrangebylex',
  },
  ZREVRANGEBYLEX: {
    syntax: 'ZREVRANGEBYLEX key max min [LIMIT offset count]',
    summary:
      'Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. \
      If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).',
    since: '2.8.9',
    warning:
      'As per Redis 6.2.0, this command is considered deprecated. Please prefer using the `ZRANGE` command with the `BYLEX` and `REV` arguments in new code.',
    url: 'https://redis.io/commands/zrevrangebylex',
  },
  ZRANGEBYSCORE: {
    syntax: 'ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]',
    summary: 'Return a range of members in a sorted set, by score.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. \
      If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).',
    since: '1.0.5',
    warning:
      'As per Redis 6.2.0, this command is considered deprecated. Please prefer using the `ZRANGE` command with the `BYSCORE` argument in new code.',
    url: 'https://redis.io/commands/zrangebyscore',
  },
  ZRANK: {
    syntax: 'ZRANK key member',
    summary: 'Determine the index of a member in a sorted set.',
    complexity: 'O(log(N))',
    since: '2.0.0',
    url: 'https://redis.io/commands/zrank',
  },
  ZREM: {
    syntax: 'ZREM key member [member ...]',
    summary: 'Remove one or more members from a sorted set.',
    complexity:
      'O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.',
    since: '1.2.0',
    url: 'https://redis.io/commands/zrem',
  },
  ZREMRANGEBYLEX: {
    syntax: 'ZREMRANGEBYLEX key min max',
    summary: 'Remove all members in a sorted set between the given lexicographical range.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.',
    since: '2.8.9',
    url: 'https://redis.io/commands/zremrangebylex',
  },
  ZREMRANGEBYRANK: {
    syntax: 'ZREMRANGEBYRANK key start stop',
    summary: 'Remove all members in a sorted set within the given indexes.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.',
    since: '2.0.0',
    url: 'https://redis.io/commands/zremrangebyrank',
  },
  ZREMRANGEBYSCORE: {
    syntax: 'ZREMRANGEBYSCORE key min max',
    summary: 'Remove all members in a sorted set within the given scores.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.',
    since: '1.2.0',
    url: 'https://redis.io/commands/zremrangebyscore',
  },
  ZREVRANGE: {
    syntax: 'ZREVRANGE key start stop [WITHSCORES]',
    summary: 'Return a range of members in a sorted set, by index, with scores ordered from high to low.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.',
    since: '1.2.0',
    url: 'https://redis.io/commands/zrevrange',
  },
  ZREVRANGEBYSCORE: {
    syntax: 'ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]ZREVRANGE key start stop [WITHSCORES]',
    summary: 'Return a range of members in a sorted set, by score, with scores ordered from high to low.',
    complexity:
      'O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. \
      If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).',
    since: '2.2.0',
    warning:
      'As per Redis 6.2.0, this command is considered deprecated. Please prefer using the `ZRANGE` command with the `BYSCORE` and `REV` arguments in new code.',
    url: 'https://redis.io/commands/zrevrangebyscore',
  },
  ZREVRANK: {
    syntax: 'ZREVRANK key member',
    summary: 'Determine the index of a member in a sorted set, with scores ordered from high to low.',
    complexity: 'O(log(N))',
    since: '2.0.0',
    url: 'https://redis.io/commands/zrevrank',
  },
  ZSCORE: {
    syntax: 'ZSCORE key member',
    summary: 'Get the score associated with the given member in a sorted set.',
    complexity: 'O(1)',
    since: '1.2.0',
    url: 'https://redis.io/commands/zscore',
  },
  ZUNION: {
    syntax: 'ZUNION numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]',
    summary: 'Add multiple sorted sets.',
    complexity:
      'O(N)+O(M*log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number of elements in \
      the resulting sorted set.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zunion',
  },
  ZMSCORE: {
    syntax: 'ZMSCORE key member [member ...]',
    summary: 'Get the score associated with the given members in a sorted set.',
    complexity: 'O(N) where N is the number of members being requested.',
    since: '6.2.0',
    url: 'https://redis.io/commands/zmscore',
  },
  ZUNIONSTORE: {
    syntax: 'ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]',
    summary: 'Add multiple sorted sets and store the resulting sorted set in a new key',
    complexity:
      'O(N)+O(M log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number \
      of elements in the resulting sorted set.',
    since: '2.0.0',
    url: 'https://redis.io/commands/zunionstore',
  },

  /**
   * Scan commands
   */
  SCAN: {
    syntax: 'SCAN cursor [MATCH pattern] [COUNT count] [TYPE type]',
    summary: 'Incrementally iterate the keys space.',
    complexity:
      'O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to \
      return back to 0. N is the number of elements inside the collection.',
    since: '2.8.0',
    url: 'https://redis.io/commands/scan',
  },
  SSCAN: {
    syntax: 'SSCAN key cursor [MATCH pattern] [COUNT count]',
    summary: 'Incrementally iterate Set elements.',
    complexity:
      'O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to \
      return back to 0. N is the number of elements inside the collection.',
    since: '2.8.0',
    url: 'https://redis.io/commands/sscan',
  },
  HSCAN: {
    syntax: 'HSCAN key cursor [MATCH pattern] [COUNT count]',
    summary: 'Incrementally iterate hash fields and associated values.',
    complexity:
      'O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to \
      return back to 0. N is the number of elements inside the collection.',
    since: '2.8.0',
    url: 'https://redis.io/commands/hscan',
  },
  ZSCAN: {
    syntax: 'ZSCAN key cursor [MATCH pattern] [COUNT count]',
    summary: 'Incrementally iterate sorted sets elements and associated scores.',
    complexity:
      'O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to \
      return back to 0. N is the number of elements inside the collection.',
    since: '2.8.0',
    url: 'https://redis.io/commands/zscan',
  },

  /**
   * Streams
   *
   * @see https://redis.io/topics/streams-intro
   */
  XINFO: {
    syntax: 'XINFO [CONSUMERS key groupname] [GROUPS key] [STREAM key] [HELP]',
    summary: 'Get information on streams and consumer groups.',
    complexity:
      'O(N) with N being the number of returned items for the subcommands CONSUMERS and GROUPS. The STREAM \
      subcommand is O(log N) with N being the number of items in the stream.',
    since: '5.0.0',
    url: 'https://redis.io/commands/xinfo',
  },
  XADD: {
    syntax: 'XADD key [NOMKSTREAM] [MAXLEN|MINID [=|~] threshold [LIMIT count]] *|ID field value [field value ...]',
    summary: 'Appends a new entry to a stream.',
    complexity: 'O(1) when adding a new entry, O(N) when trimming where N being the number of entires evicted.',
    since: '5.0.0, >= 6.2: Added the NOMKSTREAM option, MINID trimming strategy and the LIMIT option.',
    url: 'https://redis.io/commands/xadd',
  },
  XTRIM: {
    syntax: 'XTRIM key MAXLEN|MINID [=|~] threshold [LIMIT count]',
    summary: "Trims the stream to (approximately if '~' is passed) a certain size.",
    complexity:
      'O(N), with N being the number of evicted entries. Constant times are very small however, since \
      entries are organized in macro nodes containing multiple entries that can be released with a single deallocation.',
    since: '5.0.0, >= 6.2: Added the MINID trimming strategy and the LIMIT option.',
    url: 'https://redis.io/commands/xtrim',
  },
  XDEL: {
    syntax: 'XDEL key ID [ID ...]',
    summary:
      'Removes the specified entries from the stream. Returns the number of items actually deleted, that may be \
      different from the number of IDs passed in case certain IDs do not exist.',
    complexity: 'O(1) for each single item to delete in the stream, regardless of the stream size.',
    since: '5.0.0',
    url: 'https://redis.io/commands/xdel',
  },
  XRANGE: {
    syntax: 'XRANGE key start end [COUNT count]',
    summary: 'Return a range of elements in a stream, with IDs matching the specified IDs interval.',
    complexity:
      'O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the \
        first 10 elements with COUNT), you can consider it O(1).',
    since: '5.0.0, >= 6.2 Added exclusive ranges.',
    url: 'https://redis.io/commands/xrange',
  },
  XREVRANGE: {
    syntax: 'XREVRANGE key end start [COUNT count]',
    summary:
      'Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order \
      (from greater to smaller IDs) compared to XRANGE.',
    complexity:
      'O(N) with N being the number of elements returned. If N is constant (e.g. always asking for the first \
        10 elements with COUNT), you can consider it O(1).',
    since: '5.0.0, >= 6.2 Added exclusive ranges.',
    url: 'https://redis.io/commands/xrevrange',
  },
  XLEN: {
    syntax: 'XLEN key',
    summary: 'Return the number of entries in a stream.',
    complexity: 'O(1)',
    since: '5.0.0',
    url: 'https://redis.io/commands/xlen',
  },
  XREAD: {
    syntax: 'XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]',
    summary:
      'Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller \
      for each stream. Can block.',
    complexity:
      'For each stream mentioned: O(N) with N being the number of elements being returned, it means that XREAD-ing \
      with a fixed COUNT is O(1). Note that when the BLOCK option is used, XADD will pay O(M) time in order to \
      serve the M clients blocked on the stream getting new data.',
    since: '5.0.0',
    url: 'https://redis.io/commands/xread',
  },
  XGROUP: {
    syntax:
      'XGROUP [CREATE key groupname id-or-$] [SETID key groupname id-or-$] [DESTROY key groupname] \
    [CREATECONSUMER key groupname consumername] [DELCONSUMER key groupname consumername]',
    summary: 'Create, destroy, and manage consumer groups.',
    complexity:
      'O(1) for all the subcommands, with the exception of the DESTROY subcommand which takes an additional \
      O(M) time in order to delete the M entries inside the consumer group pending entries list (PEL).',
    since: '5.0.0',
    url: 'https://redis.io/commands/xgroup',
  },
  XREADGROUP: {
    syntax:
      'XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]',
    summary:
      'Return new entries from a stream using a consumer group, or access the history of the pending entries \
      for a given consumer. Can block.',
    complexity:
      'For each stream mentioned: O(M) with M being the number of elements returned. If M is constant (e.g. \
        always asking for the first 10 elements with COUNT), you can consider it O(1). On the other side when \
        XREADGROUP blocks, XADD will pay the O(N) time in order to serve the N clients blocked on the stream getting new data.',
    since: '5.0.0',
    url: 'https://redis.io/commands/xreadgroup',
  },
  XACK: {
    syntax: 'XACK key group ID [ID ...]',
    summary:
      'Marks a pending message as correctly processed, effectively removing it from the pending entries list of the \
      consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the \
      IDs we were actually able to resolve in the PEL.',
    complexity: 'O(1) for each message ID processed.',
    since: '5.0.0',
    url: 'https://redis.io/commands/xack',
  },
  XCLAIM: {
    syntax:
      'XCLAIM key group consumer min-idle-time ID [ID ...] [IDLE ms] [TIME ms-unix-time] [RETRYCOUNT count] [FORCE] [JUSTID]',
    summary:
      'Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer. \
      As of Redis 6.2, consumers can use the `XAUTOCLAIM` command to automatically scan and claim stale pending messages.',
    complexity: 'O(log N) with N being the number of messages in the PEL of the consumer group.',
    since: '5.0.0',
    url: 'https://redis.io/commands/xclaim',
  },
  XAUTOCLAIM: {
    syntax: 'XAUTOCLAIM key group consumer min-idle-time start [COUNT count] [JUSTID]',
    summary:
      'Changes (or acquires) ownership of messages in a consumer group, as if the messages were delivered to the specified consumer.',
    complexity: 'O(1) if COUNT is small.',
    since: '6.2.0',
    url: 'https://redis.io/commands/xautoclaim',
  },
  XPENDING: {
    syntax: 'XPENDING key group [[IDLE min-idle-time] start end count [consumer]]',
    summary:
      'Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.',
    complexity:
      'O(N) with N being the number of elements returned, so asking for a small fixed number of entries per call is O(1). O(M), where M \
      is the total number of entries scanned when used with the IDLE filter. When the command returns just the summary and the list of \
      consumers is small, it runs in O(1) time; otherwise, an additional O(N) time for iterating every consumer.',
    since: '5.0.0, >= 6.2.0: Added the IDLE option and exclusive range intervals.',
    url: 'https://redis.io/commands/xpending',
  },

  /**
   * Latency
   *
   * @see https://redis.io/topics/latency-monitor
   */
  LATENCY: {
    syntax: 'LATENCY DOCTOR | GRAPH | HISTORY | LATEST | RESET | HELP',
    summary: 'Latency Monitoring, that helps the user to check and troubleshoot possible latency problems.',
    since: '2.8.13',
    url: 'https://redis.io/topics/latency-monitor',
  },
  'LATENCY DOCTOR': {
    syntax: 'LATENCY DOCTOR',
    summary: 'Return a human readable latency analysis report.',
    since: '2.8.13',
    url: 'https://redis.io/commands/latency-doctor',
  },
  'LATENCY GRAPH': {
    syntax: 'LATENCY GRAPH event',
    summary: 'Return a latency graph for the event.',
    since: '2.8.13',
    url: 'https://redis.io/commands/latency-graph',
  },
  'LATENCY HISTORY': {
    syntax: 'LATENCY HISTORY event',
    summary: 'Return timestamp-latency samples for the event.',
    since: '2.8.13',
    url: 'https://redis.io/commands/latency-history',
  },
  'LATENCY LATEST': {
    syntax: 'LATENCY LATEST',
    summary: 'Return the latest latency samples for all events.',
    since: '2.8.13',
    url: 'https://redis.io/commands/latency-latest',
  },
  'LATENCY RESET': {
    syntax: 'LATENCY RESET [event [event ...]]',
    summary: 'Reset latency data for one or more events.',
    since: '2.8.13',
    url: 'https://redis.io/commands/latency-reset',
  },
  'LATENCY HELP': {
    syntax: 'LATENCY HELP',
    summary: 'Show helpful text about the different subcommands.',
    since: '2.8.13',
    url: 'https://redis.io/commands/latency-help',
  },

  /**
   * Redis 7
   */
  EXPIRETIME: {
    syntax: 'EXPIRETIME key',
    summary:
      'Returns the absolute Unix timestamp (since January 1, 1970) in seconds at which the given key will expire.',
    since: '7.0.0',
    url: 'https://redis.io/commands/expiretime',
  },
  PEXPIRETIME: {
    syntax: 'PEXPIRETIME key',
    summary:
      'Returns the absolute Unix timestamp (since January 1, 1970) in milliseconds at which the given key will expire.',
    since: '7.0.0',
    url: 'https://redis.io/commands/pexpiretime',
  },
  EVAL_RO: {
    syntax: 'EVAL_RO script numkeys key [key ...] arg [arg ...]',
    summary: "This is a read-only variant of the EVAL command that isn't allowed to execute commands that modify data.",
    since: '7.0.0',
    url: 'https://redis.io/commands/eval_ro',
  },
  EVALSHA_RO: {
    syntax: 'EVALSHA_RO sha1 numkeys key [key ...] arg [arg ...]',
    summary:
      "This is a read-only variant of the EVALSHA command that isn't allowed to execute commands that modify data.",
    since: '7.0.0',
    url: 'https://redis.io/commands/evalsha_ro',
  },
  ZMPOP: {
    syntax: 'ZMPOP numkeys key [key ...] MIN|MAX [COUNT count]',
    summary:
      'Pops one or more elements, that are member-score pairs, from the first non-empty sorted set in the provided list of key names.',
    since: '7.0.0',
    complexity:
      'O(K) + O(N*log(M)) where K is the number of provided keys, N being the number of elements in the sorted set, and M being the number of elements popped.',
    url: 'https://redis.io/commands/zmpop',
  },
  BZMPOP: {
    syntax: 'BZMPOP timeout numkeys key [key ...] MIN|MAX [COUNT count]',
    summary: 'BZMPOP is the blocking variant of ZMPOP.',
    since: '7.0.0',
    complexity:
      'O(K) + O(N*log(M)) where K is the number of provided keys, N being the number of elements in the sorted set, and M being the number of elements popped.',
    url: 'https://redis.io/commands/bzmpop',
  },
};

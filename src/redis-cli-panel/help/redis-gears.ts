import { HelpCommand } from '../types';

/**
 * RedisGears
 *
 * @see https://oss.redislabs.com/redisgears
 */
export const RedisGearsHelp: { [key: string]: HelpCommand } = {
  RG: {
    syntax:
      'RG.ABORTEXECUTION, RG.CONFIGGET, RG.CONFIGSET, RG.DROPEXECUTION, RG.DUMPEXECUTIONS, RG.DUMPREGISTRATIONS, \
    RG.GETEXECUTION, RG.GETRESULTS, RG.GETRESULTSBLOCKING, RG.INFOCLUSTER, RG.PYEXECUTE, RG.PYSTATS, RG.PYDUMPREQS, \
    RG.REFRESHCLUSTER, RG.TRIGGER, RG.UNREGISTER',
    summary: 'RedisGears is a serverless engine for transaction, batch and event-driven data processing in Redis.',
    url: 'https://oss.redislabs.com/redisgears',
  },
  'RG ABORTEXECUTION': {
    syntax: 'RG.ABORTEXECUTION <id>',
    summary: 'Abort the execution of a function in mid-flight.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgabortexecution',
  },
  'RG CONFIGGET': {
    syntax: 'RG.CONFIGGET <key> [...]',
    summary: 'Return the value of one or more built-in configuration or a user-defined options.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgconfigget',
  },
  'RG CONFIGSET': {
    syntax: 'RG.CONFIGSET <key> <value> [...]',
    summary: 'Set the value of one ore more built-in configuration or a user-defined options.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgconfigset',
  },
  'RG DROPEXECUTION': {
    syntax: 'RG.DROPEXECUTION <id>',
    summary: 'Remove the execution of a function from the executions list.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgdropexecution',
  },
  'RG DUMPEXECUTIONS': {
    syntax: 'RG.DUMPEXECUTIONS',
    summary:
      "Output the list of function executions . The executions list's length is capped by the MaxExecutions configuration option.",
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgdumpexecutions',
  },
  'RG DUMPREGISTRATIONS': {
    syntax: 'RG.DUMPREGISTRATIONS',
    summary: 'Output the list of function registrations.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgdumpregistrations',
  },
  'RG GETEXECUTION': {
    syntax: 'RG.GETEXECUTION <id> [SHARD|CLUSTER]',
    summary: "Return the execution execution details of a function that's in the executions list.",
    url: 'https://oss.redislabs.com/redisgears/commands.html#rggetexecution',
  },
  'RG GETRESULTS': {
    syntax: 'RG.GETRESULTS <id>',
    summary:
      "Return the results and errors from of the execution execution details of a function that's in the executions list.",
    url: 'https://oss.redislabs.com/redisgears/commands.html#rggetresults',
  },
  'RG GETRESULTSBLOCKING': {
    syntax: 'RG.GETRESULTSBLOCKING <id>',
    summary: 'Cancel the UNBLOCKING argument of the RG.PYEXECUTE command.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rggetresultsblocking',
  },
  'RG INFOCLUSTER': {
    syntax: 'RG.INFOCLUSTER',
    summary: 'Output information about the cluster.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rginfocluster',
  },
  'RG PYEXECUTE': {
    syntax: 'RG.PYEXECUTE "<function>" [UNBLOCKING] [REQUIREMENTS "<dep> ..."]',
    summary: 'Execute a Python function.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgpyexecute',
  },
  'RG PYSTATS': {
    syntax: 'RG.PYSTATS',
    summary: 'Return memory usage statistics from the Python interpreter.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgpystats',
  },
  'RG PYDUMPREQS': {
    syntax: 'RG.PYDUMPREQS',
    summary: 'Return a list of all the python requirements available (with information about each requirement).',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgpydumpreqs',
  },
  'RG REFRESHCLUSTER': {
    syntax: "Refresh the node's view of the cluster's topology.",
    summary: 'RG.REFRESHCLUSTER',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgrefreshcluster',
  },
  'RG TRIGGER': {
    syntax: 'RG.TRIGGER <trigger> [arg ...]',
    summary: 'Trigger the execution of a registered CommandReader function.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgtrigger',
  },
  'RG UNREGISTER': {
    syntax: 'RG.UNREGISTER <id>',
    summary: 'Remove the registration of a function.',
    url: 'https://oss.redislabs.com/redisgears/commands.html#rgunregister',
  },
};

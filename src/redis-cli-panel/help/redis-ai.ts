import { HelpCommand } from '../types';

/**
 * RedisAI
 *
 * @see https://oss.redislabs.com/redisai/
 */
export const RedisAIHelp: { [key: string]: HelpCommand } = {
  AI: {
    syntax:
      'AI.TENSORSET, AI.TENSORGET, AI.MODELSET, AI.MODELGET, AI.MODELDEL, AI.MODELRUN, AI.SCRIPTSET, AI.SCRIPTGET, \
      AI.SCRIPTDEL, AI.SCRIPTRUN, AI.DAGRUN, AI.DAGRUN_RO, AI.INFO, AI.CONFIG',
    summary: 'RedisAI is a Redis module for executing Deep Learning/Machine Learning models and managing their data.',
    url: 'https://oss.redislabs.com/redisai/',
  },
  'AI TENSORSET': {
    syntax: 'AI.TENSORSET <key> <type> <shape> [shape ...] [BLOB <data> | VALUES <val> [val ...]]',
    summary: 'Store a tensor as the value of a key.',
    url: 'https://oss.redislabs.com/redisai/commands/#aitensorset',
  },
  'AI TENSORGET': {
    syntax: 'AI.TENSORGET <key> [META] [format]',
    summary: "Return a tensor stored as key's value.",
    url: 'https://oss.redislabs.com/redisai/commands/#aitensorget',
  },
  'AI MODELSET': {
    syntax:
      'AI.MODELSET <key> <backend> <device> [TAG tag] [BATCHSIZE n [MINBATCHSIZE m]] \
    [INPUTS <name> ...] [OUTPUTS name ...] BLOB <model>',
    summary: 'Store a model as the value of a key.',
    url: 'https://oss.redislabs.com/redisai/commands/#aimodelset',
  },
  'AI MODELGET': {
    syntax: 'AI.MODELGET <key> [META] [BLOB]',
    summary: "Return a model's metadata and blob stored as a key's value.",
    url: 'https://oss.redislabs.com/redisai/commands/#aimodelget',
  },
  'AI MODELDEL': {
    syntax: 'AI.MODELDEL <key>',
    summary: "Delete a model stored as a key's value.",
    url: 'https://oss.redislabs.com/redisai/commands/#aimodeldel',
  },
  'AI MODELRUN': {
    syntax: 'AI.MODELRUN <key> INPUTS <input> [input ...] OUTPUTS <output> [output ...]',
    summary: "Run a model stored as a key's value using its specified backend and device.",
    warning: 'Intermediate memory overhead.',
    url: 'https://oss.redislabs.com/redisai/commands/#aimodelrun',
  },
  'AI SCRIPTSET': {
    syntax: 'AI.SCRIPTSET <key> <device> [TAG tag] SOURCE "<script>"',
    summary: 'Store a TorchScript as the value of a key.',
    url: 'https://oss.redislabs.com/redisai/commands/#aiscriptset',
  },
  'AI SCRIPTGET': {
    syntax: 'AI.SCRIPTGET <key> [META] [SOURCE]',
    summary: "Return the TorchScript stored as a key's value.",
    url: 'https://oss.redislabs.com/redisai/commands/#aiscriptget',
  },
  'AI SCRIPTDEL': {
    syntax: 'AI.SCRIPTDEL <key>',
    summary: "Delete a script stored as a key's value.",
    url: 'https://oss.redislabs.com/redisai/commands/#aiscriptdel',
  },
  'AI SCRIPTRUN': {
    syntax: 'AI.SCRIPTRUN <key> <function> INPUTS <input> [input ...] OUTPUTS <output> [output ...]',
    summary: "Run a script stored as a key's value on its specified device.",
    warning: 'Intermediate memory overhead.',
    url: 'https://oss.redislabs.com/redisai/commands/#aiscriptrun',
  },
  'AI DAGRUN': {
    syntax:
      'AI.DAGRUN [LOAD <n> <key-1> <key-2> ... <key-n>] [PERSIST <n> <key-1> <key-2> ... <key-n>] \
    |> <command> [|>  command ...]',
    summary: 'Specify a direct acyclic graph of operations to run within RedisAI.',
    warning: 'Intermediate memory overhead.',
    url: 'https://oss.redislabs.com/redisai/commands/#aidagrun',
  },
  'AI DAGRUN_RO': {
    syntax: 'AI.DAGRUN_RO [LOAD <n> <key-1> <key-2> ... <key-n>] |> <command> [|>  command ...]',
    summary: 'Read-only variant of AI.DAGRUN.',
    url: 'https://oss.redislabs.com/redisai/commands/#aidagrun_ro',
  },
  'AI INFO': {
    syntax: 'AI.INFO <key> [RESETSTAT]',
    summary: 'Return information about the execution a model or a script.',
    url: 'https://oss.redislabs.com/redisai/commands/#aiinfo',
  },
  'AI CONFIG': {
    syntax: 'AI.CONFIG <BACKENDSPATH <path>> | <LOADBACKEND <backend> <path>>',
    summary: 'Set the value of configuration directives at run-time, and allows loading DL/ML backends dynamically.',
    url: 'https://oss.redislabs.com/redisai/commands/#aiconfig',
  },
};

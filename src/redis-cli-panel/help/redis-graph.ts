import { HelpCommand } from '../types';

/**
 * RedisGraph
 *
 * @see https://oss.redislabs.com/redisgraph/
 */
export const RedisGraphHelp: { [key: string]: HelpCommand } = {
  GRAPH: {
    syntax: 'GRAPH.QUERY, GRAPH.PROFILE, GRAPH.DELETE, GRAPH.EXPLAIN, GRAPH.SLOWLOG, GRAPH.CONFIG',
    summary:
      'RedisGraph is the first queryable Property Graph database to use sparse matrices to represent the \
    adjacency matrix in graphs and linear algebra to query the graph.',
    url: 'https://oss.redislabs.com/redisgraph/',
  },
  'GRAPH QUERY': {
    syntax: 'GRAPH.QUERY <graph name> {query}',
    summary: 'Executes the given query against a specified graph.',
    url: 'https://oss.redislabs.com/redisgraph/commands/#graphquery',
  },
  'GRAPH PROFILE': {
    syntax: 'GRAPH.PROFILE <graph name> {query}',
    summary: "Executes a query and produces an execution plan augmented with metrics for each operation's execution.",
    url: 'https://oss.redislabs.com/redisgraph/commands/#graphprofile',
  },
  'GRAPH DELETE': {
    syntax: 'GRAPH.DELETE <graph name>',
    summary: 'Completely removes the graph and all of its entities.',
    url: 'https://oss.redislabs.com/redisgraph/commands/#graphdelete',
  },
  'GRAPH EXPLAIN': {
    syntax: 'GRAPH.EXPLAIN <graph name> {query}',
    summary:
      'Constructs a query execution plan but does not run it. Inspect this execution plan to better \
    understand how your query will get executed.',
    url: 'https://oss.redislabs.com/redisgraph/commands/#graphexplain',
  },
  'GRAPH SLOWLOG': {
    syntax: 'GRAPH.SLOWLOG <graph name>',
    summary: 'Returns a list containing up to 10 of the slowest queries issued against the given graph ID.',
    url: 'https://oss.redislabs.com/redisgraph/commands/#graphslowlog',
  },
  'GRAPH CONFIG': {
    syntax: 'GRAPH.CONFIG GET/SET <config name> [value] value',
    summary: 'Retrieves or updates a RedisGraph configuration.',
    url: 'https://oss.redislabs.com/redisgraph/commands/#graphconfig',
  },
};

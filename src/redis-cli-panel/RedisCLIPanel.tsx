import { css, cx } from 'emotion';
import React from 'react';
import AutoScrollingTextarea from 'redis-cli-panel/AutoScrollingTextArea';
import { Observable } from 'rxjs';
import { map as map$, switchMap as switchMap$ } from 'rxjs/operators';
import { DataFrame, DataQueryRequest, DataQueryResponse, PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Button, stylesFactory } from '@grafana/ui';
import { PanelOptions, RedisQuery } from './types';

/**
 * Redis CLI Panel
 */
export const RedisCLIPanel: React.FC<PanelProps<PanelOptions>> = ({
  options,
  data,
  width,
  height,
  onOptionsChange,
  replaceVariables,
}) => {
  const { query, output } = options;
  const styles = getStyles();

  /**
   * Run Query
   *
   * @param event {any} Event
   */
  const runQuery = async (event: any) => {
    /**
     * Return if not Enter or no query
     */
    if (event.key !== 'Enter' || !query) {
      return;
    }

    /**
     * Get configured Data Source Id
     */
    const targets = data.request?.targets;
    let datasource = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    } else {
      return onOptionsChange({ ...options, output: 'Unknown Data Source' });
    }

    /**
     * Get Data Source
     */
    const ds = await getDataSourceSrv().get(datasource);

    /**
     * Query
     */
    const res = await ((ds.query({
      targets: [{ query: replaceVariables(query) }],
    } as DataQueryRequest<RedisQuery>) as unknown) as Observable<DataQueryResponse>)
      .pipe(
        switchMap$((response) => response.data),
        switchMap$((data: DataFrame) => data.fields),
        map$((field) =>
          field.values.toArray().map((value) => {
            return value;
          })
        )
      )
      .toPromise();

    /**
     * Result
     */
    let result = `${ds.name}> ${query}\n`;
    if (res && res.length) {
      result += res.join('\n');
    } else {
      result += 'ERROR';
    }

    /**
     * Update Output and clear Query
     */
    onOptionsChange({ ...options, output: `${output ? `${output}\n` : ''}${result}`, query: '' });
  };

  /**
   * Return
   */
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div className="gf-form">
        <AutoScrollingTextarea value={output} rows={options.height} />
      </div>

      <div className="gf-form">
        <span className="gf-form-label width-10">Command</span>
        <input
          name="query"
          placeholder="PING"
          className="gf-form-input"
          onChange={(event) => {
            onOptionsChange({ ...options, query: event.target.value });
          }}
          onKeyPress={runQuery}
          value={query}
        />
        <Button
          variant="secondary"
          onClick={() => {
            onOptionsChange({ ...options, output: '' });
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

/**
 * Styles
 */
const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
  };
});

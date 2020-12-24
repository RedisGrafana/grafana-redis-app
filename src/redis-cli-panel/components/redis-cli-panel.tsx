import { css, cx } from 'emotion';
import React, { ChangeEvent } from 'react';
import { Observable } from 'rxjs';
import { map as map$, switchMap as switchMap$ } from 'rxjs/operators';
import { DataFrame, DataQueryRequest, DataQueryResponse, PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Button } from '@grafana/ui';
import { Styles } from '../styles';
import { Help, HelpCommand, PanelOptions, RedisQuery } from '../types';
import AutoScrollingTextarea from './auto-scrolling-text-area';

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
  const { query, output, help } = options;
  const styles = Styles();

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
     * Run Query
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
   * Run Query
   *
   * @param event {ChangeEvent<HTMLInputElement>} Event
   */
  const onQueryChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toUpperCase();
    const q = query?.split(/[\s+\.]/);
    let help: HelpCommand = {};

    /**
     * Parse first and second parameter
     */
    if (q[0] && q[1] && Help[`${q[0]} ${q[1]}`]) {
      help = Help[`${q[0]} ${q[1]}`];
    } else if (q[0]) {
      help = Help[q[0]];
    }

    /**
     * Update query and help
     */
    onOptionsChange({ ...options, query: event.target.value, help });
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
        <AutoScrollingTextarea className={cx(styles.textarea)} value={output} rows={options.height} />
      </div>

      {query && help && (
        <div className={cx(styles.help)}>
          {help.danger && <h3 className={cx(styles.danger)}>{help.danger}</h3>}
          {help.warning && <h3 className={cx(styles.warning)}>{help.warning}</h3>}

          <h4>{help.syntax}</h4>
          <div>{help.summary}</div>

          {help.complexity && (
            <div>
              <b>Time complexity:</b> {help.complexity}
            </div>
          )}

          {help.since && (
            <div>
              <b>Since:</b> {help.since}
            </div>
          )}

          <div className={cx(styles.url)}>
            <a target="_blank" href={help.url}>
              {help.url}
            </a>
          </div>
        </div>
      )}

      <div className="gf-form">
        <span className="gf-form-label width-10">Command</span>
        <input
          name="query"
          placeholder="PING"
          className="gf-form-input"
          onChange={onQueryChange}
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

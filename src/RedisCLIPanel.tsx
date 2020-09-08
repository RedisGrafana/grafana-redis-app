import AutoScrollingTextarea from 'AutoScrollingTextArea';
import { css, cx } from 'emotion';
import React from 'react';
import { Observable } from 'rxjs';
import { map as map$, switchMap as switchMap$ } from 'rxjs/operators';
import { PanelOptions, RedisQuery } from 'types';
import { DataFrame, DataQueryRequest, DataQueryResponse, PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { stylesFactory } from '@grafana/ui';

/**
 * Panel
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
     * Return if not Enter or not command
     */
    if (event.key !== 'Enter' || !query) {
      return;
    }

    /**
     * Get Data Source
     */
    const ds = await getDataSourceSrv().get();

    /**
     * Query
     */
    const res = await ((ds.query({
      targets: [{ query: replaceVariables(query) }],
    } as DataQueryRequest<RedisQuery>) as unknown) as Observable<DataQueryResponse>)
      .pipe(
        switchMap$(response => response.data),
        switchMap$((data: DataFrame) => data.fields),
        map$(field =>
          field.values.toArray().map(value => {
            return value;
          })
        )
      )
      .toPromise();

    /**
     * Result
     */
    let result = `${ds.meta.name}> ${query}\n`;
    if (res && res.length) {
      result += res.join('\n');
    } else {
      result += 'ERROR';
    }

    /**
     * Update Output
     */
    onOptionsChange({ ...options, output: `${output ? `${output}\n` : ''}${result}` });
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
          onChange={event => {
            onOptionsChange({ ...options, query: event.target.value });
          }}
          onKeyPress={runQuery}
          value={query}
        />
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
  };
});

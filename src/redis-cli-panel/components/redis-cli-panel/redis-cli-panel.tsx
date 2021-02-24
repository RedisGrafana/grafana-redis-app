import { css } from '@emotion/core';
import React, { ChangeEvent } from 'react';
import { Observable } from 'rxjs';
import { map as map$, switchMap as switchMap$ } from 'rxjs/operators';
import { DataFrame, DataQueryRequest, DataQueryResponse, PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Button, LegacyForms } from '@grafana/ui';
import { Help } from '../../constants';
import { Styles } from '../../styles';
import { HelpCommand, PanelOptions, RedisQuery } from '../../types';
import { CLITextArea } from '../auto-scrolling-text-area';

/**
 * Legacy Forms
 */
const { Switch } = LegacyForms;

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
  const { query, raw, output, help } = options;
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

    // Response Error
    let error = '';

    /**
     * Run Query
     */
    const res = await ((ds.query({
      targets: [{ query: replaceVariables(query), cli: !options.raw }],
    } as DataQueryRequest<RedisQuery>) as unknown) as Observable<DataQueryResponse>)
      .pipe(
        switchMap$((response) => {
          /**
           * Check for error in response
           */
          if (response.error && response.error.message) {
            error = response.error.message;
          }

          return response.data;
        }),
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
    } else if (error) {
      result += `(error) ${error}\n`;
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
      css={[
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `,
      ]}
    >
      <div css={['gf-form', styles.form]}>
        <CLITextArea css={styles.textarea} value={output} />
      </div>

      {query && help && (
        <div css={styles.help} id="help">
          {help.danger && (
            <h3 id="help-danger" css={styles.danger}>
              {help.danger}
            </h3>
          )}
          {help.warning && (
            <h3 id="help-warning" css={styles.warning}>
              {help.warning}
            </h3>
          )}

          <h4 id="help-syntax">{help.syntax}</h4>
          <div id="help-summary">{help.summary}</div>

          <hr />
          {help.complexity && (
            <div id="help-complexity">
              <b>Time complexity:</b> {help.complexity}
            </div>
          )}

          {help.since && (
            <div id="help-since">
              <b>Since:</b> {help.since}
            </div>
          )}

          <div id="help-url" css={styles.url}>
            <a target="_blank" rel="noreferrer" href={help.url}>
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

        <Switch
          label="Raw"
          labelClass="width-4"
          tooltip="If checked, use raw formatting for replies."
          checked={raw || false}
          onChange={(event: any) => {
            onOptionsChange({ ...options, raw: event.currentTarget.checked });
          }}
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

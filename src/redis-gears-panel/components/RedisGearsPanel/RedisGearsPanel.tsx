import React, { ChangeEvent, createRef, PureComponent, RefObject } from 'react';
import { lastValueFrom, Observable } from 'rxjs';
import { css } from '@emotion/css';
import {
  DataFrame,
  DataQueryError,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceRef,
  Field,
  FieldType,
  getDisplayProcessor,
  LoadingState,
  PanelProps,
  toDataFrame,
} from '@grafana/data';
import { config, getDataSourceSrv, toDataQueryError } from '@grafana/runtime';
import { Alert, Button, InlineField, InlineFormLabel, Input, RadioButtonGroup, Table } from '@grafana/ui';
import { DefaultScript, ExecutionMode, ExecutionOptions } from '../../constants';
import { PanelOptions } from '../../types';
import { CodeEditor } from '../CodeEditor';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * State
 */
interface State {
  /**
   * Script
   */
  script: string;

  /**
   * Unblocking
   */
  unblocking: boolean;

  /**
   * Printed Result
   */
  result?: DataFrame;

  /**
   * Requirements
   */
  requirements: string;

  /**
   * Running state
   */
  isRunning: boolean;

  /**
   * Footer height
   */
  footerHeight: number;

  /**
   * Script error
   */
  error: DataQueryError | null;
}

export class RedisGearsPanel extends PureComponent<Props, State> {
  /**
   * State
   */
  state: State = {
    script: DefaultScript,
    unblocking: false,
    requirements: '',
    isRunning: false,
    footerHeight: 0,
    error: null,
  };

  /**
   * Footer HTML element
   */
  footerRef: RefObject<HTMLDivElement> = createRef();

  /**
   * Mount
   */
  componentDidMount(): void {
    if (this.footerRef.current) {
      this.setState({
        footerHeight: this.footerRef.current.getBoundingClientRect().height,
      });
    }
  }

  /**
   * Update
   *
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (
      prevProps.width !== this.props.width ||
      prevState.result !== this.state.result ||
      prevState.error !== this.state.error
    ) {
      if (this.footerRef.current) {
        this.setState({
          footerHeight: this.footerRef.current.getBoundingClientRect().height,
        });
      }
    }
  }

  /**
   * Change script
   *
   * @param script
   */
  onChangeScript = (script = '') => {
    this.setState({
      script,
    });
  };

  /**
   * Run script
   */
  onRunScript = async () => {
    this.setState({
      isRunning: true,
      error: null,
    });

    /**
     * Response
     */
    const response = await this.makeQuery();

    /**
     * Error
     */
    if (!response || response.state === LoadingState.Error || !response.data.length) {
      this.setState({
        result: undefined,
        isRunning: false,
        error: toDataQueryError(response?.error || { message: 'Common error' }),
      });
      return;
    }

    /**
     * Error Message
     */
    const errorDataFrame: DataFrame | undefined = response.data[1];
    if (errorDataFrame && errorDataFrame.length > 0) {
      const messages = errorDataFrame.fields[0].values.toArray();
      this.setState({
        result: undefined,
        isRunning: false,
        error: toDataQueryError({ message: messages[0] }),
      });

      return;
    }

    let resultDataFrame: DataFrame = response.data[0];
    if (resultDataFrame.length === 0) {
      resultDataFrame = toDataFrame({
        fields: [
          {
            name: 'results',
            type: FieldType.string,
            values: ['OK'],
          },
        ],
      });
    }

    /**
     * Fields
     */
    resultDataFrame.fields.forEach((field: Field) => {
      field.display = getDisplayProcessor({ field, theme: config.theme2 });
    });

    this.setState({
      result: resultDataFrame,
      isRunning: false,
    });
  };

  /**
   * Make query
   */
  async makeQuery(): Promise<DataQueryResponse | null> {
    const targets = this.props.data.request?.targets || [];

    /**
     * Data Source
     */
    let datasource: string | DataSourceRef = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    }

    if (!datasource) {
      return Promise.resolve(null);
    }

    /**
     * Targets
     */
    const targetsWithCommands = targets.map((target: any) => ({
      ...target,
      command: 'rg.pyexecute',
      keyName: this.state.script,
      unblocking: this.state.unblocking,
      requirements: this.state.requirements,
    }));

    /**
     * Query
     */
    const ds = await getDataSourceSrv().get(datasource);
    const query = ds.query({
      ...this.props.data.request,
      targets: targetsWithCommands,
    } as DataQueryRequest<any>) as unknown;

    return lastValueFrom(query as Observable<DataQueryResponse>);
  }

  /**
   * Change unblocking
   *
   * @param event {HTMLInputElement}
   */
  onChangeUnblocking = (event?: ExecutionMode) => {
    this.setState({
      unblocking: event ? true : false,
    });
  };

  /**
   * Change requirements
   *
   * @param event {HTMLInputElement}
   */
  onChangeRequirements = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      requirements: event.target.value,
    });
  };

  /**
   * Clear error
   */
  onClearError = () => {
    this.setState({
      error: null,
    });
  };

  /**
   * Render
   */
  render() {
    const { height, width } = this.props;
    const { script, result, unblocking, requirements, isRunning, footerHeight, error } = this.state;

    return (
      <div
        className={css`
          position: relative;
        `}
      >
        <div
          className={css`
            margin-bottom: 4px;
          `}
        >
          <CodeEditor
            value={script}
            language="python"
            width={width}
            height={height - footerHeight}
            onChange={this.onChangeScript}
            showMiniMap={true}
            showLineNumbers={true}
          />
        </div>

        <div ref={this.footerRef}>
          {error && error.message && <Alert title={error.message} onRemove={this.onClearError} />}

          <div className="gf-form">
            <InlineField label={<InlineFormLabel width={6}>Requirements</InlineFormLabel>}>
              <Input value={requirements} onChange={this.onChangeRequirements} width={40} />
            </InlineField>

            <RadioButtonGroup
              className={css`
                margin-right: 4px;
              `}
              value={unblocking ? ExecutionMode.Unblocking : ExecutionMode.Blocking}
              options={ExecutionOptions}
              onChange={this.onChangeUnblocking}
            />

            <Button onClick={this.onRunScript} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Run script'}
            </Button>
          </div>

          {result && (
            <>
              <hr />
              <Table noHeader={true} data={result} width={width} height={100} />
            </>
          )}
        </div>
      </div>
    );
  }
}

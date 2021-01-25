import React, { PureComponent, ChangeEvent, createRef, RefObject } from 'react';
import { css } from 'emotion';
import {
  PanelProps,
  DataQueryRequest,
  DataQueryResponse,
  DataFrame,
  getDisplayProcessor,
  Field,
  DataQueryError,
  LoadingState,
} from '@grafana/data';
import { CodeEditor, Button, Table, Switch, InlineFormLabel, Input, InlineField, Alert } from '@grafana/ui';
import { getDataSourceSrv, toDataQueryError } from '@grafana/runtime';
import { Observable } from 'rxjs';
import { PanelOptions } from '../../types';

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
    script: '',
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
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (prevProps.width !== this.props.width) {
      if (this.footerRef.current) {
        this.setState({
          footerHeight: this.footerRef.current.getBoundingClientRect().height,
        });
      }
    }
  }

  /**
   * Change script
   * @param script
   */
  onChangeScript = (script: string) => {
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
    const response = await this.makeQuery();

    if (!response || response.state === LoadingState.Error) {
      this.setState({
        result: undefined,
        isRunning: false,
        error: toDataQueryError(response?.error || { message: 'Common error' }),
      });
      return;
    }

    if (response.data[1].length > 0) {
      const messages = response.data[1].fields[0].values.toArray();
      this.setState({
        result: undefined,
        isRunning: false,
        error: toDataQueryError({ message: messages[0] }),
      });
      return;
    }

    response.data[0].fields.forEach((field: Field) => {
      field.display = getDisplayProcessor({ field });
    });
    this.setState({
      result: response.data[0],
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
    let datasource = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    }

    if (!datasource) {
      return Promise.resolve(null);
    }

    const targetsWithCommands = targets.map((target: any) => ({
      ...target,
      command: 'rg.pyexecute',
      keyName: this.state.script,
      unblocking: this.state.unblocking,
      requirements: this.state.requirements,
    }));
    const ds = await getDataSourceSrv().get(datasource);
    return ((ds.query({
      ...this.props.data.request,
      targets: targetsWithCommands,
    } as DataQueryRequest<any>) as unknown) as Observable<DataQueryResponse>).toPromise();
  }

  /**
   * Change unblocking
   * @param event
   */
  onChangeUnblocking = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      unblocking: event.target.checked,
    });
  };

  /**
   * Change requirements
   * @param event
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
   * render
   */
  render() {
    const { height, width } = this.props;
    const { script, result, unblocking, requirements, isRunning, footerHeight, error } = this.state;

    let resultComponent = null;
    /**
     * Show result table If there is a result
     */
    if (result) {
      resultComponent = <Table data={result} width={width} height={100} />;
    }

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
            height={height - footerHeight - (result ? 100 : 0)}
            onBlur={this.onChangeScript}
            onSave={this.onChangeScript}
            showMiniMap={false}
          />
        </div>
        <div className="gf-form-inline" ref={this.footerRef}>
          <InlineField label={<InlineFormLabel width={6}>Requirements</InlineFormLabel>}>
            <Input css="" value={requirements} onChange={this.onChangeRequirements} width={20} />
          </InlineField>
          <InlineField label={<InlineFormLabel width={6}>Unblocking</InlineFormLabel>}>
            <Switch css="" value={unblocking} onChange={this.onChangeUnblocking} />
          </InlineField>
          <div className="gf-form">
            <Button onClick={this.onRunScript} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Run script'}
            </Button>
          </div>
        </div>
        {error && error.message && (
          <div
            className={css`
              position: absolute;
              top: 0;
              padding: 4px;
            `}
          >
            <Alert title={error.message} onRemove={this.onClearError} />
          </div>
        )}
        {resultComponent}
      </div>
    );
  }
}

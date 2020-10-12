import React, { PureComponent } from 'react';
import { AppRootProps } from '@grafana/data';
import { GlobalSettings } from '../types';

/**
 * Properties
 */
interface Props extends AppRootProps<GlobalSettings> {}

/**
 * State
 */
interface State {}

/**
 * Root Page
 */
export class RootPage extends PureComponent<Props, State> {
  /**
   * Constructor
   *
   * @param {Props} props Properties
   */
  constructor(props: Props) {
    super(props);
  }

  /**
   * Render
   */
  render() {
    return <div>Work in progress...</div>;
  }
}

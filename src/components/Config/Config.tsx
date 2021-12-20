import React, { PureComponent } from 'react';
import { AppPluginMeta, PluginConfigPageProps } from '@grafana/data';
import { BackendSrv, getBackendSrv, getLocationSrv } from '@grafana/runtime';
import { Button } from '@grafana/ui';
import { ApplicationName, ApplicationRoot } from '../../constants';
import { GlobalSettings } from '../../types';

/**
 * Page Properties
 */
interface Props extends PluginConfigPageProps<AppPluginMeta<GlobalSettings>> {}

/**
 * State
 */
interface State {
  isEnabled: boolean;
}

/**
 * Config component
 */
export class Config extends PureComponent<Props, State> {
  /**
   * Object to get the current page
   */
  static getLocation(): Location {
    return window.location;
  }

  /**
   * Service to communicate via http(s) to a remote backend such as the Grafana backend, a datasource etc.
   */
  private backendSrv: BackendSrv = getBackendSrv();

  /**
   * Constructor
   *
   * @param props {Props} Properties
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      isEnabled: false,
    };
  }

  /**
   * Mount
   */
  componentDidMount(): void {
    this.setState(() => ({
      isEnabled: this.props.plugin.meta?.enabled ? true : false,
    }));
  }

  /**
   * Home
   */
  goHome = (): void => {
    getLocationSrv().update({
      path: ApplicationRoot,
      partial: false,
    });
  };

  /**
   * Plugin Settings
   *
   * @param settings Plugin Settings
   */
  updatePluginSettings = (settings: { enabled: boolean; jsonData: unknown; pinned: boolean }): Promise<undefined> => {
    return this.backendSrv.post(`api/plugins/${this.props.plugin.meta.id}/settings`, settings);
  };

  /**
   * Plugin disable
   */
  onDisable = () => {
    this.updatePluginSettings({ enabled: false, jsonData: {}, pinned: false }).then(() => {
      Config.getLocation().reload();
    });
  };

  /**
   * Plugin enable
   */
  onEnable = () => {
    this.updatePluginSettings({ enabled: true, jsonData: {}, pinned: true }).then(() => {
      Config.getLocation().assign(ApplicationRoot);
    });
  };

  /**
   * Page Render
   */
  render() {
    const { isEnabled } = this.state;

    return (
      <>
        <h2>{ApplicationName}</h2>
        <p>The Redis Application, is a plugin for Grafana that provides custom panels for Redis Data Source.</p>
        {!isEnabled && (
          <p>
            Click below to <b>Enable</b> the Application and start monitoring your Redis instances today.
          </p>
        )}
        <div className="gf-form gf-form-button-row">
          {isEnabled ? (
            <Button variant="destructive" onClick={this.onDisable}>
              Disable
            </Button>
          ) : (
            <Button onClick={this.onEnable}>Enable</Button>
          )}
        </div>
      </>
    );
  }
}

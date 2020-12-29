import React, { PureComponent } from 'react';
import { AppPluginMeta, PluginConfigPageProps } from '@grafana/data';
import { BackendSrv, config, getBackendSrv, getLocationSrv } from '@grafana/runtime';
import { Button, InfoBox } from '@grafana/ui';
import { GlobalSettings } from '../types';

const HOME_PATH = 'a/redis-app/';

interface Props extends PluginConfigPageProps<AppPluginMeta<GlobalSettings>> {}

/**
 * State
 */
interface State {
  isConfigured: boolean;
  isEnabled: boolean;
}

/**
 * Config component
 */
export class Config extends PureComponent<Props, State> {
  static getLocation(): Location {
    return window.location;
  }

  private backendSrv: BackendSrv = getBackendSrv();
  constructor(props: Props) {
    super(props);

    this.state = {
      isConfigured: false,
      isEnabled: false,
    };
  }

  componentDidMount(): void {
    if (this.props.plugin.meta?.enabled) {
      const datasources = Object.values(config.datasources).filter((ds) => {
        return ds.type === 'redis-datasource';
      });

      /**
       * Datasources found
       */
      this.setState({
        isConfigured: datasources.length > 0,
        isEnabled: true,
      });
    }
  }

  onUpdate = () => {
    if (!this.state.isEnabled) {
      return;
    }

    this.goHome();
  };

  goHome = (): void => {
    getLocationSrv().update({
      path: HOME_PATH,
      partial: false,
    });
  };

  updatePluginSettings = (settings: { enabled: boolean; jsonData: unknown; pinned: boolean }): Promise<undefined> => {
    return this.backendSrv.post(`api/plugins/${this.props.plugin.meta.id}/settings`, settings);
  };

  onDisable = () => {
    this.updatePluginSettings({ enabled: false, jsonData: {}, pinned: false }).then(() => {
      Config.getLocation().reload();
    });
  };

  onEnable = () => {
    this.updatePluginSettings({ enabled: true, jsonData: {}, pinned: true }).then(() => {
      Config.getLocation().assign(HOME_PATH);
    });
  };

  render() {
    const { isConfigured, isEnabled } = this.state;

    return (
      <>
        <InfoBox>
          <h2>Redis Application</h2>
          <p>
            The Redis Application, is a plug-in for Grafana that provides custom panels for{' '}
            <a target="_blank" href="https://grafana.com/grafana/plugins/redis-datasource">
              Redis Data Source
            </a>
            .
          </p>
          {isConfigured ? (
            <p>
              Click <b>Update</b> to edit the Application configuration.
            </p>
          ) : (
            <p>
              Click below to <b>Enable</b> the Application and start monitoring your Redis databases today.
            </p>
          )}
        </InfoBox>
        <div className="gf-form gf-form-button-row">
          {isConfigured && <Button onClick={this.onUpdate}>Update</Button>}
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

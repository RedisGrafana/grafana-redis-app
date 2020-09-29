import { PluginMeta } from '@grafana/data';
import { config, getLocationSrv } from '@grafana/runtime';

/**
 * Config Controller
 */
export class ConfigCtrl {
  /**
   * Template URL
   *
   * @type {string}
   */
  static templateUrl = 'legacy/config.html';

  /**
   * Edit Controller
   */
  appEditCtrl: any;

  /**
   * Query
   */
  $q: any;

  /**
   * Application Model
   */
  appModel?: PluginMeta;

  /**
   * Is application configured
   *
   * @type {boolean}
   */
  configured: boolean;

  /**
   * Constructor
   *
   * @ngInject
   * @param {any} $scope Scope
   * @param {any} $injector Injector
   * @param {any} $q
   */
  constructor($scope: any, $injector: any, $q: any) {
    /**
     * Post Update Hook
     */
    this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));

    /**
     * Query
     */
    this.$q = $q;

    /**
     * Make sure it has a JSON Data spot
     */
    if (!this.appModel) {
      this.appModel = {} as PluginMeta;
    }

    // Required until we get the types sorted on appModel :(
    const appModel = this.appModel as any;
    if (!appModel.jsonData) {
      appModel.jsonData = {};
    }

    /**
     * Check if Application configured
     */
    this.configured = false;
    if (this.appModel?.enabled) {
      /**
       * Check Datasources
       */
      const datasources = Object.values(config.datasources).filter((ds) => {
        return ds.type === 'redis-datasource';
      });

      /**
       * Datasources found
       */
      if (datasources.length > 0) {
        this.configured = true;
      }
    }
  }

  /**
   * Post Update
   */
  postUpdate() {
    /**
     * Application enabled
     */
    if (!this.appModel?.enabled) {
      return;
    }

    /**
     * Update location
     */
    getLocationSrv().update({
      path: 'a/redis-app',
      partial: false,
    });

    /**
     * Return
     */
    return this.$q.resolve(true);
  }
}

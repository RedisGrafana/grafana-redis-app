import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Observable } from 'rxjs';
import { AppPluginMeta, PluginType } from '@grafana/data';
import { ApplicationName, ApplicationSubTitle, DataSourceType, RedisCommand } from '../../constants';
import { RootPage } from './RootPage';

const redisMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber: { next: (v: unknown) => void; complete: () => void }) => {
        subscriber.next({
          data: [
            {
              fields: [
                {
                  values: {
                    toArray() {
                      return ['info', '2', '3'];
                    },
                  },
                },
              ],
              length: 1,
            },
          ],
        });
        subscriber.complete();
      })
  ),
};

const getDataSourceMock = jest.fn().mockImplementation(() => Promise.resolve([]));
const getRedisMock = jest.fn().mockImplementation(() => Promise.resolve(redisMock));

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => ({
    get: getDataSourceMock,
  }),
  getDataSourceSrv: () => ({
    get: getRedisMock,
  }),
  config: {},
}));

const getMeta = (): AppPluginMeta => ({
  id: '',
  name: '',
  type: PluginType.app,
  module: '',
  baseUrl: '',
  info: {
    author: {} as any,
    description: '',
    logos: {
      large: '',
      small: '',
    },
    links: [],
    screenshots: [],
    updated: '',
    version: '',
  },
});

describe('RootPage', () => {
  const meta = getMeta();
  const path = '/app';
  const onNavChangedMock = jest.fn();

  const renderComponent = (overrides: Partial<React.ComponentProps<typeof RootPage>> = {}) => {
    return render(
      <RootPage
        basename=""
        meta={meta}
        path={path}
        query={null as any}
        onNavChanged={onNavChangedMock}
        {...overrides}
      />
    );
  };

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
    });
  });

  beforeEach(() => {
    onNavChangedMock.mockClear();
    getDataSourceMock.mockClear();
    getDataSourceMock.mockImplementation(() => Promise.resolve([]));
    getRedisMock.mockClear();
    redisMock.query.mockClear();
  });

  describe('Mounting', () => {
    it('Should update navigation', async () => {
      const updateNavSpy = jest.spyOn(RootPage.prototype, 'updateNav');
      renderComponent();
      await waitFor(() => {
        expect(updateNavSpy).toHaveBeenCalledTimes(1);
      });
      updateNavSpy.mockRestore();
    });

    it('Should make get /api/datasources request', async () => {
      renderComponent();
      await waitFor(() => {
        expect(getDataSourceMock).toHaveBeenCalledWith('/api/datasources');
      });
    });

    it('Should check supported commands', async () => {
      let getCallIndex = 0;
      getDataSourceMock.mockImplementation(() => {
        getCallIndex++;
        if (getCallIndex === 1) {
          return Promise.resolve([
            {
              type: DataSourceType.REDIS,
              name: 'redis',
              jsonData: {},
              id: 1,
            },
          ]);
        }
        return Promise.resolve([]);
      });
      renderComponent();
      await waitFor(
        () => {
          const redisDataSourceName = screen.getByText('redis');
          expect(redisDataSourceName).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
      expect(getRedisMock).toHaveBeenCalledWith('redis');
      expect(redisMock.query).toHaveBeenCalledWith({ targets: [{ refId: 'A', query: RedisCommand.COMMAND }] });
    });
  });

  describe('updateNav', () => {
    it('Should call onNavChanged prop', () => {
      const instance = new RootPage({
        basename: '',
        meta,
        path,
        query: null as any,
        onNavChanged: onNavChangedMock,
      });
      instance.updateNav();
      const node = {
        text: ApplicationName,
        img: meta.info.logos.large,
        subTitle: ApplicationSubTitle,
        url: path,
        children: [
          {
            text: 'Home',
            url: path,
            id: 'home',
            icon: 'fa fa-fw fa-home',
            active: true,
          },
        ],
      };
      expect(onNavChangedMock).toHaveBeenCalledWith({
        node: node,
        main: node,
      });
    });
  });

  describe('rendering', () => {
    it('Should show message if loading=true', async () => {
      renderComponent();
      const loadingMessage = screen.getByText('Loading time depends on the number of configured data sources.');
      expect(loadingMessage).toBeInTheDocument();
      await waitFor(() => {
        const emptyDataSourcesMessage = screen.getByText('Please add Redis Data Sources.');
        expect(emptyDataSourcesMessage).toBeInTheDocument();
      });
    });

    it('If dataSource is unable to make query, should work correctly', async () => {
      renderComponent();
      await waitFor(() => {
        const emptyDataSourcesMessage = screen.getByText('Please add Redis Data Sources.');
        expect(emptyDataSourcesMessage).toBeInTheDocument();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});

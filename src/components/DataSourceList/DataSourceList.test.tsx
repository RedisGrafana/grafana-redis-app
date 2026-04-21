import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { DataSourceType, RedisCommand } from '../../constants';
import { DataSourceList } from './DataSourceList';

const backendSrvMock = {
  post: jest.fn(),
};

jest.mock('@grafana/runtime', () => ({
  getBackendSrv: () => backendSrvMock,
  locationService: {
    push: () => jest.fn(),
  },
}));

const ICON_LINK_TITLES = {
  MultiLayerSecurity: 'Multi Layer Security enabled.',
  HighAvailability: 'High Availability enabled.',
  RedisGears: 'RedisGears is a serverless engine for transaction, batch and event-driven data processing in Redis.',
  RedisTimeSeries: 'RedisTimeSeries is a Redis Module adding a Time Series data structure to Redis.',
  RedisAI: 'RedisAI is a Redis module for executing Deep Learning/Machine Learning models and managing their data.',
  RediSearch: 'RediSearch is a Full-Text and Secondary Index engine over Redis.',
  RedisJSON:
    'RedisJSON is a Redis module that implements ECMA-404 The JSON Data Interchange Standard as a native data type.',
  RedisGraph:
    'RedisGraph is the first queryable Property Graph database to use sparse matrices to represent the adjacency matrix in graphs and linear algebra to query the graph.',
  RedisBloom:
    'RedisBloom module provides four datatypes, a Scalable Bloom Filter and Cuckoo Filter, a Count-Mins-Sketch and a Top-K.',
};

/**
 * DataSourceList
 */
describe('DataSourceList', () => {
  const renderComponent = (overrides: Partial<React.ComponentProps<typeof DataSourceList>> = {}) => {
    const props = {
      dataSources: [] as any,
      ...overrides,
    };
    return render(<DataSourceList {...props} />);
  };

  const FILLS = {
    success: '#DC382D',
    error: '#A7A7A7',
  };
  const TITLES = {
    success: 'Working as expected',
    error: `Can't retrieve a list of commands. Check that user has permissions to see a list of all commands.`,
  };

  beforeEach(() => {
    Object.values(backendSrvMock).forEach((mock) => mock.mockClear());
  });

  it('If datasources.length=0 should show no items message', () => {
    renderComponent();
    const noItemsMessage = screen.getByText('Please add Redis Data Sources.');
    expect(noItemsMessage).toBeInTheDocument();
  });

  /**
   * Item
   */
  describe('Item', () => {
    const renderComponent = (overrides: Partial<React.ComponentProps<typeof DataSourceList>> = {}) => {
      const props = {
        dataSources: [] as any,
        ...overrides,
      };
      return render(<DataSourceList {...props} />);
    };

    const getFirstCard = () => {
      const [item] = screen.getAllByLabelText('check-card');
      return item;
    };

    /**
     * RedisCube
     */
    describe('RedisCube', () => {
      it('Should render', () => {
        const dataSources = [
          {
            commands: [''],
            jsonData: {},
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const link = within(item).getByTitle(TITLES.success);
        expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.success);
      });

      it('If there are not any commands should use alternative fill and title values', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {},
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const link = within(item).getByTitle(TITLES.error);
        expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.error);
      });
    });

    /**
     * Name
     */
    describe('Name', () => {
      it('Should render name', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {},
            name: 'hello',
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const nameText = within(item).getByText('hello');
        expect(nameText).toBeInTheDocument();
      });
    });

    /**
     * Url
     */
    describe('Url', () => {
      it('Should render url', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {},
            url: 'hello',
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const urlText = within(item).getByText('hello');
        expect(urlText).toBeInTheDocument();
      });
    });

    /**
     * Title
     */
    describe('Title', () => {
      it('If there are not any commands should show title', () => {
        const dataSources = [
          {
            jsonData: {},
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const titleEl = within(item).getByText(TITLES.error);
        expect(titleEl).toBeInTheDocument();
        expect(titleEl).toHaveClass('card-item-type');
      });

      it('If there are some commands should hide title', () => {
        const dataSources = [
          {
            commands: [''],
            jsonData: {},
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        expect(within(item).queryByText(TITLES.error)).not.toBeInTheDocument();
      });
    });

    /**
     * MultiLayerSecurity
     */
    describe('MultiLayerSecurity', () => {
      it('if jsonData.tlsAuth=true should be shown', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {
              tlsAuth: true,
            },
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const link = within(item).getByTitle(ICON_LINK_TITLES.MultiLayerSecurity);
        expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.error);
      });

      it('if jsonData.acl=true should be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              acl: true,
            },
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const link = within(item).getByTitle(ICON_LINK_TITLES.MultiLayerSecurity);
        expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.success);
      });

      it('if jsonData.acl=false and jsonData.tlsAuth=false should not be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              tlsAuth: false,
              acl: false,
            },
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        expect(within(item).queryByTitle(ICON_LINK_TITLES.MultiLayerSecurity)).not.toBeInTheDocument();
      });
    });

    /**
     * HighAvailability
     */
    describe('HighAvailability ', () => {
      it('if jsonData.client matches with "cluster" should be shown', () => {
        const dataSources = [
          {
            commands: [],
            jsonData: {
              client: 'cluster',
            },
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const link = within(item).getByTitle(ICON_LINK_TITLES.HighAvailability);
        expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.error);
      });

      it('if jsonData.client matches with "sentinel" should be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              client: 'sentinel',
            },
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        const link = within(item).getByTitle(ICON_LINK_TITLES.HighAvailability);
        expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.success);
      });

      it('if jsonData.client does not match with cluster|sentinel should not be shown', () => {
        const dataSources = [
          {
            commands: ['get'],
            jsonData: {
              client: 'manual',
            },
          },
        ];
        renderComponent({ dataSources: dataSources as any });
        const item = getFirstCard();
        expect(within(item).queryByTitle(ICON_LINK_TITLES.HighAvailability)).not.toBeInTheDocument();
      });
    });

    /**
     * Tests for similar components
     */
    const tests = [
      {
        name: 'RedisGears',
        title: ICON_LINK_TITLES.RedisGears,
        valueToShow: RedisCommand.REDISGEARS,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisTimeSeries',
        title: ICON_LINK_TITLES.RedisTimeSeries,
        valueToShow: RedisCommand.REDISTIMESERIES,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisAI',
        title: ICON_LINK_TITLES.RedisAI,
        valueToShow: RedisCommand.REDISAI,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RediSearch',
        title: ICON_LINK_TITLES.RediSearch,
        valueToShow: RedisCommand.REDISEARCH,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisJSON',
        title: ICON_LINK_TITLES.RedisJSON,
        valueToShow: RedisCommand.REDISJSON,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisGraph',
        title: ICON_LINK_TITLES.RedisGraph,
        valueToShow: RedisCommand.REDISGRAPH,
        valueToHide: RedisCommand.COMMAND,
      },
      {
        name: 'RedisBloom',
        title: ICON_LINK_TITLES.RedisBloom,
        valueToShow: RedisCommand.REDISBLOOM,
        valueToHide: RedisCommand.COMMAND,
      },
    ];
    tests.forEach(({ name, title, valueToShow, valueToHide }) => {
      describe(name, () => {
        it(`Should be shown if commands contain item "${valueToShow}"`, () => {
          const dataSources = [
            {
              commands: [valueToShow],
              jsonData: {},
            },
          ];
          renderComponent({ dataSources: dataSources as any });
          const item = getFirstCard();
          const link = within(item).getByTitle(title);
          expect(link.querySelector('path')).toHaveAttribute('fill', FILLS.success);
        });

        it(`Should not be shown if commands do not contain item "${valueToShow}"`, () => {
          const dataSources = [
            {
              commands: [valueToHide],
              jsonData: {},
            },
          ];
          renderComponent({ dataSources: dataSources as any });
          const item = getFirstCard();
          expect(within(item).queryByTitle(title)).not.toBeInTheDocument();
        });
      });
    });
  });

  /**
   * addNewDataSource
   */
  describe('addNewDataSource', () => {
    const renderComponent = (overrides: Partial<React.ComponentProps<typeof DataSourceList>> = {}) => {
      const props = {
        dataSources: [] as any,
        ...overrides,
      };
      return render(<DataSourceList {...props} />);
    };

    it('Should add new datasource and redirect on edit page', async () => {
      const dataSources = [
        {
          id: 1,
          name: 'Redis Data Source',
          commands: [],
          jsonData: {},
        },
      ];
      backendSrvMock.post.mockImplementationOnce(() => Promise.resolve({ datasource: { uid: 123 } }));
      renderComponent({ dataSources: dataSources as any });
      fireEvent.click(screen.getByRole('button', { name: 'Add Redis Data Source' }));
      await waitFor(() => {
        expect(backendSrvMock.post).toHaveBeenCalledWith('/api/datasources', {
          name: 'Redis',
          type: DataSourceType.REDIS,
          access: 'proxy',
        });
      });
    });

    it('Should calc new name', async () => {
      const dataSources = [
        {
          id: 1,
          name: 'Redis',
          commands: [],
          jsonData: {},
        },
        {
          id: 2,
          name: 'Redis-1',
          commands: [],
          jsonData: {},
        },
      ];
      backendSrvMock.post.mockImplementationOnce(() => Promise.resolve({ datasource: { uid: 123 } }));
      renderComponent({ dataSources: dataSources as any });
      fireEvent.click(screen.getByRole('button', { name: 'Add Redis Data Source' }));
      await waitFor(() => {
        expect(backendSrvMock.post).toHaveBeenCalledWith('/api/datasources', {
          name: 'Redis-2',
          type: DataSourceType.REDIS,
          access: 'proxy',
        });
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});

import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';

/**
 * Styles
 */
export const Styles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    textarea: css`
      font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
        Courier New, monospace;
    `,
    help: css`
      position: relative;
      min-height: 124px;
      margin: 16px;
      margin-top: -140px;
      padding: 16px;
      border-radius: 5px;
      -webkit-box-flex: 1;
      flex-grow: 1;
      box-shadow: 1px 1px 5px 3px grey;
      background-color: #ffffff;
    `,
    warning: css`
      color: #9f6000;
      background-color: #feefb3;
    `,
    danger: css`
      color: #d8000c;
      background-color: #ffd2d2;
    `,
    url: css`
      position: absolute;
      bottom: 0;
      right: 0;
      margin-right: 12px;
    `,
  };
});

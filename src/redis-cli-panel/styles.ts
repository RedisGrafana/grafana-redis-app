import css from '@emotion/css';
import { stylesFactory, useTheme } from '@grafana/ui';

/**
 * Styles
 */
export const Styles = stylesFactory(() => {
  const theme = useTheme();

  /**
   * Return
   */
  return {
    wrapper: css`
      position: relative;
      min-height: 100px;
    `,
    textarea: css`
      font-family: Consolas, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono,
        Courier New, monospace;
      height: 100%;
    `,
    form: css`
      height: calc(100% - 40px);
    `,
    help: css`
      position: absolute;
      bottom: 80px;
      left: 10px;
      width: calc(100% - 22px);
      min-height: 124px;
      padding: 16px;
      border-radius: 5px;
      -webkit-box-flex: 1;
      flex-grow: 1;
      box-shadow: 1px 1px 5px 3px grey;
      background-color: ${theme.isLight ? '#ffffff' : '#000000'};
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

import {
  createStyles,
  TypographyProps,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

export default (args: {
  lines: number;
  lineHeight?: number;
  variant?: TypographyProps['variant'];
}) => {
  const styles = makeStyles((theme: Theme) => {
    // For some reason theme.typography doesn't support 'srOnly', so just treat it as unset.
    const variant = (!args.variant || args.variant === 'srOnly')
      ? 'body1'
      : args.variant;

    const lineHeightDefault = (variant === 'inherit')
      ? 'inherit'
      : theme.typography[variant].lineHeight;

    const {
      lines,
      lineHeight = lineHeightDefault,
    } = args;

    if (lines === 1) {
      return createStyles({
        root: {
          lineHeight,
          minWidth: 0,
        },
      });
    }

    return createStyles({
      // https://css-tricks.com/line-clampin/#the-hide-overflow-place-ellipsis-pure-css-way
      root: {
        height: `calc(${lines} * ${lineHeight}rem)`,

        '& .MuiTypography-root': {
          position: 'relative',
          height: 'auto',
          lineHeight,
          maxHeight: `calc(${lines} * ${lineHeight}rem)`,
          overflow: 'hidden',
          paddingRight: '1rem',
        },

        '& .MuiTypography-root::before': {
          content: '"..."',
          position: 'absolute',
          insetBlockEnd: 0,
          insetInlineEnd: 0,
        },

        '& .MuiTypography-root::after': {
          content: '""',
          position: 'absolute',
          insetInlineEnd: 0,
          width: '1rem',
          height: '1rem',
          background: 'white',
          transform: 'translateY(50%)',
        },
      },
    });
  });

  return styles();
};

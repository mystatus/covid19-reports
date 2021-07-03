import { createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export type NegativeMarginScrollFixParam = {
  spacing: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
};

export default makeStyles((theme: Theme) => createStyles({
  negativeMarginScrollFix: {
    padding: ({ spacing }: NegativeMarginScrollFixParam) => `${theme.spacing(spacing) / 2}px 0`,
  },
}));

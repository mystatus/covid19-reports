import { Chip, ChipProps } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { OverrideType } from '../../utility/typescript-utils';
import useStyles from './status-chip.styles';

type ChipPropsTrimmed = Omit<ChipProps, 'variant'>;
export type StatusChipProps = OverrideType<ChipPropsTrimmed, {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium'
}>;

export const StatusChip = (props: StatusChipProps) => {
  const classes = useStyles();

  function getChipProps(): ChipProps {
    return {
      ...props,
      color: undefined,
      size: undefined,
    };
  }

  return (
    <Chip
      className={clsx({
        [classes.colorPrimary]: !props.color || props.color === 'primary',
        [classes.colorSecondary]: props.color === 'secondary',
        [classes.colorSuccess]: props.color === 'success',
        [classes.colorWarning]: props.color === 'warning',
        [classes.colorError]: props.color === 'error',
      })}
      variant="outlined"
      {...getChipProps()}
    >
      {props.children}
    </Chip>
  );
};

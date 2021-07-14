import React, {
  ReactNode,
  RefObject,
} from 'react';
import useStyles from './tooltip-child.styles';

// Material UI doesn't seem to give us any way to automatically style the element that the tooltip is set on,
// so we need a custom child element to use in order to keep the styling consistent.

export type TooltipItemProps = {
  children: ReactNode
};

// https://material-ui.com/components/tooltips/#custom-child-element
export const TooltipChild = React.forwardRef((props: TooltipItemProps, ref) => {
  const classes = useStyles();

  return (
    <span
      {...props}
      className={classes.root}
      ref={ref as RefObject<HTMLSpanElement>}
    >
      {props.children}
    </span>
  );
});

import React from 'react';
import useStyles, { NegativeMarginScrollFixParam } from './negative-margin-scroll-fix.styles';

// https://material-ui.com/components/grid/#negative-margin

export type NegativeMarginScrollFixProps = NegativeMarginScrollFixParam & {
  children: React.ReactChild;
};

export default function NegativeMarginScrollFix({ children, spacing }: NegativeMarginScrollFixProps) {
  const { negativeMarginScrollFix } = useStyles({ spacing });
  return (
    <div className={negativeMarginScrollFix}>
      {children}
    </div>
  );
}

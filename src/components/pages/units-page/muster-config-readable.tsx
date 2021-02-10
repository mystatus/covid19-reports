import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';
import { MusterConfiguration } from '../../../models/api-response';
import { musterConfigurationsToStrings } from '../../../utility/muster-utils';

export type MusterConfigProps = {
  className?: string,
  musterConfiguration: MusterConfiguration[] | undefined,
  typographyProps?: TypographyProps,
};

export default function MusterConfigReadable({ className, musterConfiguration, typographyProps }: MusterConfigProps) {
  return (
    <div className={className}>
      {musterConfigurationsToStrings(musterConfiguration)
        .map(muster => (
          <Typography key={muster} variant="body1" {...typographyProps}>
            {muster}
          </Typography>
        ))}
    </div>
  );
}

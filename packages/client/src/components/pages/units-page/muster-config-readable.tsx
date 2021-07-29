import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';
import { ApiReportSchema, MusterConfiguration } from '../../../models/api-response';
import { musterConfigurationParts, musterConfigurationPartsToString } from '../../../utility/muster-utils';

export type MusterConfigProps = {
  className?: string;
  empty?: React.ReactNode;
  reports: ApiReportSchema[];
  defaultMusterConfiguration?: MusterConfiguration[];
  musterConfiguration: MusterConfiguration[];
  typographyProps?: TypographyProps;
};

export default function MusterConfigReadable({ className, empty = null, reports, musterConfiguration, typographyProps }: MusterConfigProps) {
  return (
    <div className={className}>
      {musterConfiguration
        .map(muster => musterConfigurationParts(muster, reports))
        .map(({ dateOrDays, duration, report, time, when }, index) => (
          <Typography key={[duration, report, when, index].join()} variant="body1" {...typographyProps}>
            {musterConfigurationPartsToString(dateOrDays, duration, time, report)}
          </Typography>
        ))}
      {!musterConfiguration?.length && empty}
    </div>
  );
}

import { Box } from '@material-ui/core';
import React, { ReactNode } from 'react';

export type PageHelpProps = {
  description: string | ReactNode
  bullets?: Array<string | ReactNode>
};

export const PageHelp = (props: PageHelpProps) => {
  const { description, bullets } = props;

  return (
    <>
      <Box>
        {description}
      </Box>

      {bullets && (
        <>
          <Box fontWeight="bold">
            With this view you can:
          </Box>

          <Box>
            <ul>
              {bullets.map((text, index) => <li key={index}>{text}</li>)}
            </ul>
          </Box>
        </>
      )}
    </>
  );
};

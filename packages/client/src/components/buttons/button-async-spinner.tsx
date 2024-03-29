import React, { useCallback, useState } from 'react';
import { ButtonProps } from '@material-ui/core';
import { ButtonWithSpinner } from './button-with-spinner';

interface ButtonAsyncSpinnerProps extends ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any>;
}

export const ButtonAsyncSpinner = (props: ButtonAsyncSpinnerProps) => {
  const { onClick, children, ...rest } = props;
  const [isExecuting, setIsExecuting] = useState(false);

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsExecuting(true);
    try {
      await onClick(event);
    } finally {
      setIsExecuting(false);
    }
  }, [onClick]);

  return (
    <ButtonWithSpinner
      onClick={handleClick}
      loading={isExecuting}
      {...rest}
    >
      {children}
    </ButtonWithSpinner>
  );
};

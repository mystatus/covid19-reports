import React from 'react';
import {
  Link as MuiLink,
  LinkProps as MuiLinkProps,
} from '@material-ui/core';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

export type ExternalLinkProps = MuiLinkProps;
export type InternalLinkProps = MuiLinkProps & RouterLinkProps;
export type LinkProps = ExternalLinkProps | InternalLinkProps;

export const Link = (props: LinkProps) => {
  return (
    <>
      {props.href ? (
        <MuiLink {...props} />
      ) : (
        <MuiLink component={RouterLink} {...props} />
      )}
    </>
  );
};

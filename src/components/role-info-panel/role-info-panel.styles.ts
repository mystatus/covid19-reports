import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { MaxHeightProperty } from 'csstype';

export type ScrollHeightParam = {
  scrollHeight?: MaxHeightProperty<string | 0>
};

export default makeStyles(() => createStyles({
  roleHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '24px',
    color: '#A9AEB1',
  },
  sectionBody: {
    maxHeight: (props?: ScrollHeightParam) => props?.scrollHeight,
    overflowY: (props?: ScrollHeightParam) => (props?.scrollHeight ? 'auto' : undefined),
  },
}));

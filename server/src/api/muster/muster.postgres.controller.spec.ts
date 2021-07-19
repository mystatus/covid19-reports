import { expect } from 'chai';
import moment from 'moment-timezone';
import musterPostgresController, { MusterTimeView, MusterUnitConfiguration } from './muster.postgres.controller';

describe('Muster Postgres Controller', () => {
  it('should work', () => {

    const musterUnitConf: MusterUnitConfiguration[] = [];
    const mtv:MusterTimeView = musterPostgresController.toMusterTimeView(musterUnitConf);
    console.log(mtv);

  });
});


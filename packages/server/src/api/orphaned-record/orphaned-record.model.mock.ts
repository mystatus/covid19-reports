import moment from 'moment';
import {
  uniqueEdipi,
  uniqueInt,
  uniquePhone,
  uniqueString,
} from '../../util/test-utils/unique';
import { Org } from '../org/org.model';
import { OrphanedRecord } from './orphaned-record.model';

export function mockOrphanedRecord(org: Org, customData?: Partial<OrphanedRecord>) {
  return OrphanedRecord.create({
    org,
    edipi: uniqueEdipi(),
    unit: uniqueString(),
    phone: uniquePhone(),
    timestamp: moment().subtract(uniqueInt(), 'hours').toDate(),
    documentId: uniqueString(),
    ...customData,
  });
}

export function seedOrphanedRecords(org: Org, options: {
  count: number;
  customData?: Partial<OrphanedRecord>;
}) {
  const { count, customData } = options;
  const orphanedRecords: OrphanedRecord[] = [];
  for (let i = 0; i < count; i++) {
    const orphan = mockOrphanedRecord(org, customData);
    orphanedRecords.push(orphan);
  }
  return OrphanedRecord.save(orphanedRecords);
}

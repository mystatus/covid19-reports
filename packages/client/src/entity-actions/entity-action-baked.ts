import { EntityActionRosterEditEntry } from '../components/entity-action/entity-action-baked/entity-action-roster-edit-entry';
import { EntityActionRosterAddEntry } from '../components/entity-action/entity-action-baked/entity-action-roster-add-entry';
import { EntityActionRosterDownloadCsvTemplate } from '../components/entity-action/entity-action-baked/entity-action-roster-download-csv-template';
import {
  EntityActionColumnButtonBakedProps,
  EntityActionColumnItem,
  EntityActionTableButtonBakedProps,
  EntityActionTableItem,
} from './entity-action.types';
import { EntityActionRosterExportCsv } from '../components/entity-action/entity-action-baked/entity-action-roster-export-csv';
import { EntityActionRosterUploadCsv } from '../components/entity-action/entity-action-baked/entity-action-roster-upload-csv';

export type EntityActionBakedTableItemIds =
  | 'actionRosterAddEntry'
  | 'actionRosterDownloadCsvTemplate'
  | 'actionRosterExportCsv'
  | 'actionRosterUploadCsv';

export const entityActionBakedTableItems: {
  [K in EntityActionBakedTableItemIds]: EntityActionTableItem;
} = {
  actionRosterAddEntry: {
    type: 'table-button-item-baked',
    id: 'actionRosterAddEntry',
    entityType: 'roster',
    displayName: 'Add Roster Entry',
    operation: undefined,
    requiredPermissions: ['canManageRoster'],
  },
  actionRosterDownloadCsvTemplate: {
    type: 'table-button-item-baked',
    id: 'actionRosterDownloadCsvTemplate',
    entityType: 'roster',
    displayName: 'Download CSV Template',
    operation: undefined,
    requiredPermissions: ['canViewRoster'],
  },
  actionRosterExportCsv: {
    type: 'table-button-item-baked',
    id: 'actionRosterExportCsv',
    entityType: 'roster',
    displayName: 'Export CSV',
    operation: undefined,
    requiredPermissions: ['canViewRoster'],
  },
  actionRosterUploadCsv: {
    type: 'table-button-item-baked',
    id: 'actionRosterUploadCsv',
    entityType: 'roster',
    displayName: 'Upload CSV',
    operation: undefined,
    requiredPermissions: ['canManageRoster'],
  },
} as const;

export type EntityActionBakedColumnItemIds =
  | 'actionRosterEditEntry';

export const entityActionBakedColumnItems: {
  [K in EntityActionBakedColumnItemIds]: EntityActionColumnItem;
} = {
  actionRosterEditEntry: {
    type: 'column-button-item-baked',
    id: 'actionRosterEditEntry',
    entityType: 'roster',
    displayName: 'Edit Roster Entry',
    operation: undefined,
    requiredPermissions: ['canManageRoster'],
  },
} as const;

export const entityActionBakedTableComponents: {
  [K in EntityActionBakedTableItemIds]: (props: EntityActionTableButtonBakedProps) => JSX.Element;
} = {
  actionRosterAddEntry: EntityActionRosterAddEntry,
  actionRosterDownloadCsvTemplate: EntityActionRosterDownloadCsvTemplate,
  actionRosterExportCsv: EntityActionRosterExportCsv,
  actionRosterUploadCsv: EntityActionRosterUploadCsv,
} as const;

export const entityActionBakedColumnComponents: {
  [K in EntityActionBakedColumnItemIds]: (props: EntityActionColumnButtonBakedProps<any>) => JSX.Element;
} = {
  actionRosterEditEntry: EntityActionRosterEditEntry,
} as const;

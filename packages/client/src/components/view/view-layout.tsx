import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ColumnInfo,
  ColumnsConfig,
  ColumnType,
  EntityType,
  getFullyQualifiedColumnName,
  SavedLayoutSerialized,
  SortedQuery,
} from '@covid19-reports/shared';
import _ from 'lodash';
import deepEquals from 'fast-deep-equal';
import { Button } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TableRowOptions } from '../tables/table-custom-columns-content';
import { UserSelector } from '../../selectors/user.selector';
import usePersistedState from '../../hooks/use-persisted-state';
import { useAppSelector } from '../../hooks/use-app-selector';
import PageHeader, { PageHeaderHelpProps } from '../page-header/page-header';
import { entityApi } from '../../api/entity.api';
import View from './view';
import { SavedItemSelector } from './saved-item-selector';
import { Modal } from '../../actions/modal.actions';
import { savedLayoutApi } from '../../api/saved-layout.api';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import {
  isDefaultLayout,
  makeDefaultViewLayout,
  viewLayoutDefaults,
  ViewLayoutId,
} from './view-utils';
import { SaveNewLayoutDialog } from '../pages/roster-page/save-new-layout-dialog';
import { useEffectError } from '../../hooks/use-effect-error';
import { ColumnSelector } from './column-selector';
import { ViewLayoutButtons } from './view-layout-buttons';
import useStyles from './view-layout.styles';
import { EntityActionRegistrySelector } from '../../selectors/entity-action-registry.selector';
import { EntityActionSelector } from './entity-action-selector';
import {
  isEntityActionAllowed,
  isEntityActionColumnItem,
} from '../../entity-actions/entity-action-utils';

export type LayoutConfigParams = SortedQuery & {
  columns: ColumnInfo[];
  entityType: EntityType;
  maxTableColumns?: number;
  name: string;
  visibleColumns: ColumnInfo[];
};

export type Layout = LayoutConfigParams & {
  rowOptions?: TableRowOptions;
};

export const defaultRowOptions: TableRowOptions = {};

export type ViewLayoutProps = {
  entityType: EntityType;
  idColumn: string | ((row: any) => string);
  header: {
    title: string;
    help?: PageHeaderHelpProps;
  };
  maxTableColumns?: number;
  name?: string;

  // TODO: Build this from configured actions eventually instead of passing it in.
  buttonSetComponent?: React.ComponentType;
};

export default function ViewLayout(props: ViewLayoutProps) {
  const {
    entityType,
    idColumn,
    header,
    buttonSetComponent: ButtonSetComponent,
    maxTableColumns = viewLayoutDefaults.maxTableColumns,
  } = props;
  const { name = entityType } = props;
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const orgId = useAppSelector(UserSelector.orgId)!;
  const role = useAppSelector(UserSelector.role)!;
  const actions = useAppSelector(EntityActionRegistrySelector.all);

  const [currentLayout, setCurrentLayout] = usePersistedState<SavedLayoutSerialized>(`${entityType}CurrentLayout`, makeDefaultViewLayout(entityType, [], maxTableColumns));
  const [selectedLayoutId, setSelectedLayoutId] = usePersistedState<ViewLayoutId>(`${entityType}SelectedLayoutId`, currentLayout.id);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [saveNewLayoutDialogOpen, setSaveNewLayoutDialogOpen] = useState(false);
  const [newLayout, setNewLayout] = useState<SavedLayoutSerialized | undefined>();

  const selectLayoutButtonRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: allowedColumns = [],
    error: columnsError,
    isLoading: columnsIsLoading,
  } = entityApi[entityType].useGetAllowedColumnsInfoQuery({ orgId });

  const actionColumnInfos = useMemo(() => {
    return _.chain(actions)
      .values()
      .filter(action => action.entityType === entityType)
      .filter(action => isEntityActionColumnItem(action))
      .filter(action => isEntityActionAllowed(action, role))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }))
      .map((action): ColumnInfo => ({
        name: action.id,
        displayName: action.displayName,
        type: ColumnType.String,
        pii: false,
        phi: false,
        custom: true,
        required: false,
        updatable: true,
        action: true,
      }))
      .value();
  }, [actions, entityType, role]);

  const columns = useMemo(() => {
    return [...allowedColumns, ...actionColumnInfos];
  }, [allowedColumns, actionColumnInfos]);

  const {
    data: savedLayouts = [],
    error: savedLayoutsError,
    isLoading: savedLayoutsLoading,
    isFetching: savedLayoutsIsFetching,
  } = savedLayoutApi.useGetSavedLayoutsQuery({
    orgId,
    query: { entityType },
  });

  const [addSavedLayout, {
    error: addSavedLayoutError,
    isLoading: addSavedLayoutIsLoading,
  }] = savedLayoutApi.useAddSavedLayoutMutation();

  const [updateSavedLayout, {
    error: updateSavedLayoutError,
  }] = savedLayoutApi.useUpdateSavedLayoutMutation();

  const [deleteSavedLayout, {
    error: deleteSavedLayoutError,
  }] = savedLayoutApi.useDeleteSavedLayoutMutation();

  //
  // Layouts
  //
  const defaultLayout = useMemo(() => {
    return makeDefaultViewLayout(entityType, columns, maxTableColumns);
  }, [columns, entityType, maxTableColumns]);

  const layouts = useMemo(() => {
    return [
      { ...defaultLayout },
      ...savedLayouts,
    ];
  }, [defaultLayout, savedLayouts]);

  const layoutsById = useMemo(() => {
    return _.keyBy(layouts, x => x.id);
  }, [layouts]);

  //
  // Visible Columns
  //
  const columnsMap = useMemo(() => {
    return _.keyBy(columns, x => getFullyQualifiedColumnName(x));
  }, [columns]);

  const visibleColumns = useMemo(() => {
    return Object.keys(currentLayout.columns)
      .filter(key => currentLayout.columns[key].order >= 0)
      .map(key => columnsMap[key])
      .filter(column => !!column)
      .sort((a, b) => {
        const orderA = currentLayout.columns[getFullyQualifiedColumnName(a!)].order;
        const orderB = currentLayout.columns[getFullyQualifiedColumnName(b!)].order;
        return orderA - orderB;
      }) as ColumnInfo[];
  }, [columnsMap, currentLayout.columns]);

  const setVisibleColumns = useCallback((visibleColumnsNew: ColumnInfo[]) => {
    const columnsNew: ColumnsConfig = {};
    visibleColumnsNew.forEach((column, order) => {
      columnsNew[getFullyQualifiedColumnName(column)] = { order };
    });

    if (!deepEquals(currentLayout.columns, columnsNew)) {
      setCurrentLayout({
        ...currentLayout,
        columns: columnsNew,
      });
    }
  }, [currentLayout, setCurrentLayout]);

  //
  // Selector
  //
  const selectLayout = useCallback((layout: SavedLayoutSerialized) => {
    setSelectedLayoutId(layout.id);
    setCurrentLayout({ ...layout });
    setSelectorOpen(false);
  }, [setCurrentLayout, setSelectedLayoutId]);

  const handleSaveNewLayout = useCallback((layout: SavedLayoutSerialized) => {
    setNewLayout({ ...layout });
    setSaveNewLayoutDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback(async (layout: SavedLayoutSerialized) => {
    if (isDefaultLayout(layout.id)) {
      throw new Error('Unable to delete default layout');
    }

    const result = await dispatch(Modal.confirm(`Delete Layout "${layout.name}"`, 'Are you sure?', {
      destructive: true,
      confirmText: 'Delete',
    }));

    if (!result?.button?.value) {
      return;
    }

    await deleteSavedLayout({
      orgId,
      savedLayoutId: layout.id,
    });
  }, [dispatch, deleteSavedLayout, orgId]);

  //
  // Layout Buttons
  //
  const hasChanges = useMemo(() => {
    const layout = layoutsById[currentLayout.id];
    if (!layout) {
      return false;
    }

    // Layouts much have at least one column to be saved.
    if (Object.keys(currentLayout.columns).length === 0) {
      return false;
    }

    return (
      !deepEquals(layout.columns, currentLayout.columns)
      || !deepEquals(layout.actions, currentLayout.actions)
      || layout.name !== currentLayout.name
    );
  }, [currentLayout.actions, currentLayout.columns, currentLayout.id, currentLayout.name, layoutsById]);

  const handleSaveClick = useCallback(async () => {
    if (isDefaultLayout(currentLayout.id)) {
      handleSaveNewLayout(currentLayout);
      return;
    }

    const result = await dispatch(Modal.confirm(`Overwrite Layout "${currentLayout.name}"`, 'Are you sure?', {
      confirmText: 'Overwrite',
    }));

    if (!result?.button?.value) {
      return;
    }

    await updateSavedLayout({
      orgId,
      savedLayoutId: selectedLayoutId,
      body: currentLayout!,
    });
  }, [currentLayout, dispatch, handleSaveNewLayout, orgId, selectedLayoutId, updateSavedLayout]);

  const handleSaveNewLayoutConfirm = useCallback(async (layout: SavedLayoutSerialized) => {
    let layoutSaved: SavedLayoutSerialized;
    try {
      layoutSaved = await addSavedLayout({
        orgId,
        body: layout,
      }).unwrap();
    } catch (err) {
      return;
    }

    selectLayout(layoutSaved);
    setSaveNewLayoutDialogOpen(false);
  }, [addSavedLayout, selectLayout, orgId]);

  const handleRevertClick = useCallback(async () => {
    const result = await dispatch(Modal.confirm('Revert Layout Changes', 'Are you sure?', {
      destructive: true,
      confirmText: 'Revert',
    }));

    if (!result?.button?.value) {
      return;
    }

    const selectedLayoutReverted = layouts.find(x => x.id === selectedLayoutId);
    selectLayout({ ...selectedLayoutReverted! });
  }, [selectLayout, dispatch, layouts, selectedLayoutId]);

  //
  // Effects
  //
  useEffectError(columnsError, 'Get Columns', 'Failed to get columns');
  useEffectError(savedLayoutsError, 'Get Saved Layouts', 'Failed to get saved layouts');
  useEffectError(addSavedLayoutError, 'Add Saved Layout', 'Failed to add saved layout');
  useEffectError(updateSavedLayoutError, 'Update Saved Layout', 'Failed to update saved layout');
  useEffectError(deleteSavedLayoutError, 'Delete Saved Layout', 'Failed to delete saved layout');

  // If we can't find our current layout, revert back to the default.
  useEffect(() => {
    if (savedLayoutsIsFetching || addSavedLayoutIsLoading) {
      return;
    }

    if (!layoutsById[currentLayout.id]) {
      selectLayout(defaultLayout);
    }
  }, [addSavedLayoutIsLoading, selectLayout, currentLayout.id, defaultLayout, layoutsById, savedLayouts, savedLayoutsIsFetching]);

  // If all columns are turned off, reset them all to enabled.
  useEffect(() => {
    if (!columnsIsLoading && visibleColumns.length === 0) {
      setVisibleColumns(columns.slice(0, maxTableColumns));
    }
  }, [columnsIsLoading, columns, maxTableColumns, setVisibleColumns, visibleColumns.length]);

  //
  // Render
  //
  if (!columns) {
    return <></>;
  }

  return (
    <>
      <PageHeader
        title={header.title}
        help={header.help}
        leftComponent={(
          <>
            {!savedLayoutsLoading && (
              <>
                <Button
                  aria-label="Select Layout"
                  onClick={() => setSelectorOpen(true)}
                  size="large"
                  startIcon={<ChevronRightIcon color="action" />}
                  variant="text"
                  ref={selectLayoutButtonRef}
                >
                  <span className={classes.filterButtonText}>
                    {currentLayout?.name ?? ''}
                  </span>
                </Button>

                <SavedItemSelector
                  anchorEl={selectLayoutButtonRef.current}
                  open={selectorOpen}
                  onClose={() => setSelectorOpen(false)}
                  items={layouts}
                  onItemClick={selectLayout}
                  onItemDuplicateClick={handleSaveNewLayout}
                  onItemDeleteClick={handleDeleteClick}
                  showItemDuplicateButton={() => role.canManageGroup}
                  showItemDeleteButton={layout => role.canManageGroup && !isDefaultLayout(layout.id)}
                />

                {role.canManageGroup && hasChanges && (
                  <ViewLayoutButtons
                    selectedLayoutId={selectedLayoutId}
                    onSaveClick={handleSaveClick}
                    onRevertClick={handleRevertClick}
                  />
                )}
              </>
            )}
          </>
        )}
        rightComponent={(
          <>
            <ColumnSelector
              columns={columns}
              entityType={entityType}
              visibleColumns={visibleColumns}
              onVisibleColumnsChange={setVisibleColumns}
            />
            <EntityActionSelector entityType={entityType} />
          </>
        )}
      />

      {ButtonSetComponent && (
        <ButtonSetComponent />
      )}

      <View
        layout={{
          entityType,
          columns,
          name,
          visibleColumns,
        }}
        idColumn={idColumn}
      />

      <SaveNewLayoutDialog
        open={saveNewLayoutDialogOpen}
        layout={newLayout}
        onSave={handleSaveNewLayoutConfirm}
        onCancel={() => setSaveNewLayoutDialogOpen(false)}
      />
    </>
  );
}

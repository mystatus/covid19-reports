import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getFullyQualifiedColumnName,
  ColumnInfo,
  ColumnsConfig,
  EntityType,
  friendlyColumnValue,
  SavedLayoutSerialized,
  SortedQuery,
} from '@covid19-reports/shared';
import _ from 'lodash';
import deepEquals from 'fast-deep-equal';
import {
  TableRowOptions,
} from '../tables/table-custom-columns-content';
import { UserSelector } from '../../selectors/user.selector';
import usePersistedState from '../../hooks/use-persisted-state';
import { useAppSelector } from '../../hooks/use-app-selector';
import PageHeader, {
  PageHeaderHelpProps,
} from '../page-header/page-header';
import { entityApi } from '../../api/entity.api';
import View from './view';
import { ViewLayoutSelector } from './view-layout-selector';
import { Modal } from '../../actions/modal.actions';
import { savedLayoutApi } from '../../api/saved-layout.api';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import {
  isExistingLayout,
  makeDefaultViewLayout,
  viewLayoutDefaults,
  ViewLayoutId,
} from './view-layout-utils';
import { SaveNewLayoutDialog } from '../pages/roster-page/save-new-layout-dialog';
import { useEffectError } from '../../hooks/use-effect-error';
import { ColumnSelector } from './column-selector';

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

export const defaultRowOptions: TableRowOptions = {
  renderCell: friendlyColumnValue,
};

export type ViewLayoutProps = {
  entityType: EntityType;
  idColumn: string | ((row: any) => string);
  header: {
    title: string;
    help?: PageHeaderHelpProps;
  };
  maxTableColumns?: number;
  name?: string;
  rowOptions?: TableRowOptions;

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
    rowOptions = defaultRowOptions,
  } = props;
  const { name = entityType } = props;
  const dispatch = useAppDispatch();

  const orgId = useAppSelector(UserSelector.orgId)!;

  const [currentLayout, setCurrentLayout] = usePersistedState<SavedLayoutSerialized>(`${entityType}CurrentLayout`, makeDefaultViewLayout(entityType, [], maxTableColumns));
  const [selectedLayoutId, setSelectedLayoutId] = usePersistedState<ViewLayoutId>(`${entityType}SelectedLayoutId`, currentLayout.id);
  const [layoutSelectorOpen, setLayoutSelectorOpen] = useState(false);
  const [saveNewLayoutDialogOpen, setSaveNewLayoutDialogOpen] = useState(false);

  const {
    data: columns = [],
    error: columnsError,
    isLoading: columnsIsLoading,
  } = entityApi[entityType].useGetAllowedColumnsInfoQuery({ orgId });

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
    visibleColumnsNew.forEach((column, index) => {
      columnsNew[getFullyQualifiedColumnName(column)] = { order: index };
    });

    if (!deepEquals(currentLayout.columns, columnsNew)) {
      setCurrentLayout({
        ...currentLayout,
        columns: columnsNew,
      });
    }
  }, [currentLayout, setCurrentLayout]);

  //
  // Layout Selector
  //
  const changeSelection = useCallback((layout: SavedLayoutSerialized) => {
    setSelectedLayoutId(layout.id);
    setCurrentLayout({ ...layout });
    setLayoutSelectorOpen(false);
  }, [setCurrentLayout, setSelectedLayoutId]);

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

  const handleLayoutSelectorClick = useCallback(() => {
    setLayoutSelectorOpen(true);
  }, [setLayoutSelectorOpen]);

  const handleLayoutSelectorClose = useCallback(() => {
    setLayoutSelectorOpen(false);
  }, [setLayoutSelectorOpen]);

  const handleLayoutSelectorSaveClick = useCallback(async () => {
    if (!isExistingLayout(selectedLayoutId)) {
      setSaveNewLayoutDialogOpen(true);
      return;
    }

    const result = await dispatch(Modal.confirm('Overwrite Saved Layout', 'Are you sure?', {
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
  }, [currentLayout, dispatch, orgId, selectedLayoutId, updateSavedLayout]);

  const handleLayoutSelectorSaveAsClick = useCallback(() => {
    setSaveNewLayoutDialogOpen(true);
  }, [setSaveNewLayoutDialogOpen]);

  const handleSaveNewLayoutConfirm = useCallback(async (layoutName: string) => {
    let newLayout: SavedLayoutSerialized;
    try {
      newLayout = await addSavedLayout({
        orgId,
        body: {
          ...currentLayout,
          name: layoutName,
        },
      }).unwrap();
    } catch (err) {
      return;
    }

    changeSelection(newLayout);
    setSaveNewLayoutDialogOpen(false);
  }, [addSavedLayout, changeSelection, currentLayout, orgId]);

  const handleLayoutSelectorDeleteClick = useCallback(async () => {
    if (isExistingLayout(selectedLayoutId)) {
      const result = await dispatch(Modal.confirm('Delete Saved Layout', 'Are you sure?', {
        destructive: true,
        confirmText: 'Delete',
      }));

      if (!result?.button?.value) {
        return;
      }

      await deleteSavedLayout({
        orgId,
        savedLayoutId: selectedLayoutId,
      });
    }
  }, [selectedLayoutId, dispatch, deleteSavedLayout, orgId]);

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
      changeSelection(defaultLayout);
    }
  }, [addSavedLayoutIsLoading, changeSelection, currentLayout.id, defaultLayout, layoutsById, savedLayouts, savedLayoutsIsFetching]);

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
              <ViewLayoutSelector
                columns={columns}
                layouts={layouts}
                selectedLayoutId={selectedLayoutId}
                hasChanges={hasChanges}
                open={layoutSelectorOpen}
                onClick={handleLayoutSelectorClick}
                onClose={handleLayoutSelectorClose}
                onSaveClick={handleLayoutSelectorSaveClick}
                onSaveAsClick={handleLayoutSelectorSaveAsClick}
                onDeleteClick={handleLayoutSelectorDeleteClick}
                onSelectionChange={changeSelection}
              />
            )}
          </>
        )}
        rightComponent={(
          <ColumnSelector
            columns={columns}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
          />
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
          rowOptions,
          visibleColumns,
        }}
        idColumn={idColumn}
      />

      <SaveNewLayoutDialog
        open={saveNewLayoutDialogOpen}
        onSave={handleSaveNewLayoutConfirm}
        onCancel={() => setSaveNewLayoutDialogOpen(false)}
      />

    </>
  );
}

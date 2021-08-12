import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import deepEquals from 'fast-deep-equal';
import {
  ColumnInfo,
  ColumnsConfig,
  EntityType,
  friendlyColumnValue,
  SavedLayoutSerialized,
  SortedQuery,
} from '@covid19-reports/shared';
import useEffectDebounced from '../../hooks/use-effect-debounced';
import {
  TableRowOptions,
} from '../tables/table-custom-columns-content';
import useStyles from './view-layout.styles';
import { formatErrorMessage } from '../../utility/errors';
import { Modal } from '../../actions/modal.actions';
import { UserSelector } from '../../selectors/user.selector';
import usePersistedState from '../../hooks/use-persisted-state';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { useAppSelector } from '../../hooks/use-app-selector';
import { SavedLayoutClient } from '../../client/saved-layout.client';
import { SaveNewLayoutDialog } from '../pages/roster-page/save-new-layout-dialog';

export type LayoutConfigParams = SortedQuery & {
  // actions: ActionInfo[];
  columns: ColumnInfo[];
  entityType: EntityType;
  maxTableColumns?: number;
  name: string;
  visibleColumns: ColumnInfo[];
};

export type Layout = LayoutConfigParams & {
  rowOptions?: TableRowOptions;
  setSortedQuery: React.Dispatch<React.SetStateAction<SortedQuery>>;
};

export type ViewLayoutProps<K extends keyof typeof EntityType> = {
  allowedColumns: (orgId: number) => Promise<ColumnInfo[]>;
  children: (layout: Layout, editor: JSX.Element) => JSX.Element;
  entityType: K extends 'Observation' ? EntityType.Observation : EntityType.RosterEntry;
  maxTableColumns?: number;
  name?: string;
  rowOptions?: TableRowOptions;
};

export const defaultRowOptions: TableRowOptions = {
  renderCell: friendlyColumnValue,
};

type LayoutId = SavedLayoutSerialized['id'] | null;
const defaultMaxTableColumns = 7;

export type LayoutSelectorProps = {
  columns: ColumnInfo[];
  currentLayout: SavedLayoutSerialized;
  entityType: EntityType;
  fetchSavedLayouts: () => PromiseLike<any>;
  onChange: (layout: SavedLayoutSerialized | null) => void;
  savedLayouts: SavedLayoutSerialized[];
  selectedLayout: SavedLayoutSerialized;
};

export function LayoutSelector({ currentLayout, entityType, fetchSavedLayouts, onChange, savedLayouts, selectedLayout }: LayoutSelectorProps) {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { id: orgId } = useAppSelector(UserSelector.org)!;
  const [selectLayoutMenuOpen, setSelectLayoutMenuOpen] = useState(false);
  const [saveNewLayoutDialogOpen, setSaveNewLayoutDialogOpen] = useState(false);
  const selectLayoutButtonRef = useRef<HTMLButtonElement>(null);

  const selectLayout = useCallback((layoutId: LayoutId) => {
    setSelectLayoutMenuOpen(false);
    onChange(layoutId !== null ? savedLayouts.find(x => x.id === layoutId) ?? null : null);
  }, [onChange, savedLayouts, setSelectLayoutMenuOpen]);

  const handleLayoutSaveClick = useCallback(async () => {
    if (selectedLayout.id === -1) {
      setSaveNewLayoutDialogOpen(true);
      return;
    }

    const result = await dispatch(Modal.confirm('Overwrite Saved Layout', 'Are you sure?', {
      confirmText: 'Overwrite',
    }));

    if (!result?.button?.value) {
      return;
    }

    const { actions, columns, name } = currentLayout;
    onChange(await SavedLayoutClient.updateSavedLayout(orgId, selectedLayout.id, { actions, columns, entityType, name }));
    await fetchSavedLayouts();
  }, [currentLayout, dispatch, entityType, fetchSavedLayouts, onChange, orgId, selectedLayout]);

  const handleLayoutDeleteClick = useCallback(async () => {
    if (selectedLayout.id !== -1) {
      const result = await dispatch(Modal.confirm('Delete Saved Layout', 'Are you sure?', {
        destructive: true,
        confirmText: 'Delete',
      }));

      if (!result?.button?.value) {
        return;
      }

      onChange(null);
      await SavedLayoutClient.deleteSavedLayout(orgId, selectedLayout.id);
      await fetchSavedLayouts();
    }
  }, [dispatch, fetchSavedLayouts, onChange, orgId, selectedLayout]);

  const layoutHasChanges = useMemo(() => {
    if (!selectedLayout || !currentLayout || Object.keys(selectedLayout.columns).length === 0 || Object.keys(selectedLayout.columns).length === 0) {
      return false;
    }
    return !(deepEquals(selectedLayout.columns ?? {}, currentLayout.columns ?? {})
      && deepEquals(selectedLayout.actions ?? {}, currentLayout.actions ?? {})
      && selectedLayout.name === currentLayout.name);
  }, [selectedLayout, currentLayout]);

  const handleSaveNewLayoutConfirm = useCallback(async (name: string) => {
    try {
      const { actions, columns } = currentLayout;
      const savedLayout = await SavedLayoutClient.addSavedLayout(orgId, { actions, columns, entityType, name });
      await fetchSavedLayouts();
      setSaveNewLayoutDialogOpen(false);
      onChange(savedLayout);
    } catch (err) {
      void dispatch(Modal.alert('Save New Layout', `Unable to save layout: ${formatErrorMessage(err)}`));
    }
  }, [currentLayout, dispatch, entityType, fetchSavedLayouts, onChange, orgId, setSaveNewLayoutDialogOpen]);

  const LayoutRow = useCallback(({ layout }) => (
    <MenuItem
      className={classes.menuItem}
      onClick={() => selectLayout(layout.id)}
    >
      <span className={classes.layoutName}>{layout.name}</span>

      <Tooltip title="Duplicate this layout">
        <IconButton
          aria-label="Duplicate"
          component="span"
          className={classes.iconButton}
          onClick={() => setSaveNewLayoutDialogOpen(true)}
        >
          <FileCopyIcon />
        </IconButton>
      </Tooltip>

      {layout.id !== -1 && (
        <Tooltip title="Delete this layout">
          <IconButton
            aria-label="Delete"
            className={classes.deleteButton}
            component="span"
            onClick={handleLayoutDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </MenuItem>
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  ), [selectLayout, setSaveNewLayoutDialogOpen, handleLayoutDeleteClick]);

  return (
    <Box display="flex">
      {(savedLayouts.length > 1) && (
        <Button
          aria-label="Select Layout"
          onClick={() => setSelectLayoutMenuOpen(!selectLayoutMenuOpen)}
          size="large"
          startIcon={<ChevronRightIcon color="action" />}
          variant="text"
          ref={selectLayoutButtonRef}
        >
          <span className={classes.filterButtonText}>
            {currentLayout?.name ?? ''}
          </span>
        </Button>
      )}

      {layoutHasChanges && (
        <Button
          aria-label="Save"
          className={classes.button}
          onClick={handleLayoutSaveClick}
          size="small"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          {savedLayouts.length > 1 ? 'Save' : 'Save Layout'}
        </Button>
      )}

      <Menu
        anchorEl={selectLayoutButtonRef.current}
        keepMounted
        open={selectLayoutMenuOpen}
        onClose={() => setSelectLayoutMenuOpen(false)}
      >
        {savedLayouts.map(savedLayout => (
          <div key={savedLayout.id}>
            <LayoutRow layout={savedLayout} />
          </div>
        ))}
      </Menu>

      <SaveNewLayoutDialog
        open={saveNewLayoutDialogOpen}
        onSave={handleSaveNewLayoutConfirm}
        onCancel={() => setSaveNewLayoutDialogOpen(false)}
      />
    </Box>
  );
}

function makeDefaultLayout(entityType: EntityType, columns: ColumnInfo[], maxTableColumns: number) {
  const initial: SavedLayoutSerialized = {
    id: -1,
    name: 'Default',
    entityType,
    columns: {},
    actions: {},
  };
  columns.slice(0, maxTableColumns).forEach((column, index) => {
    initial.columns[column.name] = { order: index };
  });
  return initial;
}

export default function ViewLayout<E extends EntityType>({
  allowedColumns,
  children,
  entityType,
  maxTableColumns = defaultMaxTableColumns,
  rowOptions = defaultRowOptions,
  ...restProps
}: ViewLayoutProps<E>) {
  const { name = entityType } = restProps;
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { id: orgId } = useAppSelector(UserSelector.org)!;
  const [columnInfos, setColumnInfos] = useState<ColumnInfo[]>([]);
  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const visibleColumnsButtonRef = useRef<HTMLSpanElement>(null);
  const [sortedQuery, setSortedQuery] = usePersistedState<SortedQuery>(`${name}Sort`);
  const [currentLayout, setCurrentLayout] = usePersistedState<SavedLayoutSerialized>(`${entityType}CurrentLayout`, makeDefaultLayout(entityType, columnInfos, maxTableColumns));
  const [selectedLayout, setSelectedLayout] = useState<SavedLayoutSerialized>(makeDefaultLayout(entityType, columnInfos, maxTableColumns));
  const [savedLayouts, setSavedLayouts] = useState<SavedLayoutSerialized[]>([]);

  const fetchSavedLayouts = useCallback(async (columns = columnInfos) => {
    try {
      const layouts: SavedLayoutSerialized[] = [
        makeDefaultLayout(entityType, columns, maxTableColumns),
        ...await SavedLayoutClient.getSavedLayouts(orgId, { entityType }),
      ];
      setSavedLayouts(layouts);

      if (currentLayout.id !== -1 && !layouts.find(l => l.id === currentLayout.id)) {
        setCurrentLayout({
          ...currentLayout,
          name: 'Default',
          id: -1,
        });
      }
      return layouts;
    } catch (error) {
      void dispatch(Modal.alert('Get Saved Layouts', formatErrorMessage(error, 'Failed to get saved layouts')));
    }
    return [];
  }, [currentLayout, columnInfos, dispatch, entityType, maxTableColumns, orgId, setCurrentLayout]);

  useEffectDebounced(() => {
    // Loads columnInfos and savedLayouts, then handles setting of current and selected layout
    if (!columnInfos.length) {
      void (async () => {
        try {
          const columns = await allowedColumns(orgId);
          setColumnInfos(columns);

          const layouts = await fetchSavedLayouts(columns);

          // currentLayout loads from localStorage but could be edited, so use currentLayout.id
          // to find the the original saved layout.
          const layout = layouts.find(l => l.id === currentLayout.id) ?? layouts[0];
          setSelectedLayout(layout);

          // Don't allow the UI get in the weird state of no columns.
          if (Object.keys(currentLayout.columns).length === 0) {
            setCurrentLayout(layout);
          }
        } catch (error) {
          void dispatch(Modal.alert('Error', formatErrorMessage(error, 'Failed to fetch the available Entity columns')));
        }
      })();
    }
  }, [allowedColumns, columnInfos, currentLayout, dispatch, entityType, fetchSavedLayouts, orgId, maxTableColumns, setColumnInfos, setCurrentLayout, setSelectedLayout]);

  const handleSavedLayoutChange = useCallback((layout: SavedLayoutSerialized | null) => {
    const layoutOrDefault = layout ?? savedLayouts[0];
    setSelectedLayout(layoutOrDefault);
    setCurrentLayout(layoutOrDefault);
  }, [savedLayouts, setCurrentLayout, setSelectedLayout]);

  const visibleColumns = useMemo(() => {
    return Object.keys(currentLayout.columns)
      .map(key => columnInfos.find(c => c.name === key))
      .filter(column => !!column)
      .sort((a, b) => {
        if (currentLayout.columns[a!.name].order < currentLayout.columns[b!.name].order) {
          return -1;
        }
        if (currentLayout.columns[a!.name].order > currentLayout.columns[b!.name].order) {
          return 1;
        }
        return 0;
      }) as ColumnInfo[];
  }, [columnInfos, currentLayout]);

  const setVisibleColumns = useCallback((newVisibleColumns: ColumnInfo[]) => {
    const result: ColumnsConfig = {};
    newVisibleColumns.forEach((column, index) => {
      result[column.name] = { order: index };
    });
    setCurrentLayout({ ...currentLayout, columns: result });
  }, [currentLayout, setCurrentLayout]);

  return (
    <>
      {children({
        columns: columnInfos,
        entityType,
        name: name ?? entityType,
        rowOptions,
        visibleColumns,
        ...sortedQuery,
        setSortedQuery,
      }, (
        <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.fullWidth}>
          <LayoutSelector
            columns={visibleColumns}
            currentLayout={currentLayout}
            entityType={entityType}
            fetchSavedLayouts={fetchSavedLayouts}
            onChange={handleSavedLayoutChange}
            savedLayouts={savedLayouts}
            selectedLayout={selectedLayout}
          />

          <Button
            aria-label="Visible columns"
            className={classes.tableHeaderButton}
            onClick={() => setVisibleColumnsMenuOpen(!visibleColumnsMenuOpen)}
            size="small"
            startIcon={<ViewWeekIcon />}
            variant="outlined"
          >
            <span ref={visibleColumnsButtonRef}>
              Columns
            </span>
          </Button>

          <Menu
            id="layout-visible-columns-menu"
            anchorEl={visibleColumnsButtonRef.current}
            keepMounted
            open={Boolean(visibleColumnsMenuOpen)}
            onClose={() => setVisibleColumnsMenuOpen(false)}
          >
            {columnInfos.map(column => (
              <MenuItem key={column.name} className={classes.columnItem}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      color="primary"
                      checked={visibleColumns.some(col => col.name === column.name)}
                      onChange={event => {
                        const { checked } = event.target;
                        if (checked) {
                          setVisibleColumns(columnInfos.filter(col => col.name === column.name || visibleColumns.some(({ name: n }) => n === col.name)));
                        } else {
                          setVisibleColumns([...visibleColumns.filter(col => col.name !== column.name)]);
                        }
                      }}
                    />
                  )}
                  label={column.displayName}
                />
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ))}
    </>
  );
}

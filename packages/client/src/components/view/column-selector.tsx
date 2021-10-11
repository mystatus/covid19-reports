import React, {
  CSSProperties,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableRubric,
  DraggableStateSnapshot,
  DragUpdate,
  Droppable,
  DroppableStateSnapshot,
  DropResult,
} from 'react-beautiful-dnd';
import { getFullyQualifiedColumnName, ColumnInfo, EntityType } from '@covid19-reports/shared';
import { Box, Button, Menu } from '@material-ui/core';
import useStyles from './column-selector.styles';
import { useAppSelector } from '../../hooks/use-app-selector';
import { EntityActionRegistrySelector } from '../../selectors/entity-action-registry.selector';

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const reorderColumnMap = (columnMap: Record<string, ColumnInfo[]>, dropResult: DropResult) => {
  const { source, destination } = dropResult;
  const destDroppableId = destination?.droppableId ?? 'available';
  const destIndex = destination?.index ?? 0;
  const current = [...columnMap[source.droppableId]];
  const next = [...columnMap[destDroppableId]];
  const target = current[source.index];


  // moving to same list
  if (source.droppableId === destDroppableId) {
    const reordered: ColumnInfo[] = reorder(current, source.index, destIndex);
    return {
      ...columnMap,
      [source.droppableId]: reordered,
    };
  }

  // moving to another list
  current.splice(source.index, 1);
  next.splice(destIndex, 0, target);

  return {
    ...columnMap,
    [source.droppableId]: current,
    [destDroppableId]: next,
  };
};

const getItemStyle = (
  droppableId: string,
  visibleColumns: ColumnInfo[],
  droppableSnapshot: DroppableStateSnapshot,
  draggableSnapshot: DraggableStateSnapshot,
  draggableProvided: DraggableProvided,
  draggableRubric: DraggableRubric,
) => {
  const isItemInRemoveTarget = (
    droppableId === 'available'
    && droppableSnapshot.isDraggingOver
    && visibleColumns.some(v => getFullyQualifiedColumnName(v) === droppableSnapshot.draggingOverWith)
  );

  const style: CSSProperties = {
    ...draggableProvided.draggableProps.style,
    backgroundColor: isItemInRemoveTarget ? 'transparent' : 'white',
    borderColor: isItemInRemoveTarget ? 'transparent' : 'white',
  };

  if (!draggableSnapshot.isDragging) {
    return style;
  }

  const overVisible = draggableSnapshot.draggingOver === 'visible';
  const fromVisible = draggableRubric.source.droppableId === 'visible';
  const isRemove = fromVisible && !overVisible;

  style.boxShadow = '0 0 12px #40808080';
  style.borderColor = isRemove ? '#fbb' : '#d99';
  style.borderRadius = 6;
  style.backgroundColor = isRemove ? '#fbb' : '#beb';

  if (draggableSnapshot.isDropAnimating && draggableSnapshot.dropAnimation) {
    const { curve, duration } = draggableSnapshot.dropAnimation;
    style.backgroundColor = isRemove ? '#efe' : style.backgroundColor;
    style.boxShadow = '0 0 0';
    style.opacity = isRemove ? 0 : 1;
    style.transition = `all ${curve} ${duration}s, opacity ${curve} ${0.1}s`;
    style.transform = `${style.transform} scale(${isRemove ? '0.1' : '1'})`;
  }

  return style;
};

const getListStyle = (
  droppableId: string,
  visibleColumns: ColumnInfo[],
  droppableSnapshot: DroppableStateSnapshot,
) => {
  const isRemoveTarget = (
    droppableId === 'available'
    && droppableSnapshot.isDraggingOver
    && visibleColumns.some(v => getFullyQualifiedColumnName(v) === droppableSnapshot.draggingOverWith)
  );

  return {
    background: isRemoveTarget ? '#fbb' : '#fbfbfb',
    color: isRemoveTarget ? '#fbb' : '#444',
    border: isRemoveTarget ? '1px solid #f88' : '1px solid white',
    borderRadius: isRemoveTarget ? '6px' : 0,
    padding: 0,
    margin: '6px 12px 8px',
    opacity: isRemoveTarget ? 0.4 : 1,
    width: 300,
    zIndex: isRemoveTarget ? 1 : 3,
  };
};

const columnSectionNames: Record<string, string> = {
  visible: 'Visible Columns',
  available: 'Available Columns',
};

export type ColumnSelectorProps = {
  columns: ColumnInfo[];
  entityType: EntityType;
  onVisibleColumnsChange: (columns: ColumnInfo[]) => void;
  visibleColumns: ColumnInfo[];
};

export function ColumnSelector(props: ColumnSelectorProps) {
  const { columns, entityType, onVisibleColumnsChange, visibleColumns } = props;
  const classes = useStyles();

  const actions = useAppSelector(EntityActionRegistrySelector.all);

  const [visibleColumnsMenuOpen, setVisibleColumnsMenuOpen] = useState(false);
  const visibleColumnsButtonRef = useRef<HTMLSpanElement>(null);
  const [isDropDisabled, setIsDropDisabled] = useState(false);

  const handleDragUpdate = useCallback((update: DragUpdate) => {
    const { destination, source } = update;
    if (!destination) {
      return;
    }
    const shouldBeDisabled = source.droppableId === 'available' && (!destination || destination.droppableId === 'available');
    if (isDropDisabled !== shouldBeDisabled) {
      setIsDropDisabled(shouldBeDisabled);
    }
  }, [isDropDisabled, setIsDropDisabled]);

  const columnInfoMap = useMemo((): Record<string, ColumnInfo[]> => ({
    visible: visibleColumns,
    available: columns
      .filter(t => visibleColumns.every(v => getFullyQualifiedColumnName(v) !== getFullyQualifiedColumnName(t)))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' })),
  }), [columns, visibleColumns]);

  const handleDragEnd = useCallback((result: DropResult) => {
    setIsDropDisabled(false);
    if (!result.destination) {
      return;
    }
    const columnMap = reorderColumnMap(columnInfoMap, result);
    onVisibleColumnsChange([...columnMap.visible]);
  }, [columnInfoMap, onVisibleColumnsChange]);

  const entityActions = useMemo(() => {
    return _.chain(actions)
      .values()
      .filter(action => action.entityType === entityType)
      .keyBy(action => action.id)
      .value();
  }, [actions, entityType]);

  const isAction = useCallback((column: ColumnInfo) => {
    return entityActions[column.name];
  }, [entityActions]);

  return (
    <>
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
        <div>
          <div className={classes.dragHint}>Drag &amp; drop to arrange columns</div>

          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragUpdate={handleDragUpdate}
          >
            {Object.keys(columnInfoMap).map(key => (
              <div key={key} className={key === 'available' ? classes.availableList : ''}>
                <div className={classes.columnSelectSection}>
                  {columnSectionNames[key]}
                </div>
                {key === 'available' && (
                  <div className={classes.deleteTarget}>
                    Remove Column from Layout
                  </div>
                )}
                <Droppable droppableId={key} isDropDisabled={key === 'available' && isDropDisabled}>
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      ref={droppableProvided.innerRef}
                      style={getListStyle(key, visibleColumns, droppableSnapshot)}
                      className={classes.droppableList}
                    >
                      {columnInfoMap[key].map((column, index) => (
                        <Draggable
                          key={getFullyQualifiedColumnName(column)}
                          draggableId={getFullyQualifiedColumnName(column)}
                          index={index}
                          disableInteractiveElementBlocking
                        >
                          {(draggableProvided, draggableSnapshot, draggableRubric) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              className={classes.draggableItem}
                              style={getItemStyle(
                                key,
                                visibleColumns,
                                droppableSnapshot,
                                draggableSnapshot,
                                draggableProvided,
                                draggableRubric,
                              )}
                            >
                              <Box display="flex" width="100%" justifyContent="space-between" alignItems="center">
                                <span>
                                  {column.displayName}
                                  {column.table && <span className={classes.tableName}>({column.table})</span>}
                                </span>
                                <Box display="flex" alignItems="center">
                                  {column.pii && <span className={classes.phipii}>PII</span>}
                                  {column.phi && <span className={classes.phipii}>PHI</span>}
                                  {isAction(column) && (
                                    <span className={classes.phipii}>
                                      <FlashOnOutlinedIcon fontSize="small" opacity="0.8" color="action" />
                                    </span>
                                  )}
                                </Box>
                              </Box>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </Menu>
    </>
  );
}

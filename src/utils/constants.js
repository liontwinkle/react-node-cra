import React, { forwardRef } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckIcon from '@material-ui/icons/Check';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';

export const ruleStringItems = [
  { key: 'less', label: 'less' },
  { key: 'less_or_equal', label: 'less or equal' },
  { key: 'greater', label: 'greater' },
  { key: 'greater_or_equal', label: 'greater or equal' },
  { key: 'begins_with', label: 'begins with' },
  { key: 'not_begins_with', label: 'not begins with' },
  { key: 'contains', label: 'contains' },
  { key: 'not_contains', label: 'not contains' },
  { key: 'ends_with', label: 'ends with' },
  { key: 'not_ends_with', label: 'not ends with' },
  { key: 'is_empty', label: 'is empty' },
  { key: 'is_not_empty', label: 'is not empty' },
  { key: 'equal', label: 'equal' },
  { key: 'not_equal', label: 'not equal' },
  { key: 'is_null', label: 'is null' },
  { key: 'is_not_null', label: 'is not null' },
];

export const ruleNumberItems = [
  { key: 'less', label: 'less' },
  { key: 'less_or_equal', label: 'less or equal' },
  { key: 'greater', label: 'greater' },
  { key: 'greater_or_equal', label: 'greater or equal' },
  { key: 'between', label: 'between' },
  { key: 'not_between', label: 'not between' },
  { key: 'equal', label: 'equal' },
  { key: 'not_equal', label: 'not equal' },
  { key: 'is_null', label: 'is null' },
  { key: 'is_not_null', label: 'is not null' },
];

export const ruleKeyTypes = [
  { key: 'string', label: 'String' },
  { key: 'number', label: 'Number' },
];

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBoxIcon {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <CheckIcon {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <ClearIcon {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutlineIcon {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRightIcon {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <EditIcon {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAltIcon {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterListIcon {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPageIcon {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPageIcon {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRightIcon {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeftIcon {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <ClearIcon {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <SearchIcon {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpwardIcon {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <RemoveIcon {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumnIcon {...props} ref={ref} />),
};

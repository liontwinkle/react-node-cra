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

import { getObjectFromArray } from 'utils';

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

export const ruleTypes = getObjectFromArray(ruleKeyTypes);

export const propertyFieldTypes = [
  { key: 'string', label: 'String' },
  { key: 'select', label: 'Select' },
  { key: 'toggle', label: 'Toggle' },
  { key: 'text', label: 'Text' },
  { key: 'array', label: 'Array' },

];

export const propertyTypes = getObjectFromArray(propertyFieldTypes);

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


export const pagination = [
  { key: 50, label: '50 products' },
  { key: 100, label: '100 products' },
  { key: 150, label: '150 products' },
  { key: 200, label: '200 products' },
  { key: 500, label: '500 products' },
];

export const basis = [
  {
    label: 'Includes categories or products',
    key: 'include',
  },
  {
    label: 'Excludes categories or products',
    key: 'exclude',
  },
];
export const refer = [
  {
    label: 'Refer to product details',
    key: 'product_detail',
  },
];
export const match = [
  {
    label: 'Exact(text)',
    key: ':=',
  },
  {
    label: 'Contains(text)',
    key: ':',
  },
  {
    label: 'Literal(text)',
    key: '::',
  },
  {
    label: 'Lower or equals(number)',
    key: ':<=',
  },
  {
    label: 'Greater or equals(number)',
    key: ':>=',
  },
  {
    label: 'Lower',
    key: ':<',
  },
  {
    label: 'Greater',
    key: ':>',
  },
  {
    label: 'Equals',
    key: ':==',
  },
];
export const scope = [
  {
    label: 'All Categories',
    key: '0',
  },
];

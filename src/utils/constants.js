/* eslint-disable import/no-cycle,react/jsx-props-no-spreading */
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
import $ from 'jquery';

const autoFocusFirst = () => {
  setTimeout(() => {
    $($('.MuiTableRow-root input').first()[0].parentNode).addClass('Mui-focused');
  });
};

export const clientType = [
  { key: 'virtual', label: 'Virtual' },
  { key: 'native', label: 'Native' },
  { key: 'products', label: 'Products' },
  { key: 'attributes', label: 'Attributes' },
];

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

export const propertyFieldTypes = [
  { key: 'string', label: 'String' },
  { key: 'select', label: 'Select' },
  { key: 'toggle', label: 'Toggle' },
  { key: 'text', label: 'Text' },
  { key: 'array', label: 'Array' },
  { key: 'monaco', label: 'Monaco Edit' },
  { key: 'richtext', label: 'Rich Text Edit' },
  { key: 'urlpath', label: 'URL Path' },
  { key: 'image', label: 'Upload Image' },
];

export const propertyTypes = getObjectFromArray(propertyFieldTypes);

export const tableIcons = {
  Add: forwardRef((props, ref) => <AddBoxIcon {...props} onClick={autoFocusFirst} ref={ref} />),
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
    label: 'Contains all words case insensitive',
    key: 'contains_all_words_case_insensitive',
  },
  {
    label: 'Contains all words case sensitive',
    key: 'contains_all_words_case_sensitive',
  },
  {
    label: 'Contains any whole words case insensitive',
    key: 'contains_any_whole_words_case_insensitive',
  },
  {
    label: 'Contains any whole words case sensitive',
    key: 'contains_any_whole_words_case_sensitive',
  },
  {
    label: 'Exactly',
    key: 'exactly',
  },
  {
    label: 'Contains any tokens case insensitive',
    key: 'contains_any_tokens_case_insensitive',
  },
  {
    label: 'Contains any tokens case sensitive',
    key: 'contains_any_tokens_case_sensitive',
  },
];


export const scope = [
  {
    label: 'All Categories',
    key: '0',
  },
];

export const productViewTypes = [
  { key: 'data', label: 'Product Table' },
  { key: 'grid', label: 'Product Image' },
];

export const ruleType = [
  { key: 'normal', label: 'Normal' },
  { key: 'universal', label: 'Universal' },
  { key: 'default', label: 'Default' },
];

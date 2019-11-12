// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import PerfectScrollbar from 'react-perfect-scrollbar';
//
// import isEqual from 'lodash/isEqual';
//
//
// import './style.scss';
//
// class Proview extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       properties: {},
//       sections: [],
//       noSectionPropertyFields: [],
//     };
//   }
//
//   componentDidMount() {
//     const { propertyField, objectItem } = this.props;
//     const nonSection = (propertyField.propertyFields)
//       ? propertyField.propertyFields.filter((item) => item.section === null) : [];
//     this.setState({
//       noSectionPropertyFields: nonSection || [],
//       properties: objectItem.properties || {},
//       sections: propertyField.sections || [],
//     });
//   }
//
//   componentDidUpdate(prevProps) {
//     const { objectItem, propertyField } = this.props;
//     const { properties } = this.state;
//
//     if(!isEqual(objectItem.properties, prevProps.objectItem.properties)){
//
//     }
//   }
// }

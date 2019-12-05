import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getRootCategories } from 'utils';

import './style.scss';
import Loader from '../../Loader';

class TopCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchFlag: false,
      headData: [],
    };
  }

  componentDidMount() {
    const { categories } = this.props;
    this.updateState({
      headData: getRootCategories(categories, 'parent_id'),
      fetchFlag: true,
    });
  }

  updateState = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  render() {
    const { headData, fetchFlag } = this.state;
    return (
      <>
        {
          fetchFlag ? (
            <>
              {
                headData.length === 0 && (
                  <Redirect to="/" />
                )
              }
              <div className="top-category_container">
                <ul>
                  {
                    headData.map((item) => (
                      <li key={item._id}>{item.name}</li>
                    ))
                  }
                </ul>
              </div>
            </>
          ) : (
            <Loader size="large" />
          )
        }
      </>
    );
  }
}

TopCategory.propTypes = {
  categories: PropTypes.array.isRequired,
};

const mapStateToProps = (store) => ({
  categories: store.categoriesData.categories,
});
export default connect(
  mapStateToProps,
)(TopCategory);

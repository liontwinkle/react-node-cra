import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import { getRootCategories } from 'utils';
import Loader from 'components/Loader';
import { setRootCategory } from 'redux/actions/preview';

import './style.scss';

class TopCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchFlag: false,
    };
  }

  componentDidMount() {
    const { categories, setRootCategory } = this.props;
    const rootData = getRootCategories(categories, 'parent_id');
    setRootCategory(rootData);
    this.updateState({
      fetchFlag: true,
    });
  }

  componentDidUpdate(prevProps) {
    const { categories, setRootCategory } = this.props;
    if (categories !== prevProps.categories) {
      this.updateState({
        fetchFlag: false,
      });
      const rootData = getRootCategories(categories, 'parent_id');
      setRootCategory(rootData);
      this.updateState({
        fetchFlag: true,
      });
    }
  }

  updateState = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  render() {
    const { fetchFlag } = this.state;
    const { rootCategories } = this.props;
    return (
      <>
        {
          fetchFlag ? (
            <>
              {
                rootCategories.length === 0 && (
                  <Redirect to="/" />
                )
              }
              <div className="top-category_container">
                <ul>
                  {
                    rootCategories.map((item) => (
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
  rootCategories: PropTypes.array.isRequired,
  setRootCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  categories: store.categoriesData.categories,
  rootCategories: store.previewData.rootCategories,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setRootCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopCategory);

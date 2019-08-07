import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Section, Bar } from 'react-simple-resizer';

import { VirtualTree, VirtualDetail } from './Virtual';

import './style.scss';

function Home(props) {
  const { type, category } = props;
  const value = type && type.key;

  return (
    <div className="app-container">
      <Container>
        <Section minSize="35%" defaultSize={350}>
          {value === 'virtual' && <VirtualTree />}
        </Section>

        <Bar className="resizer" size={8} />

        <Section minSize={600}>
          {category && (
            <Fragment>
              {value === 'virtual' && <VirtualDetail />}
            </Fragment>
          )}
        </Section>
      </Container>
    </div>
  );
}

Home.propTypes = {
  type: PropTypes.object,
  category: PropTypes.object,
};

Home.defaultProps = {
  type: null,
  category: null,
};

const mapStateToProps = store => ({
  type: store.clientsData.type,
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(Home);

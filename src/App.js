/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Redirect,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Header from './components/Header';

import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Preview from './containers/Preview';

const PublicRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (!cProps.user ? (
      <C {...props} {...cProps} match={rest.computedMatch} />
    ) : (
      <Redirect to="/" />
    ))}
  />
);

PublicRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
  props: PropTypes.object.isRequired,
};

const App = (props) => (
  <SnackbarProvider maxSnack={3}>
    <Header />

    <Switch>
      <PublicRoute
        exact
        path="/"
        component={Home}
        props={props}
      />
      <PublicRoute
        path="/preview"
        props={props}
        component={Preview}
      />
      <Route component={NotFound} />
    </Switch>
  </SnackbarProvider>
);

export default withRouter(App);

import React from "react";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem("user") ? true : false;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to={{ pathname: "/admin/login", state: { from: props.location } }} />
      }
    />
  );
};

export default PrivateRoute;

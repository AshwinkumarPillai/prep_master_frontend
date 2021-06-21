import React from "react";
import { Redirect, Route } from "react-router-dom";

const adminTestRoute = ({ component: Component, ...rest }) => {
  const testSelected = localStorage.getItem("adminTest") != null ? true : false;

  return (
    <Route
      {...rest}
      render={(props) => (testSelected ? <Component {...props} /> : <Redirect to={{ pathname: "/", state: { from: props.location } }} />)}
    />
  );
};

export default adminTestRoute;

import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import CompanyList from "./Routes/Companies/CompanyList";
import Home from "./Routes/Home";
import Login from "./Routes/Login";
import Profile from "./Routes/Profile";
import Register from "./Routes/Register";
import CompanyDetail from "./Routes/Companies/CompanyDetail";
import PrivateRoute from "./PrivateRoute";
import JobList from "./Routes/Jobs/JobList";

function Routes({ signup, login }) {
  return (
    <div className="pt-5">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/login">
          <Login login={login} />
        </Route>

        <Route exact path="/register">
          <Register signup={signup} />
        </Route>

        <PrivateRoute exact path="/companies">
          <CompanyList />
        </PrivateRoute>

        <PrivateRoute exact path="/jobs">
          <JobList />
        </PrivateRoute>

        <PrivateRoute exact path="/companies/:handle">
          <CompanyDetail />
        </PrivateRoute>

        <PrivateRoute path="/profile">
          <Profile />
        </PrivateRoute>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;

import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

import AdminLogin from "./pages/admin/admin_login";
import Admin from "./pages/admin/admin";
import PrivateRoute from "./util/privateRoute";
import LoggedInCheck from "./util/loggedInCheck";
import AdminTestRoute from "./util/adminTestRoute";
import Login from "./pages/login";
import AdminTest from "./pages/admin/admin_test";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/admin" component={Admin}></PrivateRoute>
          <LoggedInCheck exact path="/admin/login" component={AdminLogin}></LoggedInCheck>
          <AdminTestRoute exact path="/admin/test_edit" component={AdminTest}></AdminTestRoute>
          <Route path="*" component={Login}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./App.css";

import AdminLogin from "./pages/admin/admin_login";
import Admin from "./pages/admin/admin";
import PrivateRoute from "./util/privateRoute";
import AdminLoggedInCheck from "./util/adminLoggedInCheck";
import LoggedInCheck from "./util/loggedInCheck";
import AdminTestRoute from "./util/adminTestRoute";
import AdminPageRoute from "./util/adminPageRoute";
import Login from "./pages/login";
import AdminTest from "./pages/admin/admin_test";
import Navbar from "./components/navbar";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/home";
import Test from "./pages/test";
import Register from "./pages/register";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <PrivateRoute exact path="/test/:id" component={Test}></PrivateRoute>
          <AdminPageRoute exact path="/admin" component={Admin}></AdminPageRoute>
          <AdminLoggedInCheck exact path="/admin/login" component={AdminLogin}></AdminLoggedInCheck>
          <AdminTestRoute exact path="/admin/test_edit" component={AdminTest}></AdminTestRoute>
          <LoggedInCheck exact path="/login" component={Login}></LoggedInCheck>
          <Route exact path="/register" component={Register}></Route>
          <Route path="*" component={PageNotFound}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

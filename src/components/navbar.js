import React, { Component } from "react";

import M from "materialize-css";
import { authAdmin } from "../api/auth";

export default class navbar extends Component {
  constructor(props) {
    super(props);
    let isLoggedIn = localStorage.getItem("user") ? true : false;
    this.state = { isLoggedIn, isAdmin: false };
  }

  componentDidMount() {
    let elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems, {});
    this.checkAdmin();
    // let instances = M.Sidenav.init(elems, {});
  }

  async checkAdmin() {
    try {
      let resp = await authAdmin();
      if (resp.status === 200) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {}
  }

  render() {
    return (
      <React.Fragment>
        <nav>
          <div className="nav-wrapper  purple darken-4">
            <a href="/" style={{ paddingLeft: "20px", fontStyle: "italic" }}>
              Prep Master
            </a>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {this.state.isLoggedIn ? (
                <React.Fragment>
                  {this.state.isAdmin ? (
                    <li>
                      <a href="/admin" className="btn black">
                        Admin
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <a href="/history" className="btn indigo">
                      Test History
                    </a>
                  </li>
                  <li>
                    <a
                      href="/login"
                      className="btn orange darken-4"
                      onClick={() => {
                        this.setState({ isLoggedIn: false });
                        localStorage.clear();
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <li>
                    <a href="/register" className="btn red lighten-1">
                      Register
                    </a>
                  </li>
                  <li>
                    <a href="/login" className="btn green lighten-1">
                      Login
                    </a>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </nav>
        <ul id="mobile-demo" className="sidenav">
          {this.state.isLoggedIn ? (
            <React.Fragment>
              {this.state.isAdmin ? (
                <li>
                  <a href="/admin" className="btn black">
                    Admin
                  </a>
                </li>
              ) : null}
              <li>
                <a href="/history" className="btn indigo">
                  Test History
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="btn orange darken-4"
                  onClick={() => {
                    this.setState({ isLoggedIn: false });
                    localStorage.clear();
                  }}
                >
                  Logout
                </a>
              </li>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li>
                <a href="/register" className="btn red lighten-1">
                  Register
                </a>
              </li>
              <li>
                <a href="/login" className="btn green lighten-1">
                  Login
                </a>
              </li>
            </React.Fragment>
          )}
        </ul>
      </React.Fragment>
    );
  }
}

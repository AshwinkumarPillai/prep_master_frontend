import React, { Component } from "react";

export default class navbar extends Component {
  constructor(props) {
    super(props);
    let isLoggedIn = localStorage.getItem("user") ? true : false;
    this.state = { isLoggedIn };
  }
  render() {
    return (
      <React.Fragment>
        <nav>
          <div className="nav-wrapper  purple darken-4">
            <a href="/" style={{ paddingLeft: "20px", fontStyle: "italic" }}>
              Prep Master
            </a>

            <ul id="nav-mobile" className="right">
              {this.state.isLoggedIn ? (
                <React.Fragment>
                  <li>
                    <a href="/admin" className="btn black">
                      Admin
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
      </React.Fragment>
    );
  }
}

import React, { Component } from "react";
import { login } from "../api/auth";
import { withRouter } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", pwd: "", logginIn: false };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeVisibility = (e) => {
    let spanElement = e.target;
    // console.dir(x);
    const inputElement = document.querySelector("#password");
    // console.dir(d.type);
    if (spanElement.innerText === "visibility") {
      spanElement.innerText = "visibility_off";
      inputElement.type = "text";
    } else {
      spanElement.innerText = "visibility";
      inputElement.type = "password";
    }
  };

  loginUser = async () => {
    this.setState({ logginIn: true });
    try {
      let data = { username: this.state.username, pwd: this.state.pwd };
      if (data.username.length === 0 || data.pwd.length === 0) {
        alert("Please Enter Required Fields");
        this.setState({ logginIn: false });
        return;
      }
      let res = await login(data);
      let resp = res.data;
      alert(resp.message);
      this.setState({ logginIn: false });
      if (resp.status === 200) {
        let user = resp.user;
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        this.props.history.push("/");
        window.location.reload();
      }
    } catch (error) {
      this.setState({ logginIn: false });
      console.log(error);
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className="row login_row">
          <div className="col s12 m8 l4 offset-m2 offset-l4">
            <div className="card">
              <div className="card-action blue lighten-1 white-text center z-depth-3">
                <h3>Login</h3>
              </div>
              <div className="card-content">
                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" onChange={this.handleChange} value={this.state.username} />
                </div>
                <br />
                <div className="form-field" style={{ position: "relative" }}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="pwd"
                    onChange={this.handleChange}
                    style={{ position: "relative" }}
                    value={this.state.pwd}
                  />
                  <span className="field-icon changeVisibilityLogin">
                    <span className="material-icons" onClick={this.changeVisibility}>
                      visibility
                    </span>
                  </span>
                </div>
                <br />
                <div className="form-field">
                  {this.state.logginIn ? (
                    <div className="center">
                      <div className="preloader-wrapper small active">
                        <div className="spinner-layer spinner-blue-only">
                          <div className="circle-clipper left">
                            <div className="circle"></div>
                          </div>
                          <div className="gap-patch">
                            <div className="circle"></div>
                          </div>
                          <div className="circle-clipper right">
                            <div className="circle"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button className="btn-large blue waves-effect waves-dark" style={{ width: "100%" }} onClick={this.loginUser}>
                      Login
                    </button>
                  )}
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Login);

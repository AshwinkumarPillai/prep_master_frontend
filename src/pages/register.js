import React, { Component } from "react";
import { register } from "../api/auth";
import { withRouter } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", pwd: "", confirmpwd: "", debounce: false };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  registerUser = async () => {
    try {
      let username = this.state.username;
      let pwd = this.state.pwd;
      let confirmpwd = this.state.confirmpwd;
      if (username.length < 5 || username.length > 15) {
        alert("Username should be 5-15 characters long");
        this.setState({ debounce: false });
        return;
      }
      if (pwd.length < 6 || pwd.length > 16) {
        alert("Password should be 6-16 characters long");
        this.setState({ debounce: false });
        return;
      }
      if (pwd !== confirmpwd) {
        alert("The passwords you entered does not match");
        this.setState({ debounce: false });
        return;
      }
      this.setState({ debounce: true });
      let res = await register({ username, pwd });
      let resp = res.data;
      if (resp.status === 200) {
        this.props.history.push("/login");
        return;
      }
      this.setState({ debounce: false });
    } catch (error) {
      this.setState({ debounce: false });
      console.log(error);
      alert(error.response.data.message);
    }
  };

  render() {
    // return <div>hello</div>;
    return (
      <React.Fragment>
        <div className="row login_row">
          <div className="col s12 m8 l4 offset-m2 offset-l4">
            <div className="card">
              <div className="card-action purple darken-3 white-text center z-depth-3">
                <h3>Register</h3>
              </div>
              <div className="card-content">
                <div className="form-field">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" onChange={this.handleChange} value={this.state.username} />
                </div>
                <br />
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" name="pwd" onChange={this.handleChange} value={this.state.pwd} />
                  <label htmlFor="password">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmpwd"
                    onChange={this.handleChange}
                    value={this.state.confirmpwd}
                  />
                </div>
                <br />
                <div className="form-field">
                  {this.state.debounce ? (
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
                    <button
                      className="btn-large purple darken-3 waves-effect waves-dark"
                      style={{ width: "100%" }}
                      onClick={this.registerUser}
                    >
                      Register
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

export default withRouter(Register);

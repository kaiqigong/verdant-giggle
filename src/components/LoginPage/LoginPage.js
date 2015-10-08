/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import withStyles from '../../decorators/withStyles';
import TextBox from '../TextBox'
import AccountActions from '../../actions/AccountActions';
import AccountStore from '../../stores/AccountStore';

@withStyles(styles)
class LoginPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  getAccountState() {
    return AccountStore.getAccount();
  }

  constructor() {
    super();

    this.state = Object.assign({}, this.getAccountState());
  }

  componentDidMount() {
    AccountStore.on('change', this.onChange);
  }

  componentWillUnmount() {
    AccountStore.removeListener('change', this.onChange);
  }

  render() {
    const title = 'Log In';
    this.context.onSetTitle(title);
    return (
      <div className="LoginPage">
        <form className="LoginPage-container"
          onSubmit={this::this.handleSubmit}>
          <h1>{title}</h1>
          <input type="text" name="email" ref="email" placeholder="请输入用户名" />
          <input type="password" name="password" ref="password" placeholder="请输入密码" />
          <button type="submit">
            提交
          </button>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    let [email, password] = [this.refs.email.value.trim(), this.refs.password.value.trim()];

    AccountActions.login({email, password});
  }

  _onChange() {
    this.setState(this.getAccountState());
  }

  onChange = this::this._onChange;

}

export default LoginPage;

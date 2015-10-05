import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.css';
import TextBox from '../TextBox'
import AccountActions from '../../actions/AccountActions';
import AccountStore from '../../stores/AccountStore';

@withStyles(styles)
class RegisterPage extends Component {

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
    AccountStore.on('change', this::this._onChange);
  }

  componentWillUnmount() {
    AccountStore.removeListener('change', this::this._onChange);
  }

  render() {
    const title = 'New User Registration';
    this.context.onSetTitle(title);
    return (
      <div className="RegisterPage">
        {this.state.email ? 'welcome:' : ''}{this.state.email}
        <form className="RegisterPage-container"
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

    AccountActions.register({email, password});
  }

  _onChange() {
    console.log(this.getAccountState());
    this.setState(this.getAccountState());
  }

}

export default RegisterPage;

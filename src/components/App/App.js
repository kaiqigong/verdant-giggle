/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import NotificationSystem from 'react-notification-system';
import Dispatcher from '../../core/Dispatcher';
import ActionTypes from '../../constants/ActionTypes';

@withContext
@withStyles(styles)
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  _notificationSystem = null;

  _addNotification (data) {
    console.log(data);
    this._notificationSystem.addNotification(data);
  }

  componentDidMount () {
    this._notificationSystem = this.refs.notificationSystem;
    this.dispatcherIndex = Dispatcher.register((payload) => {
      const action = payload.actionType;
      switch (action) {
      case ActionTypes.NOTIFICATION_ADD:
        this._addNotification(payload.data);
        break;
      default:
        break;
        // add more cases for other actionTypes, like TODO_UPDATE, etc.
      }
    });
  }

  render() {
    return !this.props.error ? (
      <div>
        <Header />
        <NotificationSystem ref="notificationSystem" />
        {this.props.children}
        <Feedback />
        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default App;

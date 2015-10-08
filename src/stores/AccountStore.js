import Dispatcher from '../core/Dispatcher';
import http from '../core/HttpClient';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/ActionTypes';

const CHANGE_EVENT = 'change';

let _account = {};


const AccountStore = Object.assign({}, EventEmitter.prototype, {

  submitForm(form, type) {
    return http.post(`/api/account/${type}/`, form).then((result) => {
      _account = Object.assign(_account, result);
    });
  },

  getAccount() {
    return _account;
  },

  dispatcherIndex: Dispatcher.register((payload) => {
    const action = payload.actionType;
    switch (action) {
    case ActionTypes.ACCOUNT_CREATE:
      AccountStore.submitForm(payload.form, 'register').then(() => {
        AccountStore.emit(CHANGE_EVENT);
      }, (error) => {
        Dispatcher.dispatch({
          actionType: ActionTypes.NOTIFICATION_ADD,
          data: {
            level: 'error',
            message: error.response.body.message,
          },
        });
      });
      break;
    case ActionTypes.ACCOUNT_LOGIN:
      AccountStore.submitForm(payload.form, 'login').then(() => {
        AccountStore.emit(CHANGE_EVENT);
      }, (error) => {
        Dispatcher.dispatch({
          actionType: ActionTypes.NOTIFICATION_ADD,
          data: {
            level: 'error',
            message: error.response.body.message,
          },
        });
      });
      break;
    default:
      break;
      // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
  }),
});

export default AccountStore;

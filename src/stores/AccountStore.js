import Dispatcher from '../core/Dispatcher';
import http from '../core/HttpClient';
import {EventEmitter} from 'events';

const CHANGE_EVENT = 'change';

let _account = {};


const AccountStore = Object.assign({}, EventEmitter.prototype, {

  async submitForm(email, password) {
    const result = await http.post(`/api/account/register/`, {email, password});
    _account = Object.assign(_account, result);
  },

  getAccount() {
    return _account;
  },

  dispatcherIndex: Dispatcher.register((payload) => {
    const action = payload.actionType;
    console.log(payload.form);
    switch (action) {
    case 'ACCOUNT_CREATE':
      AccountStore.submitForm(...payload.form).then(() => {
        AccountStore.emit(CHANGE_EVENT);
      }, (error) => {
        console.log(error);
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

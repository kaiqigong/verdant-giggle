/**
 * AccountActions
 */

import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

const AccountActions = {
  /**
   * @param  {string} text
   */
  register(form) {
    Dispatcher.dispatch({
      actionType: ActionTypes.ACCOUNT_CREATE,
      form,
    });
  },

  login(form) {
    Dispatcher.dispatch({
      actionType: ActionTypes.ACCOUNT_LOGIN,
      form,
    });
  },
};

export default AccountActions;


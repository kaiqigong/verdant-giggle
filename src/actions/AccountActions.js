/**
 * AccountActions
 */

import Dispatcher from '../core/Dispatcher';

const AccountActions = {
  /**
   * @param  {string} text
   */
  register(form) {
    Dispatcher.dispatch({
      actionType: 'ACCOUNT_CREATE',
      form,
    });
  },
};

export default AccountActions;


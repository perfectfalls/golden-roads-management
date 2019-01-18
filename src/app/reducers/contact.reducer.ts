import { SEND_CONTACT } from "../actions/contact.actions";

const initialState = {};

export function contactReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_CONTACT:
      return action.payload;
    default:
      return state;
  }
}

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  ErrorsActions
} from "../actions/errors.actions";

const initialState = {};

export function errorsReducer(state = initialState, action: ErrorsActions) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}

import produce from "immer";

export const INICIAL_STATE = [];

export default function techs(state = INICIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case "ADD_TECH":
        draft.push(action.payload.tech);
        break;
      default:
    }
  });
}

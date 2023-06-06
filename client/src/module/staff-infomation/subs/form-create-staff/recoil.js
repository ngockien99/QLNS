import { atom } from "recoil";

export const StepAtom = atom({ key: "STEP_ATOM", default: 0 });
export const NewUserInfoAtom = atom({
  key: "NEW_USER_INFO_ATOM",
  default: undefined,
});
export const IsOpen = atom({ key: "OPEN_MODAL", default: false });
export const IsEditAtom = atom({ key: "IS_EDIT", default: false });

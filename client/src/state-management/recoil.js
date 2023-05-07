import { atom } from "recoil";

export const UserInfoAtom = atom({
  key: "UserInfoAtom",
  default: undefined,
  //   effects_UNSTABLE: [
  //     ({ onSet }) => {
  //       onSet((newData) => {
  //         if (newData.token) {
  //           localStorage.setItem(TOKEN_JWT, newData.token);
  //         }
  //         localStorage.setItem("role", newData.role);
  //         localStorage.setItem("user_id", newData.user_id);
  //       });
  //     },
  //   ],
});

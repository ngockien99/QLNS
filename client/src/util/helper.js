import dayjs from "dayjs";

export const convertDayofWeek = (date) => {
  if (date) {
    const myDate = date.split("-");
    const indexDayOfWeek = dayjs(`
       ${parseInt(myDate[2], 10)}-
      ${parseInt(myDate[1], 10)}-
      ${parseInt(myDate[0])}
    `).day();

    let dayOfWeek;
    switch (indexDayOfWeek) {
      case 0:
        dayOfWeek = "CN";
        break;
      case 1:
        dayOfWeek = "T2";
        break;
      case 2:
        dayOfWeek = "T3";
        break;
      case 3:
        dayOfWeek = "T4";
        break;
      case 4:
        dayOfWeek = "T5";
        break;
      case 5:
        dayOfWeek = "T6";
        break;
      case 6:
        dayOfWeek = "T7";
        break;
      default:
        break;
    }
    return dayOfWeek;
  }
  return null;
};

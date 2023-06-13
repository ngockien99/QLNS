import Header from "component/header-component/header";
import TableComponent from "./subs/table";

const ListWorkingDayOfMonth = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Header content="Danh sách công" noButton />
      <TableComponent />
    </div>
  );
};

export default ListWorkingDayOfMonth;

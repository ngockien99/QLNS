import { Avatar, List } from "antd";

const TableComponent = ({ data }) => {
  // const data = [
  //   {
  //     title: "Nguyễn Ngọc Kiên",
  //   },
  //   {
  //     title: "Vũ Mạnh Dũng",
  //   },
  //   {
  //     title: "Lê Nguyên Hà",
  //   },
  //   {
  //     title: "Nguyễn Minh Ngọc",
  //   },
  // ];
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: 12,
        gap: 12,
        borderRadius: 4,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ margin: "10px 0 0 0" }}>
        Nhân viên đi muộn về sớm nhiều nhất
      </h3>
      <List
        itemLayout="horizontal"
        bordered
        size="small"
        dataSource={data}
        style={{ minHeight: "100%" }}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description="Khối Công Nghệ - Văn Phòng Hà Nội"
            />
            <h3>178</h3>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TableComponent;

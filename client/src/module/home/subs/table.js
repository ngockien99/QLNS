import { Avatar, List } from "antd";

const TableComponent = () => {
  const data = [
    {
      title: "Nguyễn Ngọc Kiên",
    },
    {
      title: "Vũ Mạnh Dũng",
    },
    {
      title: "Lê Nguyên Hà",
    },
    {
      title: "Nguyễn Minh Ngọc",
    },
  ];
  return (
    <div
      style={{ backgroundColor: "#fff", padding: 12, gap: 12, borderRadius: 4 }}
    >
      <h3 style={{ margin: "10px 0 0 0" }}>
        Nhân viên đi muộn về sớm nhiều nhất
      </h3>
      <div style={{ margin: "12px 0" }}>Tháng 3/2023</div>
      <List
        itemLayout="horizontal"
        bordered
        size="small"
        dataSource={data}
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

import { Col, Row } from "antd";

const CardComponent = ({ data }) => {
  const { probation, doing, end } = data;
  return (
    <Row gutter={12}>
      <Col span={8}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            padding: 12,
            gap: 4,
            borderLeft: "4px solid green",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Nhân viên thử việc
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <h2>{probation}</h2>
          </div>
        </div>
      </Col>
      <Col span={8}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            padding: 12,
            gap: 4,
            borderLeft: "4px solid blue",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Nhân viên chính thức
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <h2>{doing}</h2>
          </div>
        </div>
      </Col>
      <Col span={8}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 4,
            padding: 12,
            gap: 4,
            borderLeft: "4px solid orange",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Nhân viên nghỉ việc
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <h2>{end}</h2>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CardComponent;

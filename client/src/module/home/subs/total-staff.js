import { CrownTwoTone } from "@ant-design/icons";
import { Card, Col, Row } from "antd";

const TotalStaff = ({ total, data }) => {
  return (
    <Card title="Tổng số nhân viên">
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <h4 style={{ marginTop: 0 }}>{total}</h4>
      </Row>
      {data.map((e) => {
        return (
          <Row>
            <Col span={4} style={{ textAlign: "start" }}>
              <CrownTwoTone />
            </Col>
            <Col
              span={16}
              style={{
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 60,
              }}
            >
              {e.name}
            </Col>
            <Col span={4} style={{ textAlign: "end" }}>
              {e.total}
            </Col>
          </Row>
        );
      })}
    </Card>
  );
};

export default TotalStaff;

import { Card, Col, Row } from "antd";
import { IDashboardCountCardProps } from "./DashboardCountCard.model";

const DashboardCountCard = (props: IDashboardCountCardProps)=>{
    const {title, className} = props;
    return(
        <div className={className}>
            <Card className="faculty-dashboard-card student-card gx-mt-2">
            <div className="card-header gx-d-flex gx-justify-content-between gx-align-items-center">
              <h5>{title}</h5>
            </div>
            <div className="card-body">
                <Row gutter={24} className="gx-mx-0">
                    <Col xs={8} className="gx-text-center performance-details">
                        <a href="javascript:;">
                        <h6>Low</h6>
                        <h5>4</h5>
                        </a>
                    </Col>
                    <Col xs={8} className="gx-text-center performance-details">
                        <a href="javascript:;">
                        <h6>Average</h6>
                        <h5>-</h5>
                        </a>
                    </Col>
                    <Col xs={8} className="gx-text-center performance-details">
                        <a href="javascript:;">
                        <h6>High</h6>
                        <h5>-</h5>
                        </a>
                    </Col>
                </Row>
            </div>
          </Card>
        </div>
    );
}
export default DashboardCountCard;
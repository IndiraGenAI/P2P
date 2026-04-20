import { Card, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { IDashboardTableCardProps } from "./DashboardTableCard.model";
import { currencyFormat } from "src/utils/helperFunction";

const DashboardTableCard = (props: IDashboardTableCardProps) => {
  const { title, value, isToolTipShow, toolTipData, classData } = props;

  return (
    <>
      <Card
        className={`faculty-dashboard-card total-card overall-cards gx-mt-2 gx-mt-xl-0  ${classData}`}
      >
        <div className="card-header gx-text-center ">
          <h5>{title}</h5>
        </div>
        {isToolTipShow ? (
          <Tooltip placement="bottom" title={toolTipData}>
            <div className="card-body">
              <h5 className="gx-text-center">
                {currencyFormat(value)}
                {(title === "Total Income" ||
                  title === "Total Expense of the Month Mode Wise") && (
                  <InfoCircleOutlined className="info-icon" />
                )}
              </h5>
            </div>
          </Tooltip>
        ) : (
          <div className="card-body">
            <h5 className="gx-text-center">{currencyFormat(value)}</h5>
          </div>
        )}
      </Card>
    </>
  );
};
export default DashboardTableCard;

import { Card } from "antd";
import { IDashboardTableCardProps } from "./DashboardTableCard.model";
import { currencyFormat } from "src/utils/helperFunction";

const DashboardTableCard = (props: IDashboardTableCardProps) => {
  const {
    title,
    value,
    classData,
    percentage = false,
    percentageValue = 0,
  } = props;
  return (
    <>
      <Card
        className={`faculty-dashboard-card total-card student-today-card gx-mb-2 ${classData}`}
      >
        <div className="card-header gx-text-center">
          <h5>{title}</h5>
        </div>
        <div className="card-body">
          <h5 className="gx-text-center">
            {currencyFormat(Number(value))} {percentage ? "%" : null}
            {(percentageValue || Number(percentageValue) !== 0) && (
              <span className="amt-span gx-text-center">
                ({Number(percentageValue).toFixed(2) + "%"})
              </span>
            )}
          </h5>
        </div>
      </Card>
    </>
  );
};
export default DashboardTableCard;

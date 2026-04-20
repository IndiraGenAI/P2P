import { Card } from "antd";
import { ColumnsType } from "antd/es/table";
import TableComponent from "src/components/DataTable";
import { showTooltip } from "src/utils/helperFunction";
import { IStudentListProps } from "./Add.model";

const StudentListIndex = (props: IStudentListProps) => {
  const { students } = props;
  const studentListColumns: ColumnsType<[]> = [
    {
      title: "GR Id",
      width: "5%",
      align: "center",
      render: (record) => {
        return <>{record?.admission?.gr_id}</>;
      },
    },
    {
      title: "Student Name",
      dataIndex: "admission",
      className: "student_name",
      render: (record) => {
        const studentName = `${
          record?.first_name +
          " " +
          record?.middle_name +
          " " +
          record?.last_name
        }`;
        return showTooltip(studentName.toUpperCase(), 30);
      },
    },
  ];
  
  return (
    <div>
      <Card className="table-card rnw-card transfer-addmission">
        <TableComponent
          columns={studentListColumns}
          dataSource={students || []}
          loading={false}
        />
      </Card>
    </div>
  );
};

export default StudentListIndex;

import React from "react";

type Props = {
  studentMobileNumber: string;
};

const StudentMobileNumber: React.FC<Props> = ({ studentMobileNumber }) => {
  return <span>{studentMobileNumber}</span>;
};

export default StudentMobileNumber;

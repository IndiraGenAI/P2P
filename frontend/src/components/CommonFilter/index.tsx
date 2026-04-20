import { Form } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IFilterProps } from "./CommonFilter.model";
import moment from "moment";
import { DateData } from "src/pages/Expense/Expense.model";

function CommonFilter(props: IFilterProps) {
  const { fielterData, children, change, reset } = props;
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const onReset = (value: any) => {
    setFormValues(" ");
    form.resetFields();
    const filterdata = Object.fromEntries(new URLSearchParams(searchParams));
    if (filterdata.r === undefined) {
      setSearchParams("");
    } else {
      setSearchParams(`r=${filterdata.r}`);
    }
    reset(value);
  };

  useEffect(() => {
    const data: DateData = {
      ...setFormValues,
      date_from: "",
      date_end: "",
    };
    const splitFieldValue = ["branch_id" , "batches_status" , "zone_ids" , "branch_ids" , "tag_ids"];
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      if (splitFieldValue?.includes(key)) {
        Object.assign(data, {
          [key]: value.split(","),
        });
      } else if (key === "cheque_date") {
        Object.assign(data, {
          ["cheque_date"]: moment(value),
        });
      } else if (key === "transaction_date") {
        Object.assign(data, {
          ["transaction_date"]: moment(value),
        });
      } else if (key === "start_date") {
        Object.assign(data, {
          ["start_date"]: moment(value),
        });
      } else if (key === "end_date") {
        Object.assign(data, {
          ["end_date"]: moment(value),
        });
      } else if (key === "admission_date") {
        Object.assign(data, {
          ["admission_date"]: moment(value),
        });
      } else {
        Object.assign(data, {
          [key]: value,
        });
      }
    }
    setFormValues(data);
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      form.resetFields();
    }
  }, [formValues]);

  const onFinish = (values: { [key: string]: string }) => {
    fielterData(values);
  };

  const changeValue = (value: string) => {
    change&&  change(value);
  };
  return (
    <div>
      <Form
        id="myForm"
        onFinish={onFinish}
        form={form}
        onValuesChange={changeValue}
        onReset={onReset}
        initialValues={formValues}
      >
        {children}
      </Form>
    </div>
  );
}

export default CommonFilter;

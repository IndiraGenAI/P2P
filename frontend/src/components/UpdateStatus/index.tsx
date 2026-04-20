import { Button, DatePicker, Form } from "antd";
import moment from "moment";
import DrawerComponent from "../Drawer";
import FloatLabel from "../Form/FloatLabel";
import { StatusUpdateProps } from "./UpdateStatus.model";
import { IUpdateAdmissionStatus } from "src/services/admission/admission.model";
import { useEffect, useState } from "react";
import TextEditor from "../TextEditor";
import { useWatch } from "antd/lib/form/Form";

const StatusUpdate = (props: StatusUpdateProps) => {
  const {
    title,
    visible,
    onClose,
    onSubmit,
    field,
    startDateName,
    buttonDisable,
  } = props;
  const [editorValue, setEditorValue] = useState("");
  const dateFormat = "DD/MM/YYYY";
  const [form] = Form.useForm();
  const rules = {
    start_date: [{ required: true, message: `Please Select ${startDateName}` }],
    end_date: [{ required: true, message: "Please Select End Date" }],
    comment: [{ required: true, message: "Please Enter Comment" }],
    status: [{ required: true, message: "Please Select Status" }],
  };

  const commentField = useWatch("comment", form);

  useEffect(() => {
    if (!!commentField && !commentField.replace(/<\/?[^>]+>/g, "")?.length) {
      form.setFieldValue("comment", undefined);
    }
  }, [commentField]);

  return (
    <DrawerComponent
      title={title}
      className="assign-batch"
      onClose={onClose}
      visible={visible}
      footer={true}
      label={"Submit"}
    >
      {({ myRef }: any) => (
        <Form
          form={form}
          className="drawer-form"
          onFinish={(values: IUpdateAdmissionStatus) => {
            onSubmit(values);
          }}
        >
          <div>
            {field === undefined ? (
              <FloatLabel
                label={startDateName}
                placeholder="Enter Start Date"
                name="start_date"
              >
                <Form.Item
                  name="start_date"
                  initialValue={moment()}
                  rules={rules.start_date}
                >
                  <DatePicker
                    size="large"
                    placeholder=""
                    format={dateFormat}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </FloatLabel>
            ) : (
              <>
                <FloatLabel
                  label={startDateName}
                  placeholder="Enter Start Date"
                  name="start_date"
                >
                  <Form.Item
                    name="start_date"
                    initialValue={moment()}
                    rules={rules.start_date}
                  >
                    <DatePicker
                      size="large"
                      placeholder=""
                      format={dateFormat}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </FloatLabel>
                <FloatLabel
                  label="Hold End Date"
                  placeholder="Enter Hold End Date"
                  name="end_date"
                >
                  <Form.Item name="end_date" rules={rules.end_date} required>
                    <DatePicker
                      size="large"
                      placeholder=""
                      format={dateFormat}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </FloatLabel>
              </>
            )}
            {props.children}
            <div className="text-editor">
              <FloatLabel
                label="Comment"
                placeholder="Enter Comment"
                name="comment"
                required
              >
                <Form.Item name="comment" rules={rules.comment}>
                  <TextEditor
                    value={editorValue || " "}
                    placeholder=""
                    onChange={setEditorValue}
                    hasInitializedProp={true}
                  />
                </Form.Item>
              </FloatLabel>
            </div>
            <Form.Item className="modal-btn-grp gx-d-none">
              <Button
                disabled={buttonDisable}
                type="primary"
                className="btn-submit gx-mt-0"
                htmlType="submit"
                ref={myRef}
                style={{ display: "none" }}
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
    </DrawerComponent>
  );
};

export default StatusUpdate;

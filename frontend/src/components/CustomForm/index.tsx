import { Form, message } from "antd";
import commonModuleService from "src/services/commonModule/commonModule.service";
import { ICustomFormProps } from "./CustomForm.model";
const CustomForm = (props: ICustomFormProps) => {
  const { children } = props;
  const onSubmitForm = async (values: any) => {
    try {
      if (values && props.initialValues && props.initialValues.storagePath) {
        const finalValues = await commonModuleService.uploadFileFromFormData(
          values,
          props.initialValues.storagePath
        );
        delete finalValues.storagePath;
        props.onFinish && props.onFinish(finalValues);
      } else {
        props.onFinish && props.onFinish(values);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Form
      {...props}
      initialValues={props.initialValues}
      onFinish={onSubmitForm}
    >
      {children}
    </Form>
  );
};

export default CustomForm;

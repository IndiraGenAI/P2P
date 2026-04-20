import { Button, Form, Input, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useCallback, useMemo, useState } from "react";
import { ability } from "src/ability";
import { Can } from "src/ability/can";
import ModalComponent from "src/components/Modal";
import {
  IAdmissionInstallments,
  Invoice,
} from "src/services/admission/admission.model";
import {
  admissionSelector,
  clearUnpaidInstallmentListState,
} from "src/state/admission/admission.reducer";
import { useAppSelector } from "src/state/app.hooks";
import { AdmisionStatusType, Common } from "src/utils/constants/constant";
import { currencyFormat, dateFormate } from "src/utils/helperFunction";
import { SplitCellsOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/state/app.model";
import TableComponent from "src/components/DataTable";
import Search from "antd/lib/input/Search";
import InstallmentPayment from "src/components/InstallmentPayment";
import { SpliteInstallment } from "src/components/SpliteInstallment/SpliteInstallment";
import { getStudentUnpaidInstallment } from "src/state/admission/admission.action";
import { IInstallmentModalProps } from "./InstallmentModal.model";
import InstallmentPaymentConfirmation from "src/components/InstallmentPaymentConfirmation/InstallmentPaymentConfirmation";

export const InstallmentModal = (props: IInstallmentModalProps) => {
  const { setInstallmentModalOpen, installmentModalOpen } = props;
  const dispatch = useDispatch<AppDispatch>();
  const admissionState = useAppSelector(admissionSelector);
  const [installmentPaymentModelOpen, setInstallmentPaymentModelOpen] =
    useState<boolean>(false);
  const [installmentId, setInstallmentId] = useState<number>(0);
  const [installmentSplitModalOpen, setInstallmentSplitModalOpen] =
    useState<boolean>(false);
  const [installmentData, setInstallmentData] =
    useState<IAdmissionInstallments>();
  const [disable, setDisable] = useState<boolean>(false);
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<Invoice[]>([]);
  const [form] = Form.useForm();
  const installmentListData = useMemo(
    () => admissionState.unpaidInstallmentListData.data,
    [admissionState.unpaidInstallmentListData.data]
  );
  const [isStudentData, setIsStudentData] = useState<boolean>(false);
  const isLocked = !!installmentListData?.is_request;

  const rules = {
    gr_id: [
      { pattern: new RegExp(/^[0-9]+$/), message: "only Number Are Allowed" },
      {
        required: true,
        message: "Please enter GR ID",
      },
    ],
  };

  const PaymentInstallmentsColumns: ColumnsType<IAdmissionInstallments> =
    useMemo(
      () => [
        {
          title: "Sr No",
          dataIndex: "installment_no",
          align: "center",
          width: "10%",
        },
        {
          title: "Installment Date",
          dataIndex: "installment_date",
          align: "center",
          width: "20%",
          render: (installmentDate: Date) => dateFormate(installmentDate),
        },
        {
          title: "Installment Amount(₹)",
          dataIndex: "installment_amount",
          width: "20%",
          align: "center",
          render: (_, record) => {
            const isTerminatedOrCancelled =
              record.status === AdmisionStatusType.TERMINATED ||
              record.status === AdmisionStatusType.CANCELLED;

            const isUnpaid = record.id && record.pay_amount === null;
            const lockUnpaid = isLocked && isUnpaid; 

            const canUpdate = ability.can(
              Common.Actions.CAN_UPDATE,
              Common.Modules.ADMISSION.ADMISSION_PAYMENT_INSTALLMENTS_DETAILS
            );

            const payBtnDisabled =
              isTerminatedOrCancelled || lockUnpaid || !canUpdate;
            const payBtnClass = payBtnDisabled
              ? "disable-pay-btn unpaid-amount"
              : "unpaid-amount";

            if (isUnpaid) {
              return (
                <>
                  <Tooltip placement="top" title={"Make a Payment"}>
                    <div className="make-payment-split">
                      <Button
                        className={payBtnClass}
                        disabled={payBtnDisabled}
                        onClick={() => {
                          if (payBtnDisabled) return;
                          setInstallmentPaymentModelOpen(true);
                          setInstallmentId(record.id);
                        }}
                      >
                        {currencyFormat(Math.trunc(_))}
                        <span className="pay-text">PAY</span>
                      </Button>

                      <Can
                        I={Common.Actions.CAN_UPDATE}
                        a={
                          Common.Modules.ADMISSION.ADMISSION_INSTALLMENT_MODIFY
                        }
                      >
                        {Number(record.installment_amount || 0) > 1 &&
                          !isTerminatedOrCancelled &&
                          !lockUnpaid && (
                            <SplitCellsOutlined
                              className="paymentSplit"
                              title="Split Payments"
                              onClick={() => {
                                setInstallmentSplitModalOpen(true);
                                setInstallmentData({
                                  ...record,
                                  admission_id: installmentListData.id,
                                });
                                setDisable(false);
                              }}
                            />
                          )}
                      </Can>
                    </div>
                  </Tooltip>
                </>
              );
            }

            return (
              <Tooltip placement="top" title="Paid">
                <Button
                  disabled={isTerminatedOrCancelled ? true : false}
                  className={
                    !isTerminatedOrCancelled
                      ? "paid-amount"
                      : "disable-pay-btn paid-amount"
                  }
                >
                  {currencyFormat(Math.trunc(_))}
                </Button>
              </Tooltip>
            );
          },
        },
        {
          title: "Due Amount(₹)",
          dataIndex: "due_amount",
          width: "20%",
          align: "left",
          render: (dueAmount) => currencyFormat(Math.trunc(dueAmount)),
        },
      ],
      [installmentListData]
    );

  const handleSearchInstallmentByGrid = useCallback((value: number) => {
    dispatch(getStudentUnpaidInstallment(value)).then((res: any) => {
      const student = res?.payload?.data;
      if (
        student &&
        (student.first_name || student.middle_name || student.last_name)
      ) {
        form.setFieldsValue({
          student_name: `${student.first_name || ""} ${
            student.middle_name || ""
          } ${student.last_name || ""}`.trim(),
        });
        setIsStudentData(true);
      } else {
        setIsStudentData(false);
      }
    });
  }, []);

  return (
    <>
      <ModalComponent
        className="installment-check-modal"
        title={`Payment Installments Details`}
        showModal={installmentModalOpen}
        modelWidth={600}
        onCancel={() => {
          dispatch(clearUnpaidInstallmentListState());
          setInstallmentModalOpen(false);
        }}
        component={
          <>
            <Form
              layout="vertical"
              name="searchInstallment"
              form={form}
              onFinish={(values) =>
                handleSearchInstallmentByGrid(Number(values.grId))
              }
            >
              <Form.Item
                name="grId"
                rules={rules.gr_id}
                className="form-item"
                style={{ marginBottom: 0 }}
              >
                <Search
                  placeholder="Enter GR ID"
                  enterButton="Search"
                  className="input-search"
                  disabled={admissionState.unpaidInstallmentListData.loading}
                  onSearch={(_, e) => {
                    e?.preventDefault();
                    form.submit();
                  }}
                  maxLength={9}
                />
              </Form.Item>

              {isStudentData && (
                <Form.Item
                  name="student_name"
                  className="form-item"
                  style={{ marginBottom: 15 }}
                >
                  <Input disabled placeholder="Student Name" />
                </Form.Item>
              )}
              <Form.ErrorList />
            </Form>

            <div className="payment-details">
              <TableComponent
                columns={PaymentInstallmentsColumns}
                loading={admissionState.unpaidInstallmentListData.loading}
                dataSource={installmentListData.admission_installments || []}
              />
            </div>
          </>
        }
        footer={null}
      ></ModalComponent>

      {installmentPaymentModelOpen && (
        <InstallmentPayment
          installmentPaymentModelOpen={installmentPaymentModelOpen}
          setInstallmentPaymentModelOpen={setInstallmentPaymentModelOpen}
          installment_id={Number(installmentId)}
          admission_id={installmentListData.id}
          fetchInstallmentData={() =>
            handleSearchInstallmentByGrid(installmentListData.gr_id)
          }
          setConfirmationOpen={setConfirmationOpen}
          setReceiptNo={setReceiptData}
        />
      )}

      {installmentSplitModalOpen && (
        <SpliteInstallment
          disable={disable}
          setDisable={setDisable}
          installmentData={installmentData}
          installmentSplitModalOpen={installmentSplitModalOpen}
          setInstallmentSplitModalOpen={setInstallmentSplitModalOpen}
          fetchInstallmentData={() =>
            handleSearchInstallmentByGrid(installmentListData.gr_id)
          }
        />
      )}

      {confirmationOpen && (
        <InstallmentPaymentConfirmation
          visible={confirmationOpen}
          setConfirmationOpen={setConfirmationOpen}
          receiptData={receiptData}
        />
      )}
    </>
  );
};

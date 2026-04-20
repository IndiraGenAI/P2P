import { Button, Col, Form, Input, Row, Select } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import FloatLabel from "src/components/Form/FloatLabel";
import { useAppSelector } from "src/state/app.hooks";
import { AppDispatch } from "src/state/app.model";
import { searchRoleData } from "src/state/role/role.action";
import { roleSelector } from "src/state/role/role.reducer";
import { searchZoneData } from "src/state/zone/zone.action";
import { zoneSelector } from "src/state/zone/zone.reducer";
import { IUserRecord } from "../Users.model";
import { IUserAddProps, optionType, IRoleList } from "./Add.model";
import { GetSortOrderWithoutLowercase } from "src/utils/helperFunction";
import {
  DisableUser,
  EmailValidation,
  ROLE_TYPE_SEQUENCE,
  UserRoleColor,
  UserStatus,
} from "src/utils/constants/constant";
import { userSelector } from "src/state/users/user.reducer";
import { useWatch } from "antd/lib/form/Form";
import AddRemoveButton from "src/components/AddRemoveButtons/AddRemoveButtons";

const { Option } = Select;

const UserAdd = (props: IUserAddProps) => {
  const { data, onSubmit, myRef, otherUserRoles } = props;
  const form = Form.useForm()[0];
  const options = Object.keys(UserRoleColor).map((key) => ({
    value: UserRoleColor[key as keyof typeof UserRoleColor],
    label: key,
  }));
  const disableColorOptions = Object.keys(DisableUser).map((key) => ({
    value: DisableUser[key as keyof typeof DisableUser],
    label: key,
  }));
  const zoneState = useAppSelector(zoneSelector);
  const roleState = useAppSelector(roleSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOptions, setSelectedOptions] = useState<optionType[]>([]);
  const { userData } = useAppSelector(userSelector);
  const userRoles = useWatch<IRoleList[]>("roles", form);

  const [renderOption, setRenderOption] =
    useState<{ [key: string]: string }[]>(options);

  const storageID: string | null = localStorage.getItem("myStorageID");

  const currentUserRole = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.role;

  const currentUserRoleType = currentUserRole?.type;
  const filteredRoles = roleState.rolesData.data.rows
    .filter((roles) => roles.status === true)
    .filter((role) => {
      if (currentUserRoleType && role?.type) {
        const roleSequence = ROLE_TYPE_SEQUENCE[role?.type];
        return roleSequence >= ROLE_TYPE_SEQUENCE[currentUserRoleType];
      }
    });

  const finalOptions = useMemo(() => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const rolesData = userRoles || data?.roles;

    if (!rolesData) return [];

    const currentRoleColors = rolesData.map((role) => {
      const roleColors =
        otherUserRoles
          ?.filter(
            (roleColor) =>
              roleColor.zone_id === role.zone_id &&
              roleColor.role_id === role.role_id
          )
          .map((roleColor) => roleColor.user_role_color) || [];

      return Array.from(new Set([...selectedValues, ...roleColors]));
    });

    return currentRoleColors;
  }, [selectedOptions, userRoles, data?.roles, otherUserRoles]);

  const rules = {
    first_name: [
      { required: true, message: "Please Enter First Name" },
      { min: 3 },
      { max: 100 },
    ],
    last_name: [
      { required: true, message: "Please Enter Last Name" },
      { min: 3 },
      { max: 100 },
    ],
    email: [
      { required: true, message: "Please Enter E-mail" },
      { max: 100 },
      {
        pattern: EmailValidation,
        message: "Please Enter valid email",
      },
    ],
    phone: [
      { required: true, message: "Please Enter Phone" },
      { min: 10 },
      { max: 15 },
    ],
    user_role_color: [{ required: true, message: "Please Select Role Color" }],
    zone: [{ required: true, message: "Please Select Zone" }],
    role: [{ required: true, message: "Please Select Role" }],
  };

  const value = {
    ...data,
    roles:
      data?.roles &&
      [...data?.roles].sort(GetSortOrderWithoutLowercase("id", "ASC")),
  };

  useEffect(() => {
    value !== null &&
      setSelectedOptions(
        (value.roles?.map((role, index) => {
          return {
            key: index,
            value: role.user_role_color,
          };
        }) as optionType[]) || []
      );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(
      searchZoneData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        type: "",
        isFilter: true,
      })
    );
    dispatch(searchRoleData({ noLimit: true, orderBy: "name", order: "ASC" }));
    // eslint-disable-next-line
  }, []);

  const selectOp = (e: string, key: number) => {
    const data = [...selectedOptions];
    const isName = selectedOptions.findIndex((data) => data.key === key);

    if (isName !== -1) {
      data[isName].value = e;
      setSelectedOptions(data);
    } else {
      setSelectedOptions([...selectedOptions, { key: key, value: e }]);
    }
  };

  useEffect(() => {
    const filteredOptions = options.filter((option) =>
      selectedOptions.every((selected) => selected.value !== option.value)
    );
    setRenderOption(filteredOptions);
  }, [selectedOptions]);

  const handleStatusValueChange = useCallback(
    (key: number, StatusValue: boolean) => {
      form.setFieldValue(
        ["roles", +key, "user_role_color"],
        !StatusValue ? disableColorOptions[0].value : undefined
      );
    },
    [disableColorOptions]
  );

  return (
    <>
      <Form
        form={form}
        className="drawer-form create-user-form"
        name="dynamic_form_nest_item"
        initialValues={data ? value : { roles: [""] }}
        onFinish={(values: IUserRecord) => {
          onSubmit(values);
        }}
        layout="vertical"
        autoComplete="off"
        requiredMark={true}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={5} md={24}>
            <FloatLabel
              label="First Name"
              placeholder="Enter First Name"
              name="first_name"
              required
            >
              <Form.Item name="first_name" rules={rules.first_name}>
                <Input size="large" />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col xs={24} sm={5} md={24}>
            <FloatLabel
              label="Last Name"
              placeholder="Enter Last Name"
              name="last_name"
              required
            >
              <Form.Item name="last_name" rules={rules.last_name}>
                <Input size="large" />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col xs={24} sm={5} md={24}>
            {data?.email === undefined ? (
              <FloatLabel
                label="E-mail"
                placeholder="Enter E-mail"
                name="email"
                required
              >
                <Form.Item name="email" rules={rules.email}>
                  <Input size="large" />
                </Form.Item>
              </FloatLabel>
            ) : (
              <>
                <FloatLabel
                  label="E-mail"
                  placeholder="Enter E-mail"
                  name="email"
                  required
                >
                  <Form.Item name="email" rules={rules.email}>
                    <Input size="large" disabled />
                  </Form.Item>
                </FloatLabel>
              </>
            )}
          </Col>
          <Col xs={24} sm={5} md={24}>
            <FloatLabel
              label="Phone"
              placeholder="Enter Phone Number"
              name="phone"
              required
            >
              <Form.Item name="phone" rules={rules.phone}>
                <Input size="large" />
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>

        <Form.List name="roles">
          {(fields, { add, remove }) => (
            <>
              <div>
                {fields.map(({ key, name, ...restField }, index) => {
                  const removeBtn = (name: number) => {
                    remove(name);
                    setSelectedOptions((prevOptions) =>
                      prevOptions.filter((x, i) =>
                        selectedOptions.length > 0 ? i !== name : i
                      )
                    );
                    setRenderOption((prevRenderOption) =>
                      options.filter((option) =>
                        selectedOptions.some(
                          (selected) => selected.value !== option.value
                        )
                      )
                    );
                  };
                  return (
                    <>
                      <Row gutter={24}>
                        <Col xs={24} sm={12} md={fields.length === 1 ? 6 : 6}>
                          <FloatLabel
                            label="Zone Name"
                            placeholder="Select Zone"
                            name={["roles", name, "zone_id"]}
                            required
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "zone_id"]}
                              rules={rules.zone}
                            >
                              <Select
                                size="large"
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.children?.toString() || "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase().trim())
                                }
                              >
                                {zoneState.zonesData.data.rows
                                  .filter((zones) => zones.status === true)
                                  .map((zones) => (
                                    <Option key={zones.id} value={zones.id}>
                                      {zones.code
                                        ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                                        .trimStart() +
                                        "-" +
                                        zones.name
                                          ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                                          .trimStart()}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </FloatLabel>
                        </Col>
                        <Col xs={24} sm={12} md={fields.length === 1 ? 6 : 5}>
                          <FloatLabel
                            label="Role"
                            placeholder="Select Role"
                            name={["roles", name, "role_id"]}
                            required
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "role_id"]}
                              rules={rules.role}
                            >
                              <Select
                                size="large"
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                  (option?.children?.toString() || "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase().trim())
                                }
                              >
                                {filteredRoles.map((roles) => (
                                  <Option key={roles.id} value={roles.id}>
                                    {roles.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </FloatLabel>
                        </Col>
                        <Col xs={24} sm={12} md={5}>
                          <FloatLabel
                            label="Status"
                            placeholder="Select Status"
                            name={["roles", name, "status"]}
                            required
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "status"]}
                              rules={rules.role}
                            >
                              <Select
                                size="large"
                                allowClear
                                showSearch
                                disabled={data?.status === UserStatus.DISABLE}
                                filterOption={(input, option) =>
                                  (option?.children?.toString() || "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase().trim())
                                }
                                onChange={(StatusValue) =>
                                  handleStatusValueChange(key, StatusValue)
                                }
                              >
                                {data?.status !== UserStatus.DISABLE && (
                                  <Option key={0} value={true}>
                                    Active
                                  </Option>
                                )}
                                <Option key={1} value={false}>
                                  Inactive
                                </Option>
                              </Select>
                            </Form.Item>
                          </FloatLabel>
                        </Col>
                        <Col xs={24} sm={12} md={5}>
                          <FloatLabel
                            label="Role Color"
                            placeholder="Select Color"
                            name={["roles", name, "user_role_color"]}
                            required
                          >
                            <Form.Item
                              {...restField}
                              name={[name, "user_role_color"]}
                              rules={rules.user_role_color}
                            >
                              <Select
                                size="large"
                                allowClear
                                showSearch
                                disabled={
                                  data?.status === UserStatus.DISABLE ||
                                  (userRoles &&
                                    userRoles[name]?.status === false)
                                }
                                filterOption={(input, option) =>
                                  ((option?.value as string) || "")
                                    ?.toLowerCase()
                                    .includes(input.toLowerCase().trim())
                                }
                                onChange={(e) => selectOp(e, key)}
                              >
                                {(userRoles && userRoles[name]?.status === false
                                  ? disableColorOptions
                                  : renderOption.filter((color) =>
                                      finalOptions
                                        ? !finalOptions[key]?.includes(
                                            color.value
                                          )
                                        : color
                                    )
                                ).map((option) => (
                                  <Option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    <div className="gx-d-flex gx-justify-content-between gx-align-items-center">
                                      <span>{option.value} </span>
                                      <div
                                        style={{
                                          width: "14px",
                                          height: "14px",
                                          marginLeft: "8px",
                                          backgroundColor: option.value,
                                        }}
                                      ></div>
                                    </div>
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </FloatLabel>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={fields.length === 1 ? 2 : 3}
                          className="{fields.length === 1 ? 'add-remove-user' : 'add-remove-user-btn'}"
                          style={{ marginTop: "0.125rem" }}
                        >
                          <AddRemoveButton
                            fieldsLength={fields.length}
                            index={index}
                            add={() => add({ status: true })}
                            remove={() => remove(name)}
                          />
                        </Col>
                      </Row>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </Form.List>
        <Form.Item className="modal-btn-grp" style={{ display: "none" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="btn-submit"
            ref={myRef}
          >
            {data ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserAdd;

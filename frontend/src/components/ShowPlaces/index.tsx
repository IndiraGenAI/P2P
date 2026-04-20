import { useParams } from "react-router-dom";
import TableComponent from "../DataTable";
import DrawerComponent from "../Drawer";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { ISelectedHardwareDetails, IShowPlaces } from "./ShowPlaces.model";
import { searchHardwareData } from "src/state/Hardware/hardware.action";
import { AppDispatch } from "src/state/app.model";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/state/app.hooks";
import { hardwareSelector } from "src/state/Hardware/hardware.reducer";
import { Button, Checkbox, Form, Select, message } from "antd";
import { IHardwareDetails } from "src/services/Hardware/Hardware.model";
import {
  bulkUpdateEditPlaces,
  searchPlacesData,
} from "src/state/places/places.action";
import { IPlacesData } from "src/state/places/places.model";
import { GetSortOrder, StringContaingNumberSort } from "src/utils/helperFunction";

const ShowPlaces = (props: IShowPlaces) => {
  const { placeAssignDrawer, setPlaceAssignDrawer, placesData } = props;
  const dispatch = useDispatch<AppDispatch>();
  const hardwareState = useAppSelector(hardwareSelector);
  const [selectedHardware, setSelectedHardware] = useState<
    ISelectedHardwareDetails[]
  >([]);
  const [existingHardware, setExistingHardware] = useState<
    ISelectedHardwareDetails[]
  >([]);
  const [placesForm] = Form.useForm();
  const { id } = useParams();
  const { Option } = Select;
  useEffect(() => {
    if (id) {
      Object.assign({ branch_id: id });
      dispatch(searchHardwareData({ branch_id: id ,  noLimit: true}))?.then((res: any) => {
        if (res?.payload) {
          // Hardware is assigned in another Branch Infrastructure, it will not be displayed in the hardware drop-down.
          const existingHardwareData: ISelectedHardwareDetails[] | [] =
            res?.payload?.data?.rows
              ?.filter(
                (hardwareData: IHardwareDetails) =>
                  hardwareData?.places?.length > 0
              )
              ?.map((hardwareDetails: IHardwareDetails) => {
                return {
                  id: hardwareDetails?.places[0]?.id,
                  hardware_id: hardwareDetails?.id,
                  is_laptop: hardwareDetails?.places[0]?.is_laptop,
                  branch_infrastructure_id : hardwareDetails?.places[0]?.branch_infrastructure_id,
                };
              });
        
              setExistingHardware([...existingHardwareData, ...selectedHardware]);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (placesData && placesData?.places.length > 0) {
      const branch_infrastructure_id = placesData?.id;

      const data = {
        branch_id: id,
        branch_infrastructure_id,
        noLimit: true
      };
      dispatch(searchPlacesData(data)).then((res: any) => {
        const hardwareData = res?.payload?.data?.rows?.filter(
          (placeData: IPlacesData) => placeData?.hardwares
        );

        const otherData = res?.payload?.data?.rows?.filter(
          (placeData: IPlacesData) => !placeData?.hardwares
        );

        const initialData: Array<[string, string]> = hardwareData?.reduce(
          (result: { [key: string]: string }, places: IPlacesData) => {
            result[`hardware_id_${places?.id}`] = places?.hardwares?.name;
            return result;
          },
          {}
        );

        Object.entries(initialData)?.forEach(
          ([key, value]: [string, [string, string]]) =>
            placesForm?.setFieldValue(key, value)
        );

        setSelectedHardware((previousData: ISelectedHardwareDetails[]) => {
          const selectedHardwareData: ISelectedHardwareDetails[] | [] =
            res?.payload?.data?.rows.map((placeData: IPlacesData) => ({
              id: placeData?.id,
              hardware_id: placeData?.hardware_id,
              is_laptop: placeData?.is_laptop,
            })) || [];

          return [
            ...selectedHardwareData,
            ...otherData,
            ...previousData,
          ]?.filter(
            (obj, index, self) =>
              index ===
              self.findIndex(
                (innerObj) =>
                  innerObj.id === obj.id &&
                  innerObj.hardware_id === obj.hardware_id &&
                  innerObj.is_laptop === obj.is_laptop
              )
          );
        });
      });
    }
  }, [placesData]);

  const hardwareChange = (hardware: string, places_id: number) => {
    const hardware_id =
      hardware !== undefined
        ? Number(hardware?.split("-$name$-")[0])
        : hardware || null;
    const hardware_name =
      hardware !== undefined ? hardware?.split("-$name$-")[1] : hardware;
    placesForm.setFieldValue(`hardware_id_${places_id}`, hardware_name);
    const data = [...selectedHardware];
    const isAssignRecord = data?.findIndex(
      (record: ISelectedHardwareDetails) => record?.id === places_id
    );

    if (isAssignRecord !== -1) {
      data[isAssignRecord].hardware_id = hardware_id;
      setSelectedHardware(data);
    } else {
      setSelectedHardware([...data, { hardware_id, id: places_id }]);
    }
  };

  const onFinishPlacesForm = () => {
    // plcae update time run this
    const data = {
      branch_infrastructure_id: placesData?.id,
      places: selectedHardware,
    };
    dispatch(bulkUpdateEditPlaces(data))?.then((res: any) => {
      if (res?.payload) {
        setPlaceAssignDrawer(false);
        message.success(res?.payload?.message);
      } else {
        if (res?.error?.message) {
          message.error(res?.error?.message);
        }
      }
    });
  };

  const onChangeCheckbox = (value: boolean, record: IPlacesData) => {
    setSelectedHardware((previousData: ISelectedHardwareDetails[]) => {
      const data = [...previousData];
      const isAssignRecord = data?.findIndex(
        (id: ISelectedHardwareDetails) => id?.id === record?.id
      );

      if (isAssignRecord !== -1) {
        data[isAssignRecord].is_laptop = value;
      } else {
        data.push({ id: record?.id, is_laptop: value, hardware_id: null });
      }
      return data;
    });
  };

  const columnData: ColumnsType<[]> = [
    {
      title: "No.",
      dataIndex: "id",
      width: "20%",
      sorter: false,
      align: "center",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "places",
      dataIndex: "",
      sorter: false,
      align: "center",
      render: (record) => {
        return (
          <>
            <h6>{record.name}</h6>
          </>
        );
      },
    },
    {
      title: "hardware",
      dataIndex: "",
      sorter: false,
      align: "center",
      render: (record, _, index) => {

        let hardwareIds = selectedHardware.filter(
          (hardware) => hardware.hardware_id
        )?.map((hardware) => hardware.hardware_id);

        const recordData = selectedHardware.find(
          (hardware) => hardware.id === record.id
        );

        if (existingHardware?.length > 0) {
          const branchInfrastructureId = record?.branch_infrastructure_id;
          const ids = new Set(hardwareIds);
        
          existingHardware.forEach((hardware:ISelectedHardwareDetails) => {
            if (branchInfrastructureId !== hardware?.branch_infrastructure_id && hardware?.hardware_id) {
              ids.add(hardware?.hardware_id);
            }
          });
        
          hardwareIds = Array.from(ids);
        }
        
        return (
          <React.Fragment key={record?.id}>
            <Form.Item name={`hardware_id_${record?.id}`}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                showArrow
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString() || "")
                    .toLowerCase()
                    .includes(input.toLowerCase().trim())
                }
                onChange={(e) => hardwareChange(e, record?.id)}
                placeholder="Select Hardware"
                disabled={recordData?.is_laptop}
              >
                {hardwareState?.hardwareData?.data?.rows?.slice().sort(GetSortOrder("name", "ASC")).map(
                  (hardwareDetails: IHardwareDetails) => {
                    if (!hardwareIds.includes(hardwareDetails.id)) {
                      return (
                        <Option
                          key={hardwareDetails.id}
                          value={`${hardwareDetails.id}-$name$-${hardwareDetails.name}`}
                          label={hardwareDetails.name}
                        >
                          {hardwareDetails.name}
                        </Option>
                      );
                    }
                  }
                )}
              </Select>
            </Form.Item>
          </React.Fragment>
        );
      },
    },
    {
      title: "laptop",
      dataIndex: "",
      sorter: false,
      align: "center",
      render: (record) => {
        const recordData = selectedHardware.find(
          (hardware) => hardware.id === record.id
        );
        return (
          <>
            <Checkbox
              style={{ fontWeight: 500 }}
              onChange={(e) => {
                onChangeCheckbox(e.target.checked, record);
              }}
              checked={recordData?.is_laptop || false}
              defaultChecked={recordData?.is_laptop}
              disabled={!!recordData?.hardware_id}
            />
          </>
        );
      },
    },
  ];

  return (
    <div>
      {
        <DrawerComponent
          title={"Places"}
          onClose={() => {
            setPlaceAssignDrawer(false);
          }}
          visible={placeAssignDrawer}
          footer={true}
          label={"Submit"}
          className="Hardware-drawer"
        >
          {({ myRef }: any) => (
            <Form form={placesForm} onFinish={onFinishPlacesForm}>
              <TableComponent
                columns={columnData}
                dataSource={
                  placesData?.places
                    ?.slice()
                    ?.sort(StringContaingNumberSort("name")) || []
                }
                loading={false}
              />

              <Form.Item
                className="modal-btn-grp gx-d-none"
                style={{ width: "100%" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="btn-submit gx-my-0"
                  ref={myRef}
                  style={{ display: "none" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </DrawerComponent>
      }
    </div>
  );
};

export default ShowPlaces;

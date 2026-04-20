import { Cascader, Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/state/app.hooks";
import { AppDispatch } from "src/state/app.model";
import { searchCommonModuleData } from "src/state/commonModule/commonModule.action";
import { commonModuleSelector } from "src/state/commonModule/commonModule.reducer";
import { GetSortOrder } from "src/utils/helperFunction";
import { AreaStatus, CityStatus, CountryStatus, ILocationProps, LocationData, StateStatus } from "./Location.model";

const LocationComponent = (props: ILocationProps) => {
  const { name, placeholder, rules } = props;
  const dispatch = useDispatch<AppDispatch>();
  const commonModuleState = useAppSelector(commonModuleSelector);
  const [data, setData] = useState<any>();
  const [city, setCity] = useState<LocationData[]>([]);
  const [country, setCountry] = useState([]);
  const [area, setArea] = useState<LocationData[]>([]);
  const [state, setState] = useState([]);

  useEffect(() => {
    dispatch(
      searchCommonModuleData({ noLimit: true, orderBy: "name", order: "ASC" })
    );
  }, []);

  useEffect(() => {
    if (commonModuleState.commonModulesData.data) {
      setData(commonModuleState.commonModulesData.data);
    }
  }, [commonModuleState.commonModulesData.data]);
  let options = [];

  useEffect(() => {
    data && setCity([...data.city.filter((city: CityStatus)=>city?.status === true)].sort(GetSortOrder("name", "ASC")));
    data && setCountry(data.country.filter((country: CountryStatus)=>country?.status === true));
    data && setState(data.state.filter((state: StateStatus)=>state?.status === true));
    data && setArea([...data.area.filter((area: AreaStatus)=>area?.status === true)].sort(GetSortOrder("name", "ASC")));
  }, [data]);

  if (country && country.length > 0) {
    for (let i = 0; i < country.length; i++) {
      const c: any = {
        country: country[i]["name"],
        value: country[i]["name"],
        label: country[i]["name"],
        children: [],
      };
      options.push(c);
      if (state && state.length > 0) {
        for (let j = 0; j < state.length; j++) {
          if (state[j]["country_id"] === country[i]["id"]) {
            const s: any = {
              state: state[j]["name"],
              value: state[j]["name"],
              label: state[j]["name"],
              children: [],
            };
            c.children.push(s);
            if (city && city.length > 0) {
              for (let k = 0; k < city.length; k++) {
                if (
                  city[k]["country_id"] === country[i]["id"] &&
                  city[k]["state_id"] === state[j]["id"]
                ) {
                  const ct: any = {
                    city: city[k]["name"],
                    value: city[k]["name"],
                    label: city[k]["name"],
                    children: [],
                  };
                  s.children.push(ct);
                  if (area && area.length > 0) {
                    for (let l = 0; l < area.length; l++) {
                      if (
                        area[l]["country_id"] === country[i]["id"] &&
                        area[l]["city_id"] === city[k]["id"]
                      ) {
                        const a = {
                          area: area[l]["name"],
                          value: area[l]["name"],
                          label: area[l]["name"],
                        };
                        ct.children.push(a);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return (
    <>
      <Form.Item
        name={name ? name : "location"}
        rules={rules}
        className="location-label"
      >
        <Cascader
          className="gx-text-left"
          style={{ textTransform: "capitalize" }}
          getPopupContainer={(trigger) => trigger.parentNode}
          options={options}
          placeholder={
            placeholder === undefined ? "Please Select Location" : placeholder
          }
          size="large"
        />
      </Form.Item>
    </>
  );
};

export default LocationComponent;

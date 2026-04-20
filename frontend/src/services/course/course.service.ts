import request from "../../lib/axios/request";
import { IApiResponse } from "../../utils/models/common";
import { ICourseRecord } from "../../pages/Course/Course.model";
import {
  ICourseStatus,
  ICourseDetails,
  Icourse,
} from "./course.model";
import { config } from "src/utils";

class CourseService {
  ENDPOINT = config.baseApiMasters+ "/course";

  public removeCourseById = async (
    id: number
  ): Promise<IApiResponse<any>> => {
    const url = `${this.ENDPOINT}/${id}`;
    return request({ url, method: "DELETE" }).then((res) => {
      return res.data;
    });
  };

  public updateCourseStatus = async (
    data: ICourseStatus
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}/${data.id}/status`;
    return request({ url, method: "PATCH", data }).then((res) => {
      return res.data;
    });
  };

  public editCourseById = async (
    data: ICourseRecord
  ): Promise<IApiResponse<any>> => {
    const url = `${this.ENDPOINT}/${data.id}`;
    return request({ url, method: "PUT", data }).then((res) => {
      return res.data;
    });
  };

  public createNewCourse = async (
    data: ICourseDetails
  ): Promise<IApiResponse<string>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "POST", data }).then((res) => {
      return res.data;
    });
  };

  public searchCourseData = async (
    data: ICourseDetails
  ): Promise<IApiResponse<Icourse[]>> => {
    const url = `${this.ENDPOINT}`;
    return request({ url, method: "GET", params: data }).then((res) => {
      return res.data;
    });
  };
}

export default new CourseService();

import { message } from "antd";
import { Auth } from "aws-amplify";
import { useEffect } from "react";
import request from "./request";

// Response interceptors Customize based on your need

const Interceptor = () => {
  useEffect(() => {
    const id: string = JSON.parse(
      localStorage.getItem("myStorageID") as string
    );
  }, []);
  useEffect(() => {
    request.interceptors.request.use(
      async (config) => {
        const id: string = JSON.parse(
          localStorage.getItem("myStorageID") as string
        );
        // Add X-Access-Token header to every request, you can add other custom headers here
        const currentUser = await Auth.currentSession();
        if (currentUser) {
          const accessToken = currentUser.getAccessToken();
          config.headers &&
            (config.headers["Authorization"] = accessToken.getJwtToken());
        }
        if (config.headers && config.headers["no-auth"]) {
          delete config.headers["no-auth"];
          delete config.headers["Authorization"];
        }
        config.headers && (config.headers["userRoleId"] = id);

        return config;
      },
      (error) => {
        alert(error);
        Promise.reject(error);
      }
    );

    request.interceptors.response.use(
      (response) => {
        const { status, data } = response;
        if (status && status !== 200) {
          return Promise.reject(new Error(data.message || "Error"));
        } else {
          return response;
        }
      },
      (error) => {
        const { response } = error;

        if (!response) {
          message.error("Please check your internet connection.");
        }

        let e = Array.isArray(response?.data.message)
          ? response.data.message.join(" ")
          : response?.data.message;

        if (response.status === 500) {
          message.error(e);
        }

        return Promise.reject(e);
      }
    );
  }, []);

  return null;
};

export default Interceptor;

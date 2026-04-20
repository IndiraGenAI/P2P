import { Button, Form, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import config from "src/utils/config";
import { UploadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { IPrev, IUploadedFileProps } from "./UploadFileField";
import NoImage from "../../assets/images/no-image.png";

const UploadedFileField = (props: IUploadedFileProps) => {
  const {
    uploadedImage,
    setUploadedImage,
    name,
    showUploadButton,
    isViewAdmission,
    isBranches,
    isAdmissionPage,
    showUploadList,
    rulse,
    acceptType,
    isEdit,
    form,
  } = props;
  let [value, setValue] = useState<any>();
  const [deleteBtn, setDeleteBtn] = useState<Boolean>(true);

  const handledeleteDocument = () => {
    setDeleteBtn(false);
    setValue("");
    form && form?.setFieldValue(name, null);
    setUploadedImage((prev: IPrev) => {
      if (prev !== undefined) {
        const newObject = JSON.parse(JSON.stringify(prev));

        Object.keys(newObject).forEach((key) => {
          if (key === name) {
            newObject[key] = null;
          }
        });
        return newObject;
      }
    });
  };

  useEffect(() => {
    if (uploadedImage === undefined) {
      setValue("");
    }
  }, [uploadedImage]);

  const renderPreview = () => {
    if (!uploadedImage && !value) {
      return (
        <div
          className="gx-d-flex gx-align-items-center gx-justify-content-center"
          style={{
            textAlign: "center",
            marginTop: "5px",
            overflow: "hidden",
          }}
        >
          <img
            className="img-thumbnail gx-img-fluid"
            src={NoImage}
            alt="upload"
          />
        </div>
      );
    } else if (uploadedImage || value) {
      if (value) {
        value = value;
      } else if (uploadedImage) {
        value = uploadedImage;
      }
      const fileName = value instanceof File ? value?.name : value;

      const ext =
        typeof fileName === "string" &&
        fileName.split(".").pop()?.toLowerCase();

      return ext === "mp4" ? (
        <>
          <video width="200" height="130" controls>
            <track default kind="captions" />
            <source
              src={
                value instanceof File
                  ? URL.createObjectURL(value)
                  : config.bucket_name + "/" + value
              }
              type="video/mp4"
            />
          </video>
        </>
      ) : (
        <div
          className={isBranches === true ? "logo-upload" : "upload-image-box"}
          style={{
            maxHeight: "150px",
            textAlign: "center",
            overflow: "hidden",
            position: "relative",
            zIndex: "999",
            display: "flex",
            alignItems: "Center",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          {ext === "pdf" ? (
            <object
              className="img-thumbnail"
              data={
                value instanceof File
                  ? URL.createObjectURL(value)
                  : config.bucket_name + "/" + value
              }
            ></object>
          ) : deleteBtn ? (
            <img
              className="img-thumbnail"
              src={
                value instanceof File
                  ? URL.createObjectURL(value)
                  : config.bucket_name + "/" + value
              }
              alt="upload"
            />
          ) : (
            <img
              className="img-thumbnail gx-img-fluid"
              src={NoImage}
              alt="upload"
            />
          )}

          {deleteBtn && !isBranches ? (
            <>
              <a
                className="view-btn delete-view-btn "
                href={
                  value instanceof File
                    ? URL.createObjectURL(value)
                    : config.bucket_name + "/" + value
                }
                target="_blank"
              >
                <EyeOutlined />
              </a>
              {isEdit && (!isViewAdmission || name !== "consent_letter") && (
                <Button
                  className="delete-btn"
                  onClick={() => handledeleteDocument()}
                >
                  <DeleteOutlined style={{ color: "#fff" }} />
                </Button>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      );
    }
  };
  const setFileValue = (file: {}) => {
    setValue(Object.assign(file, { fieldName: name }));
    setUploadedImage((prev: IPrev) => {
      if (prev !== undefined) {
        const newObject = JSON.parse(JSON.stringify(prev));

        Object.keys(newObject).forEach((key) => {
          if (key === name) {
            newObject[key] = file;
          }
        });
        return newObject;
      }
    });
  };

  return (
    <>
      {showUploadButton === true && (
        <div
          className={`gx-m-0 doubleError ${
            isViewAdmission === true && "view-admission-documents upload-icon"
          }`}
        >
          <Form.Item name={name} rules={rulse}>
            <Upload
              onRemove={(e) => {
                setValue("");
              }}
              beforeUpload={(file: any) => {
                setDeleteBtn(true);
                let isJpgOrPng;
                if (file) {
                  if (!(file.size < 5242880)) {
                    setValue("");
                    message.error("File size must smaller than 5MB!");
                    return Upload.LIST_IGNORE;
                  } else {
                    if (
                      file &&
                      (name === "photos" ||
                        file.fieldName === "photos" ||
                        file.fieldName === "logo" ||
                        file.fieldName === "logo_two")
                    ) {
                      isJpgOrPng =
                        file.type === "image/jpeg" ||
                        file.type === "image/png" ||
                        file.type === "image/jpg" ||
                        file.type === "image/webp";
                      if (!isJpgOrPng) {
                        message.error(
                          `You can only upload JPG/PNG/JPEG/WEBP file!`
                        );
                        setValue(value);
                        return Upload.LIST_IGNORE;
                      } else {
                        setFileValue(file);
                      }
                    } else {
                      isJpgOrPng =
                        file.type === "image/jpeg" ||
                        file.type === "image/png" ||
                        file.type === "image/png" ||
                        file.type === "image/webp" ||
                        file.type === "application/pdf";
                      if (!isJpgOrPng) {
                        message.error(
                          "You can only upload JPG/PNG/JPEG/WEBP/PDF file!"
                        );
                        setValue(value);
                        return Upload.LIST_IGNORE;
                      } else {
                        setFileValue(file);
                      }
                    }

                    return false;
                  }
                }
              }}
              showUploadList={showUploadList}
              accept={
                acceptType === true
                  ? "image/jpg,image/jpeg,image/png,image/webp"
                  : "image/jpg,image/jpeg,image/png,image/webp,application/pdf"
              }
              // listType="picture"
              className="upload-list-inline"
            >
              <Button
                className="upload-btn gx-w-100 "
                icon={name !== "consent_letter" && <UploadOutlined />}
              >
                {!isViewAdmission && "Upload"}
              </Button>
            </Upload>
          </Form.Item>
        </div>
      )}
      {uploadedImage !== null &&
        uploadedImage !== "" &&
        uploadedImage !== undefined &&
        !isAdmissionPage && (
          <a
            className="view-btn 000"
            href={config.bucket_name + "/" + uploadedImage}
            target="_blank"
          >
            <EyeOutlined />
          </a>
        )}
      {renderPreview()}
    </>
  );
};
export default UploadedFileField;

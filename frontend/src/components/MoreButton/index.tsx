import { Button, Modal } from "antd";
import { IMoreButtonProps } from "./MoreButton.model";

const MoreButtonShow = (props: IMoreButtonProps) => {
  const { text, titleText, textLength = 24, prefixTitleShow = true } = props;
  const info = (value: string) => {
    Modal.info({
      title: titleText,
      content: (
        <div
          className="remark-message fixHeight-model"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ),
      onOk() {},
    });
  };

  return (
    <div>
      <div className="view-remarks">
        {prefixTitleShow && (
          <span className="gx-font-weight-semi-bold">
            {`${titleText} :`}&nbsp;
          </span>
        )}
        <p className="gx-mr-1 note-text">
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </p>
        <Button type="primary" onClick={() => info(text)}>
          More
        </Button>
      </div>
    </div>
  );
};
export default MoreButtonShow;

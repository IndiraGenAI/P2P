import { Button, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { UpdateStatus } from "src/hooks/checkVersion/types";
import { useUpdateCheck } from "src/hooks/checkVersion/useUpdateCheck";

const CheckVersionModal = () => {
  let location = useLocation();
  const [close, setClose] = useState<boolean>(false);
  const setTimer: any = useRef(null);
  //this hook for check version update
  const { status, checkUpdate, reloadPage } = useUpdateCheck({
      type: 'manual',
  });

  const checkVersion = () => {
      if (setTimer.current === null) {
          checkUpdate();
          setTimer.current = setTimeout(() => {
              clearTimeout(setTimer.current);
              setTimer.current = null;
          }, 1000 * 60 * 5);
      }
  };

  useEffect(() => {
      if (status !== UpdateStatus.available) {
          checkVersion();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleRefresh = () => {
    reloadPage();
  };

  useEffect(() => {
    if (status === UpdateStatus.available) {
      setClose(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [status]);

  return (
    <div>
      <Modal
        title=""
        visible={close}
        footer={false}
        maskClosable={false}
        closable={false}
        className="reload-modal"
      >
        <div className="gx-mb-3">
        <p className="gx-mb-1">Exciting Update <span className="alert-ongoing">Alert!</span></p>  
        <p className="gx-mb-1">A New App Version <span className="alert-pending">Awaits!</span></p>  
        <p className="gx-mb-1">Please Reload the Page for Awesome <span className="alert-success">New Features!</span></p>
        </div>
        <Button onClick={handleRefresh}>Reload Page</Button>
      </Modal>
    </div>
  );
};

export default CheckVersionModal;

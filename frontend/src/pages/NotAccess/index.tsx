import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "src/state/Login/login.action";
import { AppDispatch } from "src/state/app.model";

const NotAccess = () => {
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();

  const onLogout = async () => {
    await dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  return (
    <>
      <div className="no-permission">
        <div className="no-permission-box">
          <img
            src="../../assets/images/no-permission.jpg"
            alt="no-permission-img"
          />
          <h3>Sorry, you cannot access this page</h3>
          <h5>Please contact to administrative</h5>
          <button className="no-permission-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default NotAccess;

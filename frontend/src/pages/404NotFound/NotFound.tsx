import { Link } from "react-router-dom";
import notFoundImg from "../../assets/images/404-error.png";

const NotFound = () => {
  return (
    <div className="no-found-page">
      <div className="no-found-text gx-text-center">
        <img src={notFoundImg} />
        <h2>No Page Found</h2>
        <Link to="/" className="goto-return-btn">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

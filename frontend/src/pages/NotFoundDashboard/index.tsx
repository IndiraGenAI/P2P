import { useAppSelector } from "src/state/app.hooks";
import { userSelector } from "src/state/users/user.reducer";

function NotFoundDashboard() {
  const userState = useAppSelector(userSelector);
  return (
    <div><h1>
      Hello{" "}
      {userState.userData.data.first_name +
        " " +
        userState.userData.data.last_name}{" "}</h1>
    </div>
  );
}

export default NotFoundDashboard;

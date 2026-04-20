import { Card, Typography } from "antd";

/**
 * The full dashboard references many widgets that are not present in this
 * workspace snapshot. This placeholder keeps the app shell buildable.
 */
const Dashboard = () => {
  return (
    <Card>
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Typography.Paragraph>
        Detailed dashboard widgets are not included in this checkout. Use the
        navigation menu for Users, Sectors, and other available screens.
      </Typography.Paragraph>
    </Card>
  );
};

export default Dashboard;

import adminRoute from "./adminRoute";
import schoolRoute from "./schoolRoute";
import parentRoute from "./parentRoute";
import healthcareRoute from "./healthcareRoute";

const indexRoute = () => {
  return (
    <>
      {adminRoute()}
      {schoolRoute()}
      {parentRoute()}
      {healthcareRoute()}
    </>
  );
};

export default indexRoute;

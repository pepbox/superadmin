import { Navigate, Outlet } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import { useFetchUserQuery } from "../authApi";

const ProtectedLayout = () => {
  const { data, isLoading, isError } = useFetchUserQuery(undefined);

  if (isLoading) {
    return <Loader />;
  }
  if (isError || !data || !data.admin) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedLayout;

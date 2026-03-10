import { useSelector } from "react-redux";

const useUserPermissions = () => {
  const user = useSelector((state) => state.CurrentUser.user);

  const isSubAdmin = user?.is_subadmin;

  return {
    isSubAdmin,
  };
};

export default useUserPermissions;

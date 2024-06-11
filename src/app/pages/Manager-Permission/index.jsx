import CardPermission from "./components/CardPermission";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { roleAction } from "_redux/slice/roleSlice";

export default function ManagerPermission() {
  const dispatch = useDispatch();
  const listRole = useSelector((state) => state.role.listRole);

  useEffect(() => {
    dispatch(roleAction.GetAllRolesCounterUser());
  }, []);

  return (
    <div className="flex flex-col mt-24">
      <div className="grid grid-cols-3 gap-3 w-full mb-5">

        {listRole?.map((role, index) => {
          return <CardPermission key={index} role={role} isAdd={false} />;
        })}

        <CardPermission role={{}} isAdd={true} />
      </div>
    </div>
  );
}

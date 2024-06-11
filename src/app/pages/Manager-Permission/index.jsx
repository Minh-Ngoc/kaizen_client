import { Flex } from "@chakra-ui/react";
import CardPermission from "./components/CardPermission";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { roleAction } from "_redux/slice/roleSlice";
import { CircularProgress } from "@nextui-org/react";
export default function ManagerPermission() {
  const dispatch = useDispatch();
  const listRole = useSelector((state) => state.role.listRole);
  const isLoading = useSelector((state) => state.role.isLoading);
  useEffect(() => {
    dispatch(roleAction.GetAllRolesCounterUser());
  }, []);
  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <div className="grid grid-cols-3 gap-3 w-full mb-5">
        {listRole?.map((role) => {
          return <CardPermission role={role} isAdd={false} />;
        })}
        <CardPermission role={{}} isAdd={true} />
      </div>
    </Flex>
  );
}

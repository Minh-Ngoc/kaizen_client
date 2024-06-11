import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../../_redux/slice/user.slice";
import { roleAction } from "../../../_redux/slice/roleSlice";
import { getAllTeams } from "../../../_redux/slice/teamSlice";
import { Button, Input, Tooltip, Select, SelectItem } from "@nextui-org/react";
import { IoSearchSharp } from "react-icons/io5";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import moment from "moment";
import { LiaEditSolid } from "react-icons/lia";
import { BiPlug, BiTrash } from "react-icons/bi";
import ButtonExportExampleExcel from "./components/exportExampleExcel";
import TableNextUI from "app/components/TableNextUI";
import ButtonExportExcel from "./components/exportExcel";
import ModalUser from "./components/modaUser";
import { deleteUsers } from "services/api.service";
import ModalDeleteMutiOrOne from "../../components/Modal/ModalDelete";
function UserManager() {
  const dispatch = useDispatch();
  const counts = useSelector((state) => state.user.counts);
  console.log("counts: ", counts);
  const listUser = useSelector((state) => state.user.listUser);
  const isLoading = useSelector((state) => state.user.isLoading);
  const listRole = useSelector((state) => state.role.listRole);
  const listTeam = useSelector((state) => state.team.listTeam);
  const [searchValue, setSearchValue] = useState("");
  const [roleSelected, setRoleSelected] = useState("all");
  const [teamSelected, setTeamSelected] = useState("all");
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [userData, setUserDate] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(new Set(["10"]));
  const [listIdSelected, setListIdSelected] = useState([]);
  const [listSelected, setListSelected] = useState(new Set([]));
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    dispatch(userAction.getPagination({}));
    dispatch(roleAction.getAllRoles());
    dispatch(getAllTeams());
  }, []);
  const columns = [
    { name: "Người dùng", _id: "fullName" },
    { name: "Quyền hạn", _id: "role" },
    { name: "Nhóm", _id: "team" },
    { name: "Ngày tạo", _id: "createdAt" },
    { name: "Hành động", _id: "actions" },
  ];
  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "fullName":
        return (
          <p className="text-[13px] text-white">
            {item?.firstName || item?.lastName
              ? `${item?.firstName || ""} ${item?.lastName || ""}`
              : item?.name
              ? `${item?.name}`
              : "(Trống)"}
          </p>
        );
      case "role":
        return <p className="text-[13px] text-white">{item?.role?.name}</p>;
      case "team":
        return (
          <p className="text-[13px] text-white">
            {item?.team?.length !== 0
              ? item?.team?.reduce((acc, team, index) => {
                  if (index !== 0) acc += ", ";
                  acc += team?.name;
                  return acc;
                }, "")
              : "(Trống)"}
          </p>
        );
      case "createdAt":
        return (
          <p className="text-[13px] text-white">
            {moment(item.createdAt).format("DD/MM/yyyy")}
          </p>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            {/* Detail */}
            <Tooltip
              color={"warning"}
              content={"Xem chi tiết"}
              className="capitalize"
              disableAnimation={true}
            >
              <Button
                variant="solid"
                radius="full"
                color="warning"
                className="min-w-0 w-8 p-1 h-auto"
                // onClick={() => navigateToProjectDetail(item?._id)}
              >
                <FaRegEye className="min-w-max text-base w-4 h-4 text-white" />
              </Button>
            </Tooltip>

            {/* Edit */}
            <Tooltip
              color={"primary"}
              content={"Chỉnh sửa"}
              className="capitalize"
              disableAnimation={true}
            >
              <Button
                variant="solid"
                radius="full"
                color="primary"
                className="min-w-0 w-8 p-1 h-auto"
                onClick={() => {
                  setIsOpenModalUser(true);
                  setIsAdd(false);
                  setUserDate(item);
                }}
              >
                <LiaEditSolid className="min-w-max text-base w-4 h-4 text-white" />
              </Button>
            </Tooltip>

            {/* Delete */}
            <Tooltip
              color={"danger"}
              content={"Xóa"}
              className="capitalize"
              disableAnimation={true}
            >
              <Button
                variant="solid"
                radius="full"
                color="danger"
                className="min-w-0 w-8 p-2 h-auto"
                onClick={() => {
                  setIsOpenModalDelete(true);
                  setRowSelection({ [item?.id]: true });
                  setListIdSelected([item?._id]);
                }}
              >
                <FaRegTrashCan className="min-w-max w-4 h-4 text-white" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return (
          <div className="text-white text-xs text-center">{cellValue}</div>
        );
    }
  }, []);
  const handlePageChange = (nextPage, nextPageSize) => {
    nextPageSize && setPageSize(nextPageSize);
    setPageIndex(nextPage);
    dispatch(
      userAction.getPagination({
        pageIndex: nextPage,
        pageSize: nextPageSize
          ? String([...nextPageSize][0])
          : String([...pageSize][0]),
        searchValue,
        role: roleSelected,
        team: teamSelected,
      })
    );
  };
  const handleSearh = () => {
    setPageIndex(1);
    dispatch(
      userAction.getPagination({
        pageIndex: 1,
        pageSize: String([...pageSize][0]),
        searchValue,
        role: roleSelected,
        team: teamSelected,
      })
    );
  };
  const handleonComplete = () => {
    dispatch(
      userAction.getPagination({
        pageIndex,
        pageSize: String([...pageSize][0]),
        searchValue,
        role: roleSelected,
        team: teamSelected,
      })
    );
  };
  const handleOnDelete = () => {
    let tempPageIndex = pageIndex;
    const checkPage = (counts - listIdSelected?.length) / pageSize;
    if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
    if (tempPageIndex <= 0) tempPageIndex = 1;
    dispatch(
      userAction.getPagination({
        pageIndex: tempPageIndex,
        pageSize: String([...pageSize][0]),
        searchValue,
        role: roleSelected,
        team: teamSelected,
      })
    );
    setRowSelection({});
    setListIdSelected([]);
    setPageIndex(tempPageIndex);
  };
  return (
    <>
      <div className="mt-24 flex flex-col">
        <div className="mb-4 rounded-sm flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper">
          <div className="p-6 rounded-lg flex flex-row flex-wrap justify-between items-center gap-2 w-full">
            <div className="max-w-[220px] flex items-center gap-2">
              <Button
                variant="solid"
                color={"primary"}
                className="rounded-md min-w-32 text-white font-bold text-xs"
                startContent={
                  <BiPlug className="text-white min-w-max min-h-max" />
                }
                onClick={() => {
                  setIsOpenModalUser(true);
                  setIsAdd(true);
                  setUserDate({});
                }}
              >
                Thêm mới
              </Button>
              <Button
                variant="solid"
                color={"danger"}
                className="rounded-md min-w-32 text-white font-bold text-xs"
                startContent={
                  <BiTrash className="text-white min-w-max min-h-max" />
                }
                onClick={() => {
                  setIsOpenModalDelete(!isOpenModalDelete);
                }}
                // isDisabled={listIdSelected?.length === 0}
              >
                Xóa
              </Button>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <ButtonExportExcel />
              <ButtonExportExampleExcel />

              <Input
                value={searchValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearh();
                }}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập tên người dùng..."
              />
              <div className="min-w-44">
                <Select
                  label=""
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5 rounded",
                    base: "w-full rounded",
                    trigger: "min-h-7 h-9 rounded",
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "w-full",
                    },
                  }}
                  items={[
                    { value: "all", label: "Tất cả quyền hạn" },
                    ...listRole.map((team) => {
                      return { value: team._id, label: team.name };
                    }),
                  ]}
                  selectionMode="single"
                  selectedKeys={[roleSelected]}
                  onSelectionChange={(value) => {
                    const arrVal = [...value];
                    setRoleSelected(arrVal[0] ?? "all");
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
              <div className="min-w-44">
                <Select
                  label=""
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5 rounded",
                    base: "w-full rounded",
                    trigger: "min-h-7 h-9 rounded",
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "w-full",
                    },
                  }}
                  items={[
                    { value: "all", label: "Tất cả nhóm" },
                    ...listTeam.map((team) => {
                      return { value: team._id, label: team.name };
                    }),
                  ]}
                  selectionMode="single"
                  selectedKeys={[teamSelected]}
                  onSelectionChange={(value) => {
                    const arrVal = [...value];
                    setTeamSelected(arrVal[0] ?? "all");
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>

              <Button
                variant="solid"
                color={"primary"}
                className="rounded-md min-w-32 text-white font-bold text-xs mr-5"
                startContent={
                  <IoSearchSharp className="text-white min-w-max min-h-max" />
                }
                onClick={handleSearh}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card-project shadow-wrapper p-5 pb-10 rounded-xl">
        <TableNextUI
          selectionMode={"mutiple"}
          selectedKeys={listSelected}
          onSelectedChange={setListSelected}
          columns={columns}
          renderCell={renderCell}
          data={listUser}
          isLoading={isLoading}
          total={counts}
          page={pageIndex}
          pageSize={pageSize}
          onPageChange={(e) => {
            handlePageChange(e);
          }}
          onPageSizeChange={(e) => {
            handlePageChange(pageIndex, e);
          }}
        />
      </div>
      <ModalUser
        isOpen={isOpenModalUser}
        onClose={() => {
          setUserDate({});
          setIsOpenModalUser(false);
        }}
        onComplete={handleonComplete}
        isAdd={isAdd}
        userDate={userData}
      />
      <ModalDeleteMutiOrOne
        isOpen={isOpenModalDelete}
        onClose={() => {
          setListIdSelected([]);
          setRowSelection({});
          setIsOpenModalDelete(false);
        }}
        onComplete={handleOnDelete}
        ids={listIdSelected?.join("-")}
        headerMsg={`Xác nhận`}
        funcDelete={deleteUsers}
        bodyMsg={
          listIdSelected?.length !== 1
            ? "Bạn có chắc chắn muốn xóa các người dùng đã chọn?"
            : "Bạn có chắc chắn muốn xóa người dùng này?"
        }
      />
    </>
  );
}

export default UserManager;

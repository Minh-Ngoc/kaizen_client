import { Button, Input, Tooltip } from "@nextui-org/react";
import { departmentAction } from "_redux/slice/departmentSlice";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import { BiPlug, BiTrash } from "react-icons/bi";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { LiaEditSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import TableNextUI from "app/components/TableNextUI";
import ModalDepartment from "./components/ModalDepartment";
import ModalDeleteMutiOrOne from "../../components/Modal/ModalDelete";
import { deletesDepartment } from "services/api.service";
import ModalDetailDepartment from "./components/ModalDepartmentDetail";
function DepartmentManager() {
  const dispatch = useDispatch();
  const counts = useSelector((state) => state.department.counts);
  const listDepartmentPaging = useSelector(
    (state) => state.department.listDepartmentPaging
  );
  const isLoading = useSelector((state) => state.department.isLoadingpaging);
  const [searchValue, setSearchValue] = useState("");
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDepartment, setIsOpenModalDepartment] = useState(false);
  const [departmentData, setDepartmentData] = useState({});
  const [isAdd, setIsAdd] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(new Set(["10"]));
  const [listIdSelected, setListIdSelected] = useState(new Set([]));
  const [listId, setListId] = useState([]);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  useEffect(() => {
    if (typeof listIdSelected === "string") {
      setListId(
        listDepartmentPaging?.map((department) => department._id)?.join("-")
      );
    } else {
      const myIdArr = [...listIdSelected];
      setListId(myIdArr?.join("-"));
    }
  }, [listIdSelected]);
  useEffect(() => {
    dispatch(departmentAction.getAllPagingDepartment({}));
  }, []);
  const columns = [
    { name: "Tên phòng ban", _id: "name" },
    { name: "Phòng ban cha", _id: "parent" },
    { name: "Ngày tạo", _id: "createdAt" },
    { name: "Hành động", _id: "actions" },
  ];
  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <p className="text-[13px] text-white">
            {`${item?.name}` ?? "(Trống)"}
          </p>
        );
      case "parent":
        return (
          <p className="text-[13px] text-white">
            {item?.parent ? `${item?.parent?.name}` : "(Trống)"}
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
                onClick={() => {
                  setIsOpenModalDetail(!isOpenModalDetail);
                  setDepartmentData(item);
                }}
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
                  setIsOpenModalDepartment(true);
                  setIsAdd(false);
                  setDepartmentData(item);
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
  const handleSearh = () => {
    setPageIndex(1);
    dispatch(
      departmentAction.getAllPagingDepartment({
        pageIndex: 1,
        pageSize: String([...pageSize][0]),
        searchValue,
      })
    );
  };
  const handlePageChange = (nextPage, nextPageSize) => {
    nextPageSize && setPageSize(nextPageSize);
    setPageIndex(nextPage);
    dispatch(
      departmentAction.getAllPagingDepartment({
        pageIndex: nextPage,
        pageSize: nextPageSize
          ? String([...nextPageSize][0])
          : String([...pageSize][0]),
        searchValue,
      })
    );
  };
  const handleonComplete = () => {
    dispatch(
      departmentAction.getAllPagingDepartment({
        pageIndex,
        pageSize: String([...pageSize][0]),
        searchValue,
      })
    );
  };
  const handleOnDelete = () => {
    let tempPageIndex = pageIndex;
    const checkPage = (counts - listIdSelected?.length) / pageSize;
    if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
    if (tempPageIndex <= 0) tempPageIndex = 1;
    dispatch(
      departmentAction.getAllPagingDepartment({
        pageIndex: tempPageIndex,
        pageSize: String([...pageSize][0]),
        searchValue,
      })
    );
    setListIdSelected([]);
    setPageIndex(tempPageIndex);
  };
  return (
    <>
      <div className="mt-24 flex flex-col">
        <div className="mb-4 rounded-sm flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper bg-table">
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
                  setIsOpenModalDepartment(true);
                  setIsAdd(true);
                  setDepartmentData({});
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
                isDisabled={listId?.length === 0}
              >
                Xóa
              </Button>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <Input
                value={searchValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearh();
                }}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập tên phòng ban..."
              />

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
          selectionMode={"multiple"}
          selectedKeys={listIdSelected}
          onSelectedChange={setListIdSelected}
          columns={columns}
          renderCell={renderCell}
          data={listDepartmentPaging}
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
      <ModalDepartment
        isOpen={isOpenModalDepartment}
        onClose={() => {
          setIsOpenModalDepartment(false);
        }}
        onComplete={handleonComplete}
        isAdd={isAdd}
        departmentData={departmentData}
      />
      <ModalDeleteMutiOrOne
        isOpen={isOpenModalDelete}
        onClose={() => {
          setListIdSelected([]);
          setIsOpenModalDelete(false);
        }}
        onComplete={handleOnDelete}
        ids={listId}
        headerMsg={`Xác nhận`}
        funcDelete={deletesDepartment}
        bodyMsg={
          listIdSelected?.length !== 1
            ? "Bạn có chắc chắn muốn xóa các phòng ban đã chọn?"
            : "Bạn có chắc chắn muốn xóa phòng ban này?"
        }
      />
      <ModalDetailDepartment
        isOpen={isOpenModalDetail}
        onClose={() => {
          setIsOpenModalDetail(!isOpenModalDetail);
        }}
        departmentData={departmentData}
      />
    </>
  );
}
export default DepartmentManager;

import { IoSearchSharp } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { domainAction } from "_redux/slice/domainSlice";
import { BiPlug, BiTrash } from "react-icons/bi";
import TableNextUI from "app/components/TableNextUI";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { FaRegEye, FaRegTrashCan } from "react-icons/fa6";
import { LiaEditSolid } from "react-icons/lia";
import moment from "moment/moment";
import ModalDeleteMutiOrOne from "../../components/Modal/ModalDelete";
import { deletesDomain } from "../../../services/api.service";
import ModalAddKpiBonus from "./components/modalAddKpiBonus";
import ModalDomain from "./components/modalDomain";
import { PiNotePencilBold } from "react-icons/pi";
import ModalDetailDomain from "./components/modaDetailDomain";
function Domain() {
  const dispatch = useDispatch();
  const counts = useSelector((state) => state.domain.counts);
  const listDomain = useSelector((state) => state.domain.listDomain);
  const isLoading = useSelector((state) => state.domain.isLoading);
  const [search, setSearch] = useState("");
  const [isOpenModalDomain, setIsOpenModalDomain] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDetailKpiBonus, setIsOpenModalDetailKpiBonus] =
    useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [domainData, setDomainData] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(new Set(["10"]));
  const [listIdSelected, setListIdSelected] = useState(new Set([]));
  const [listId, setListId] = useState([]);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  useEffect(() => {
    if (typeof listIdSelected === "string") {
      setListId(listDomain?.map((user) => user._id)?.join("-"));
    } else {
      const myIdArr = [...listIdSelected];
      setListId(myIdArr?.join("-"));
    }
  }, [listIdSelected]);
  useEffect(() => {
    dispatch(domainAction.getAllPagingDomain({}));
  }, []);

  const handlePageChange = (nextPage, nextPageSize) => {
    nextPageSize && setPageSize(nextPageSize);
    setPageIndex(nextPage);
    dispatch(
      domainAction.getAllPagingDomain({
        pageIndex: nextPage,
        pageSize: nextPageSize
          ? String([...nextPageSize][0])
          : String([...pageSize][0]),
        search,
      })
    );
  };
  const handleSearh = () => {
    setPageIndex(1);
    dispatch(
      domainAction.getAllPagingDomain({
        pageIndex: 1,
        pageSize: String([...pageSize][0]),
        search,
      })
    );
  };
  const handleonComplete = () => {
    dispatch(
      domainAction.getAllPagingDomain({
        pageIndex,
        pageSize: String([...pageSize][0]),
        search,
      })
    );
  };
  const handleOnDelete = () => {
    let tempPageIndex = pageIndex;
    const checkPage = (counts - listId?.length) / pageSize;
    if (checkPage <= tempPageIndex - 1) tempPageIndex -= 1;
    if (tempPageIndex <= 0) tempPageIndex = 1;
    dispatch(
      domainAction.getAllPagingDomain({
        pageIndex: tempPageIndex,
        pageSize: String([...pageSize][0]),
        search,
      })
    );
    setListIdSelected([]);
    setPageIndex(tempPageIndex);
  };
  const columns = [
    { name: "Tên domain", _id: "domainName" },
    { name: "Team", _id: "team" },
    { name: "Brand", _id: "brand" },
    { name: "Người Quản lý", _id: "userManager" },
    { name: "Người hổ trợ", _id: "userSupport" },
    { name: "Ngày tạo", _id: "createdAt" },
    { name: "Hành động", _id: "actions" },
  ];
  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "team":
        return (
          <p className="text-[13px] text-white">
            {`${item?.team?.name}` ?? "(Trống)"}
          </p>
        );
      case "brand":
        return (
          <p className="text-[13px] text-white">
            {`${item?.brand?.name}` ?? "(Trống)"}
          </p>
        );
      case "userManager":
        return (
          <p className="text-[13px] text-white">
            {item?.userManager?.firstName || item?.userManager?.lastName
              ? `${item?.userManager?.firstName || ""} ${
                  item?.userManager?.lastName || ""
                }`
              : item?.userManager?.name
              ? `${item?.userManager?.name}`
              : "(Trống)"}
          </p>
        );
      case "userSupport":
        return (
          <p className="text-[13px] text-white">
            {item?.userManager?.firstName || item?.userManager?.lastName
              ? `${item?.userManager?.firstName || ""} ${
                  item?.userManager?.lastName || ""
                }`
              : item?.userManager?.name
              ? `${item?.userManager?.name}`
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
                onClick={() => {
                  setIsOpenModalDetail(!isOpenModalDetail);
                  setDomainData(item);
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
                  setIsOpenModalDomain(true);
                  setIsAdd(false);
                  setDomainData(item);
                }}
              >
                <LiaEditSolid className="min-w-max text-base w-4 h-4 text-white" />
              </Button>
            </Tooltip>

            <Tooltip
              color={"warning"}
              content={"Chỉnh sửa Kpi"}
              className="capitalize"
              disableAnimation={true}
            >
              <Button
                variant="solid"
                radius="full"
                color="warning"
                className="min-w-0 w-8 p-1 h-auto"
                onClick={() => {
                  setIsOpenModalDetailKpiBonus(true);
                  setDomainData(item);
                }}
              >
                <PiNotePencilBold className="min-w-max text-base w-4 h-4 text-white" />
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
  return (
    <>
      <div className="mt-24 flex flex-col">
        <div className="mb-4 rounded-lg flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper bg-table">
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
                  setIsOpenModalDomain(true);
                  setIsAdd(true);
                  setDomainData({});
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
                value={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearh();
                }}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập tên domain..."
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "rounded-md py-2 data-[hover=true]:border-primary-400 group-data-[focus=true]:border-primary-400 group-data-[focus=true]:border-2 group-data-[focus=true]:border-primary-400",
                  label: "hidden",
                  input: "text-sm text-task-title placeholder:text-default-300/70 tracking-wide",
                }}
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
          data={listDomain}
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
      <ModalDomain
        domainData={domainData}
        isAdd={isAdd}
        onClose={() => {
          setDomainData({});
          setIsOpenModalDomain(!isOpenModalDomain);
        }}
        onComplete={handleonComplete}
        isOpen={isOpenModalDomain}
      />
      <ModalAddKpiBonus
        domainData={domainData}
        onClose={() => {
          setDomainData({});
          setIsOpenModalDetailKpiBonus(!isOpenModalDetailKpiBonus);
        }}
        onComplete={handleonComplete}
        isOpen={isOpenModalDetailKpiBonus}
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
        funcDelete={deletesDomain}
        bodyMsg={
          listIdSelected?.length !== 1
            ? "Bạn có chắc chắn muốn xóa các domain đã chọn?"
            : "Bạn có chắc chắn muốn xóa domain này?"
        }
      />
      <ModalDetailDomain
        domainData={domainData}
        isOpen={isOpenModalDetail}
        onClose={() => {
          setIsOpenModalDetail(!isOpenModalDetail);
        }}
      />
    </>
  );
}
export default Domain;

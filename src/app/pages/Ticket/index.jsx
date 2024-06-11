import { useState, useEffect, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { yourticketAction } from "_redux/slice/yourTicketSlice";
import moment from "moment";
import { Button, Chip, Select, SelectItem } from "@nextui-org/react";
import TableNextUI from "app/components/TableNextUI";
import {
  getPriorityText,
  getProjectTicketText,
  getResponseStatusText,
  listPriority,
  listProjectTicket,
  listResponseStatus,
} from "_utils";
import { Tooltip } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import ModalTicket from "./components/modalTicket";
import DateRangerPicker from "app/components/DateRangerPicker";
import ModalDetailTicket from "./components/modalDetailTicket";
function dateToUtcTime(date) {
  if (!date) return "";
  const userTimeZoneOffset = date?.getTimezoneOffset();
  const utcOffsetInHours = -userTimeZoneOffset / 60;
  const utcTime = new Date(date.getTime() + utcOffsetInHours * 60 * 60 * 1000);
  return utcTime;
}
export default function Ticket() {
  const dispatch = useDispatch();
  const counts = useSelector((state) => state.yourTicket.counts);
  const listTicket = useSelector((state) => state.yourTicket.listTicket);
  const isLoading = useSelector((state) => state.yourTicket.isLoading);
  const [priority, setPriority] = useState("all");
  const [project, setProject] = useState("all");
  const [responseStatus, setResponseStatus] = useState("all");
  const [isOpenModalTicket, setIsOpenModalTicket] = useState(false);
  const [isOpenModalDetailTicket, setIsOpenModalDetailTicket] = useState(false);
  const [ticket, setTicket] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    dispatch(yourticketAction.getAllYourTicketPaging({}));
  }, []);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(new Set(["10"]));
  const [listIdSelected, setListIdSelected] = useState(new Set([]));
  const [listId, setListId] = useState([]);
  useEffect(() => {
    if (typeof listIdSelected === "string") {
      setListId(listTicket?.map((department) => department._id)?.join("-"));
    } else {
      const myIdArr = [...listIdSelected];
      setListId(myIdArr?.join("-"));
    }
  }, [listIdSelected]);
  const columns = [
    { name: "Tiêu đề", _id: "title" },
    { name: "Độ ưu tiên", _id: "priority" },
    { name: "Dự án", _id: "project" },
    { name: "Trạng thái", _id: "responseStatus" },
    { name: "Ngày tạo", _id: "createdAt" },
    { name: "Hành động", _id: "actions" },
  ];

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "title":
        return <p className="text-sm text-white">{cellValue}</p>;

      case "priority":
        return (
          <Chip radius="sm" color={getPriorityText[cellValue]?.color}>
            {getPriorityText[cellValue]?.text}
          </Chip>
        );

      case "project":
        return (
          <Chip radius="sm" color={getProjectTicketText[cellValue]?.color}>
            {getProjectTicketText[cellValue]?.text}
          </Chip>
        );

      case "responseStatus":
        return (
          <Chip radius="sm" color={getResponseStatusText[cellValue]?.color}>
            {getResponseStatusText[cellValue]?.text}
          </Chip>
        );

      case "createdAt":
        return (
          <p className="text-sm text-white">
            {moment(cellValue).format("DD/MM/yyyy")}
          </p>
        );

      case "actions":
        return (
          <div className="flex flex-row items-center">
            <Button
              variant="solid"
              radius="full"
              color="warning"
              className="min-w-0 w-8 p-1 h-auto"
              onClick={() => {
                setTicket(item);
                setIsOpenModalDetailTicket(true);
              }}
            >
              <Tooltip
                color={"primary"}
                content={"Xem chi tiết"}
                className="capitalize"
                disableAnimation={true}
              >
                <p>
                  <FaRegEye className="min-w-max text-base w-4 h-4 text-white" />
                </p>
              </Tooltip>
            </Button>
          </div>
        );
    }
  }, []);

  const handlePageChange = (nextPage, nextPageSize) => {
    nextPageSize && setPageSize(nextPageSize);
    setPageIndex(nextPage);
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: nextPage,
        pageSize: nextPageSize
          ? String([...nextPageSize][0])
          : String([...pageSize][0]),
        priority,
        project,
        responseStatus,
        startDate: dateToUtcTime(startDate),
        endDate: dateToUtcTime(endDate),
      })
    );
  };
  const handleonComplete = () => {
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: pageIndex,
        pageSize: String([...pageSize][0]),
        priority,
        project,
        responseStatus,
        startDate: dateToUtcTime(startDate),
        endDate: dateToUtcTime(endDate),
      })
    );
  };
  const handleSearh = () => {
    setPageIndex(1);
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: 1,
        pageSize: String([...pageSize][0]),
        priority,
        project,
        responseStatus,
        startDate: dateToUtcTime(startDate),
        endDate: dateToUtcTime(endDate),
      })
    );
  };
  const popoverProps = {
    classNames: {
      content: "rounded-md",
    },
    // disableAnimation: true,
    motionProps: {
      variants: {
        enter: {
          y: 0,
          opacity: 1,
          duration: 0.1,
          transition: {
            opacity: {
              duration: 0.15,
            },
          },
        },
        exit: {
          y: "10%",
          opacity: 0,
          duration: 0,
          transition: {
            opacity: {
              duration: 0.1,
            },
          },
        },
      },
    },
  };
  return (
    <>
      <div className="mt-24 flex flex-col z-50">
        <div className="mb-4 rounded-sm flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper z-50">
          <div className="p-6 rounded-lg flex flex-row flex-wrap justify-between items-center gap-2 w-full z-50">
            <div className="max-w-[220px] flex items-center gap-2 z-50">
              <Button
                variant="solid"
                color={"primary"}
                className="rounded-md min-w-32 text-white font-bold text-xs"
                startContent={
                  <BiPlus className="text-white min-w-max min-h-max" />
                }
                onClick={() => {
                  setIsOpenModalTicket(true);
                }}
              >
                Tạo ticket
              </Button>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 z-50">
              <DateRangerPicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={(day) => {
                  setStartDate(day);
                }}
                setEndDate={(day) => {
                  setEndDate(day);
                }}
              />
              <Select
                variant={"bordered"}
                placeholder={"Độ ưu tiên"}
                radius="sm"
                classNames={{
                  base: "max-w-44 min-w-44",
                  value: "text-white",
                  trigger:
                    "text-white data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
                }}
                selectionMode={"single"}
                popoverProps={popoverProps}
                disableAnimation
                onChange={(e) => setPriority(e.target.value)}
              >
                {listPriority?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant={"bordered"}
                placeholder={"Dự án"}
                radius="sm"
                classNames={{
                  base: "max-w-44 min-w-44",
                  value: "text-white",
                  trigger:
                    "text-white data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
                }}
                selectionMode={"single"}
                popoverProps={popoverProps}
                disableAnimation
                onChange={(e) => setProject(e.target.value)}
              >
                {listProjectTicket?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              <Select
                variant={"bordered"}
                placeholder={"Trạng thái"}
                radius="sm"
                classNames={{
                  base: "max-w-44 min-w-44",
                  value: "text-white",
                  trigger:
                    "text-white data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
                }}
                selectionMode={"single"}
                popoverProps={popoverProps}
                disableAnimation
                onChange={(e) => setResponseStatus(e.target.value)}
              >
                {listResponseStatus?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
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
      <div className="bg-card-project shadow-wrapper p-5 pb-10 rounded-xl z-10">
        <TableNextUI
          onSelectedChange={setListIdSelected}
          columns={columns}
          renderCell={renderCell}
          data={listTicket}
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

      <ModalTicket
        isOpen={isOpenModalTicket}
        onClose={() => {
          setIsOpenModalTicket(!isOpenModalTicket);
        }}
        onComplete={handleonComplete}
      />
      <ModalDetailTicket
        isOpen={isOpenModalDetailTicket}
        onClose={() => {
          setIsOpenModalDetailTicket(!isOpenModalDetailTicket);
        }}
        ticket={ticket}
      />
    </>
  );
}

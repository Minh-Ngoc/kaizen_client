import { useState, useEffect, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { yourticketAction } from "_redux/slice/yourTicketSlice";
import moment from "moment";
import {
  Button,
  Chip,
  DateRangePicker,
  Select,
  SelectItem,
} from "@nextui-org/react";
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
// import DateRangerPicker from "app/components/DateRangerPicker";
import ModalDetailTicket from "./components/modalDetailTicket";
import { IoIosClose } from "react-icons/io";

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
  const [time, setTime] = useState(null);

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

    const startDate = moment(time?.start?.toDate())
      ?.endOf("day")
      ?.toISOString();

    const endDate = moment(time?.end?.toDate())?.endOf("day")?.toISOString();

    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: nextPage,
        pageSize: nextPageSize
          ? String([...nextPageSize][0])
          : String([...pageSize][0]),
        priority,
        project,
        responseStatus,
        startDate,
        endDate,
      })
    );
  };

  const handleonComplete = () => {
    let startDate = null;
    let endDate = null;

    if (time) {
      startDate = moment(time?.start?.toDate())?.endOf("day")?.toISOString();

      endDate = moment(time?.end?.toDate())?.endOf("day")?.toISOString();
    }

    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: pageIndex,
        pageSize: String([...pageSize][0]),
        priority,
        project,
        responseStatus,
        startDate,
        endDate,
      })
    );
  };
  const handleSearh = useCallback(() => {
    let startDate = null;
    let endDate = null;

    if (time) {
      startDate = moment(time?.start?.toDate())?.endOf("day")?.toISOString();

      endDate = moment(time?.end?.toDate())?.endOf("day")?.toISOString();
    }

    setPageIndex(1);
    dispatch(
      yourticketAction.getAllYourTicketPaging({
        pageIndex: 1,
        pageSize: String([...pageSize][0]),
        priority,
        project,
        responseStatus,
        startDate,
        endDate,
      })
    );
  }, [dispatch, pageSize, priority, project, responseStatus, time]);
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

  const handleRemoveDate = () => {
    setTime(null);
  };

  return (
    <>
      <div className="mt-24 flex flex-col">
        <div className="mb-4 flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper bg-table rounded-lg">
          <div className="p-6 rounded-lg flex flex-row flex-wrap justify-between items-center gap-2 w-full">
            <div className="max-w-[220px] flex items-center gap-2">
              <Button
                variant="solid"
                color={"success"}
                className="rounded-md min-w-32 text-white font-bold text-sm"
                startContent={
                  <BiPlus className="text-white min-w-max min-h-max text-lg" />
                }
                onClick={() => {
                  setIsOpenModalTicket(true);
                }}
              >
                Tạo ticket
              </Button>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <DateRangePicker
                popoverProps={{
                  className: "min-w-[300px] w-[300px]",
                }}
                calendarProps={{
                  className: "!w-full !max-w-full",
                  content: "!w-full !max-w-full",
                }}
                id="nextui-date-range-picker"
                radius="sm"
                variant={"bordered"}
                placeholder="Thời gian thực hiện"
                className="max-w-xs"
                disableAnimation
                startContent={
                  time && (
                    <Button
                      className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-tiny rounded-full px-0 !gap-0 !transition-none bg-transparent data-[hover=true]:bg-default/40 min-w-8 w-8 h-8 -mr-2 text-inherit"
                      variant="solid"
                      color="danger"
                      onPress={handleRemoveDate}
                    >
                      <IoIosClose className="text-xl min-w-max" />
                    </Button>
                  )
                }
                value={time}
                onChange={setTime}
              />
              {/* 
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
              */}
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
                  <IoSearchSharp className="text-white min-w-max min-h-max text-lg" />
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
            handlePageChange(1, e);
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

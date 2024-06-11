import { useState, useEffect, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logAction } from "_redux/slice/logSlice";
import { userAction } from "_redux/slice/user.slice";
import TableNextUI from "app/components/TableNextUI";
import { Button, DateRangePicker, Select, SelectItem } from "@nextui-org/react";
import { IoIosClose } from "react-icons/io";

export default function ManagerLog() {
  const dispatch = useDispatch();
  const [time, setTime] = useState(null);
  const counts = useSelector((state) => state.log.counts);
  const listLog = useSelector((state) => state.log.listLog);
  const isLoading = useSelector((state) => state.log.isLoadingpaging);
  const listUser = useSelector((state) => state.user.listUserGetAll);
  const [userSelected, setUserSelected] = useState("all");
  useEffect(() => {
    dispatch(logAction.getAllPagingLog({}));
    dispatch(userAction.GetAllUser());
  }, []);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(new Set(["10"]));

  const columns = [
    { name: "Tên hành động", _id: "actionName" },
    { name: "Người dùng", _id: "fullName" },
    { name: "Địa chỉ IP", _id: "ip" },
    { name: "Ngày tạo", _id: "createdAt" },
  ];
  const handleRemoveDate = () => {
    setTime(null);
  };
  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "actionName":
        return <p className="text-sm text-white">{cellValue}</p>;

      case "fullName":
        return (
          <p className="text-[13px] text-white">
            {item?.user?.firstName || item?.user?.lastName
              ? `${item?.user?.firstName || ""} ${item?.user?.lastName || ""}`
              : item?.user?.name
              ? `${item?.user?.name}`
              : "(Trống)"}
          </p>
        );

      case "ip":
        return <p className="text-sm text-white">{cellValue}</p>;

      case "createdAt":
        return (
          <p className="text-sm text-white">
            {moment(cellValue).format("DD/MM/yyyy")}
          </p>
        );
    }
  }, []);
  const handlePageChange = (nextPage, nextPageSize) => {
    let start = null;
    let end = null;

    if (time) {
      start = moment(time?.start?.toDate())?.startOf("day")?.toISOString();
      end = moment(time?.end?.toDate())?.endOf("day")?.toISOString();
    }
    nextPageSize && setPageSize(nextPageSize);
    setPageIndex(nextPage);
    dispatch(
      logAction.getAllPagingLog({
        pageIndex: nextPage,
        pageSize: nextPageSize
          ? String([...nextPageSize][0])
          : String([...pageSize][0]),
        userId: userSelected,
        startDate: start,
        endDate: end,
      })
    );
  };
  const handleSearh = () => {
    let start = null;
    let end = null;

    if (time) {
      start = moment(time?.start?.toDate())?.endOf("day")?.toISOString();
      end = moment(time?.end?.toDate())?.endOf("day")?.toISOString();
    }

    setPageIndex(1);
    dispatch(
      logAction.getAllPagingLog({
        pageIndex: 1,
        pageSize: String([...pageSize][0]),
        userId: userSelected,
        startDate: start,
        endDate: end,
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
      <div className="mt-24 flex flex-col">
        <div className="mb-4 rounded-lg flex flex-col justify-center items-center overflow-y-hidden shadow-wrapper bg-table">
          <div className="p-6 rounded-lg flex flex-row flex-wrap justify-between items-center gap-2 w-full">
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
              <div className="min-w-44">
                <Select
                  variant={"bordered"}
                  placeholder={"Dự án"}
                  radius="sm"
                  classNames={{
                    base: "max-w-44",
                    value: "text-white",
                    trigger:
                      "text-white data-[open=true]:border-primary data-[hover=true]:border-primary data-[focus=true]:border-primary",
                  }}
                  selectionMode={"single"}
                  popoverProps={popoverProps}
                  disableAnimation
                  items={[
                    { _id: "all", name: "Tất cả người dùng" },
                    ...listUser,
                  ]?.map((user) => ({
                    value: user?._id,
                    label:
                      user?.firstName || user?.lastName
                        ? `${user?.firstName || ""} ${user?.lastName || ""}`
                        : user?.name
                        ? `${user?.name}`
                        : "",
                  }))}
                  selectedKeys={[userSelected]}
                  onSelectionChange={(value) => {
                    const arrVal = [...value];
                    setUserSelected(arrVal[0] ?? "all");
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
                className="rounded-md min-w-32 text-white font-bold text-sm mr-5"
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
          columns={columns}
          renderCell={renderCell}
          data={listLog}
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
    </>
  );
}

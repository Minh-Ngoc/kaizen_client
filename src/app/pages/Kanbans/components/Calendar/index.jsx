import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { GetAllTaskByProjectId } from "_redux/slice/taskSlice";
import { useParams } from "react-router-dom";
import "./calendar.css";
import { updateTaskDates } from "_redux/slice/taskSlice";
import { parseDate } from "@internationalized/date";
import moment from "moment";
import NotifyMessage from "_utils/notify";
import { UpdateTask } from "_redux/slice/taskSlice";
import { setModal } from "_redux/slice/modalSlice";
import Header from "../TaskDetail/components/Header";
import TaskDetail from "../TaskDetail";

function Calendar() {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);

  const handleClickTask = ({ event }) => {
    dispatch(
      setModal({
        isOpen: true,
        title: <p className="text-black">Tạo dự án mới</p>,
        isDismissable: true,
        openConfirm: false,
        openCancel: false,
        bg: "bg-white",
        hideCloseButton: true,
        backdrop: "transparent",
        classNames: {
          // backdrop: "z-[51]",
          wrapper: "w-full overflow-hidden !justify-end",
          base: `max-h-[100vh] !shadow-card-project min-w-[40%] h-full !my-0 !mr-0 rounded-none border-l-1 border-default-300`,
          header: "justify-end border-b-1 border-default-200",
          body: "overflow-y-auto rounded-tr-none !rounded-none p-0",
          closeButton: "right-5 z-10 text-lg",
        },
        header: <Header task={event?.extendedProps} />,
        body: <TaskDetail task={event?.extendedProps} />,
        motionProps: {
          initial: { x: "100%" },
          animate: { x: "0%" },
          exit: { x: "100%" },
          transition: { duration: 0.5 },
        },
      })
    );
  };

  const tasksValidate = useMemo(() => {
    const result = tasks?.map((task) => {
      const { dateStart, dateEnd, ...otherEventProps } = task;
      return {
        start: dateStart,
        end: dateEnd,
        ...otherEventProps,
      };
    });
    return result;
  }, [tasks]);

  const renderEventContent = ({ event }) => {
    return <p className="!bg-transparent">{event?.extendedProps?.name}</p>;
  };

  useEffect(() => {
    dispatch(GetAllTaskByProjectId(projectId));
  }, []);

  return (
    <>
      <div className="w-full min-h-[80vh] overflow-auto grid grid-cols-1 text-white p-3 bg-table mb-4 mt-5 shadow-card-project rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={tasksValidate}
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          lazyFetching={true}
          editable={true}
          slotWidth={10}
          customIcons={false}
          eventClick={handleClickTask}
          eventContent={renderEventContent}
          locale="vi"
          eventChange={({ event }) => {
            const taskId = event?._def?.extendedProps?._id;
            const { dateEnd, dateStart, project } = tasks.find(
              (t) => t?._id === taskId
            );
            const {
              start: startCalendar,
              end: endCalendar,
            } = event?._instance?.range;
            // console.log("startCalendar: ", startCalendar);
            // console.log("endCalendar: ", endCalendar);
            const dateStartProject = project?.dateStart;
            const dateEndProject = project?.dateEnd;
            setTimeout(() => {
              const startDateCalendar = new Date(startCalendar);
              startDateCalendar.setHours(startDateCalendar.getHours() - 7);
              const endDateCalenar = new Date(endCalendar);
              endDateCalenar.setHours(endDateCalenar.getHours() - 7);
              // console.log("startDateCalendar: ", startDateCalendar);
              // console.log("endDateCalenar: ", endDateCalenar);
              dispatch(
                updateTaskDates({
                  taskId,
                  dateStart: startDateCalendar,
                  dateEnd: endDateCalenar,
                })
              );
              const start = moment(
                parseDate(
                  moment(startDateCalendar).format("YYYY-MM-DD")
                )?.toDate()
              )?.startOf("day");
              const end = moment(
                parseDate(moment(endDateCalenar).format("YYYY-MM-DD"))?.toDate()
              )?.endOf("day");
              if (start.isBefore(moment(dateStartProject))) {
                dispatch(
                  updateTaskDates({
                    taskId,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                  })
                );
                return NotifyMessage(
                  `Thời gian bắt đầu công việc không thể sớm hơn thời gian bắt đầu dự án (${moment(
                    dateStartProject
                  ).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
                  "warning"
                );
              }
              if (end.isAfter(moment(dateEndProject))) {
                dispatch(
                  updateTaskDates({
                    taskId,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                  })
                );
                return NotifyMessage(
                  `Thời gian hoàn thành công việc không thể trễ hơn thời gian hoàn thành dự án (${moment(
                    dateEndProject
                  ).format("DD/MM/YYYY")}). Vui lòng thử lại!`,
                  "warning"
                );
              }
              // console.log("start?.toISOString(): ", start?.toISOString());
              // console.log("end?.toISOString(): ", end?.toISOString());
              dispatch(
                UpdateTask({
                  id: taskId,
                  body: {
                    dateStart: start?.toISOString(),
                    dateEnd: end?.toISOString(),
                  },
                })
              );
            }, 100);
          }}
        />
      </div>
    </>
  );
}

export default Calendar;

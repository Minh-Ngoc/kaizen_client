import { useState, useRef, useEffect, useCallback } from "react";
import {
  MdCalendarMonth,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import PropTypes from "prop-types";

export const handleRippleEffect = (event) => {
  const rippleContainer = event.currentTarget;
  const rect = rippleContainer.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  const rippleEffect = document.createElement("span");
  rippleEffect.classList.add("ripple-effect");

  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  rippleEffect.style.width = `${size}px`;
  rippleEffect.style.height = `${size}px`;
  rippleEffect.style.left = `${x}px`;
  rippleEffect.style.top = `${y}px`;

  rippleContainer.appendChild(rippleEffect);
  rippleEffect.addEventListener("animationend", () => {
    rippleEffect.remove();
  });
};

function MonthPicker({
  date,
  setDate,
  isHaveHour = true,
  isBottom = false,
  isDisable = false,
}) {
  const [virtualMonth, setVirtualMonth] = useState(0);
  const [virtualYear, setVirtualYear] = useState(0);
  const [virtualDate, setVirtualDate] = useState(date);
  const [virtualMinute, setVirtualMinute] = useState(0);
  const [virtualHour, setVirtualHour] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState("down");
  const [availableSpace, setAvailableSpace] = useState({ above: 0, below: 0 });
  const parentRef = useRef(null);
  const contentRef = useRef(null);
  const [arrDate, setArrDate] = useState([]);
  const [selectedTime, setSelectedTime] = useState("month");
  useEffect(() => {
    const newDate = new Date(virtualYear, virtualMonth - 1, 1);
    setVirtualDate(newDate);
    setArrDate(getArrDate(newDate));
  }, [virtualYear, virtualMonth]);
  useEffect(() => {
    if (!date) {
      const month = new Date()?.getMonth() + 1;
      const year = new Date()?.getFullYear();
      const minute = new Date()?.getMinutes();
      const hour = new Date()?.getHours();
      setVirtualMonth(month);
      setVirtualYear(year);
      setVirtualMinute(minute);
      setVirtualHour(hour);
    } else {
      setVirtualDate(date);
      const month = date?.getMonth() + 1;
      const year = date?.getFullYear();
      const minute = date?.getMinutes();
      const hour = date?.getHours();
      setVirtualMonth(month);
      setVirtualYear(year);
      setVirtualMinute(minute);
      setVirtualHour(hour);
    }
  }, [date, isActive]);
  const increaseMonth = () => {
    setVirtualMonth((prevMonth) => {
      let newYear = virtualYear;
      let newMonth = prevMonth + 1;

      if (newMonth === 13) {
        newMonth = 1;
        newYear++;
      }
      setVirtualYear(newYear);
      const newDate = new Date(newYear, newMonth - 1, 1);
      setVirtualDate(newDate);
      setArrDate(getArrDate(newDate));
      return newMonth;
    });
  };

  const decreaseMonth = () => {
    setVirtualMonth((prevMonth) => {
      let newYear = virtualYear;
      let newMonth = prevMonth - 1;

      if (newMonth === 0) {
        newMonth = 12;
        newYear--;
      }
      setVirtualYear(newYear);
      const newDate = new Date(newYear, newMonth - 1, 1);
      setVirtualDate(newDate);
      setArrDate(getArrDate(newDate));
      return newMonth;
    });
  };

  const getArrDate = (presentDay) => {
    let date = presentDay ?? new Date();
    let arr = [];
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let dateDiff = firstDayOfMonth.getDay();
    for (let i = 0; i < dateDiff; i++) {
      let preDay = new Date(firstDayOfMonth);
      preDay.setDate(firstDayOfMonth.getDate() - 1);
      arr.unshift(preDay);
      firstDayOfMonth = preDay;
    }
    firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    arr.push(firstDayOfMonth);
    for (let i = 0; i < 7 * 5 + (7 - (dateDiff + 1)); i++) {
      let preDay;
      if (i == 0) {
        preDay = new Date(firstDayOfMonth);
        preDay.setDate(firstDayOfMonth.getDate() + 1);
      } else preDay = new Date(firstDayOfMonth);
      preDay.setDate(firstDayOfMonth.getDate() + 1);
      arr.push(preDay);
      firstDayOfMonth = preDay;
    }
    return arr;
  };

  const GetDayNumber = (date) => {
    return date.getDate();
  };

  const calculateSpace = () => {
    const rect = parentRef?.current?.getBoundingClientRect();

    const above = rect?.top;
    const below = window.innerHeight - rect.bottom;
    setAvailableSpace({ above, below });
  };

  useEffect(() => {
    setArrDate(getArrDate(date));
    window.addEventListener("resize", calculateSpace);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("resize", calculateSpace);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    if (parentRef.current && !parentRef.current.contains(event.target)) {
      setIsActive(false);
      setSelectedTime("month");
    }
  };

  function formatDateString(date) {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return isHaveHour
      ? `${hours}:${minutes} - ${day}/${month}/${year}`
      : `${month}/${year}`;
  }
  useEffect(() => {
    calculateSpace();
    if (
      availableSpace.below < 400 &&
      availableSpace.above > availableSpace.below
    ) {
      setPosition("up");
    } else {
      setPosition("down");
    }
  }, [isActive, selectedTime]);

  const renderArrDate = useCallback(() => {
    const firstDateOfMonth = new Date(
      virtualDate.getFullYear(),
      virtualDate.getMonth(),
      1
    );
    const lastDateOfMonth = new Date(
      virtualDate.getFullYear(),
      virtualDate.getMonth() + 1,
      0
    );
    const rows = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const _virtualDate = date ? new Date(date) : new Date();
    _virtualDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < 6; i++) {
      const startIndex = i * 7;
      const endIndex = startIndex + 7;

      const rowCells = arrDate.slice(startIndex, endIndex).map((day, index) => {
        const isInMonth = day >= firstDateOfMonth && day <= lastDateOfMonth;
        const dayWithoutTime = new Date(day);
        dayWithoutTime.setHours(0, 0, 0, 0);

        const isToday = today.getTime() === dayWithoutTime.getTime();
        const isCorrectDate =
          _virtualDate.getTime() === dayWithoutTime.getTime();
        return (
          <td
            onClick={(e) => {
              handleRippleEffect(e);
              const newDate = new Date(day);
              newDate.setHours(virtualHour, virtualMinute, 0);
              setVirtualYear(day.getFullYear());
              setVirtualMonth(day.getMonth() + 1);
              setDate(newDate);
              setIsActive(false);
            }}
            key={index}
            className={`${
              isCorrectDate
                ? "bg-[#35d1f5] text-white"
                : `${isInMonth ? "text-black" : "text-gray-300"} ${
                    isToday ? "border-[#35d1f5] border-1" : ""
                  }`
            } text-sm select-none transition-bg duration-150 bg-none p-1 hover:bg-[#35d1f5] hover:text-white  text-center  ripple-container`}
          >
            {GetDayNumber(day)}
          </td>
        );
      });

      rows.push(
        <tr key={i} className="w-full gap-1">
          {rowCells}
        </tr>
      );
    }

    return rows;
  }, [arrDate, date]);

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const startYear = 1900;
  const endYear = 2099;
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const selectedYearRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const hourContainerRef = useRef(null);
  const minuteContainerRef = useRef(null);

  useEffect(() => {
    if (selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    if (hourContainerRef.current && minuteContainerRef.current) {
      const positionHourChild = hourRef.current.getBoundingClientRect();
      const positionMinuteChild = minuteRef.current.getBoundingClientRect();
      const positionHourParent = hourContainerRef.current.getBoundingClientRect();
      const positionMinuteParent = minuteContainerRef.current.getBoundingClientRect();

      const scrollTopHour = positionHourChild.top - positionHourParent.top;
      const scrollTopMinute =
        positionMinuteChild.top - positionMinuteParent.top;
      hourContainerRef.current.scrollTo({
        top: scrollTopHour - hourRef.current.offsetHeight * 2,
        behavior: "smooth",
      });
      minuteContainerRef.current.scrollTo({
        top: scrollTopMinute - minuteRef.current.offsetHeight * 2,
        behavior: "smooth",
      });
    }
  }, [selectedTime]);

  const handleOpenRangerPicker = useCallback(() => {
    if (isActive) {
      return `absolute  ${selectedTime === "year" ? "h-[275px]" : "h-[270px]"}`;
    } else {
      return "h-[0px] absolute border-none";
    }
  }, [isActive, selectedTime]);

  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: 60 }, (_, index) => index);

  const handleHourClick = (hour) => {
    const _date = date ? new Date(date) : new Date();
    setVirtualHour(hour);
    _date.setHours(hour, virtualMinute, 0);
    setDate(_date);
  };

  const handleMinuteClick = (minute) => {
    const _date = date ? new Date(date) : new Date();
    setVirtualMinute(minute);
    _date.setMinutes(minute);
    setDate(_date);
  };

  const renderTimeItems = (timeArray, isHour, scrollRef) => {
    return (
      <div
        ref={isHour ? hourContainerRef : minuteContainerRef}
        className={`flex flex-col justify-start items-start w-full h-52 hide-sroll-bar py-1`}
      >
        {timeArray.map((time, index) => (
          <div
            onClick={() =>
              isHour ? handleHourClick(time) : handleMinuteClick(time)
            }
            key={index}
            ref={
              isHour
                ? virtualHour === time
                  ? scrollRef
                  : null
                : virtualMinute === time
                ? scrollRef
                : null
            }
            className={` ${
              isHour
                ? `${
                    virtualHour === time ? "bg-[#35d1f5]" : "hover:bg-gray-200"
                  }`
                : `${
                    virtualMinute === time
                      ? "bg-[#35d1f5]"
                      : "hover:bg-gray-200"
                  }`
            } w-full px-4 py-2 text-center rounded`}
          >
            {time < 10 ? `0${time}` : time}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div ref={parentRef} className="w-full relative cursor-pointer">
        <input
          disabled={isDisable}
          onClick={() => {
            if (isDisable) return;
            setIsActive(!isActive);
          }}
          id="custom-input-selected-date"
          value={formatDateString(date)}
          onChange={(e) => {
            e.preventDefault();
          }}
          placeholder="(Trống)"
          autocomplete="off"
          className={`text-sm py-2 px-2 border-1
                    border-[#d2d6da] w-full rounded-[0.5rem]  h-10
                    !text-[#495057]
                   select-none 
                     ${
                       !isDisable && "cursor-pointer"
                     } focus:border-[#d2d6da] focus:outline-none
                   
                 `}
          type="text"
        />
        <span
          onClick={() => {
            if (isDisable) return;
            setIsActive(!isActive);
          }}
          className={`absolute right-2 bottom-[50%] translate-y-[50%] cursor-pointer transition-[text] duration-1000 ease-in-out  ${
            isActive ? "text-[#008db9]" : "text-gray-600"
          }`}
        >
          <MdCalendarMonth />
        </span>
        <div
          ref={contentRef}
          className={` z-max select-none animation-date-ranger-picker  w-[335px] right-0 border border-gray-200 rounded bg-white  overflow-y-hidden overflow-x-hidden ${
            isBottom ? "top-full" : "bottom-full"
          }   my-1 ${handleOpenRangerPicker()}`}
        >
          <div
            className={`flex flex-row ${
              selectedTime === "day" ? "justify-between" : "justify-center"
            } items-center px-4 text-white bg-[#35d1f5] py-3`}
          >
            {selectedTime === "day" ? (
              <span
                className="bg-[#35d1f5]  transition-bg duration-400 ease-in-out hover:bg-[#35d1f5] rounded-full p-2 ripple-container"
                onClick={(e) => {
                  handleRippleEffect(e);
                  decreaseMonth();
                }}
              >
                <MdOutlineKeyboardArrowLeft />
              </span>
            ) : (
              ""
            )}
            <div className="flex flex-row  justify-center items-center cursor-pointer select-none gap-1">
              {selectedTime === "month" && (
                <p
                  onClick={() => {
                    setSelectedTime(
                      selectedTime === "month" ? "month" : "month"
                    );
                  }}
                  className={`text-base text-white hover:text-[#008db9] transition-all duration-500 ease-in-out  select-none`}
                >
                  Tháng {virtualMonth}
                </p>
              )}

              {selectedTime === "month" && (
                <p className="text-base text-white select-none"> / </p>
              )}
              {(selectedTime === "month" || selectedTime === "year") && (
                <p
                  onClick={() => {
                    setSelectedTime(selectedTime === "year" ? "month" : "year");
                  }}
                  className={`text-base ${
                    selectedTime === "year"
                      ? "text-[#008db9]"
                      : "text-white hover:text-[#008db9]"
                  } transition-all duration-500 ease-in-out  select-none`}
                >
                  {virtualYear}
                </p>
              )}
            </div>

            {selectedTime === "day" ? (
              <span
                className="bg-[#35d1f5]  transition-bg duration-400 ease-in-out hover:bg-[#35d1f5] rounded-full p-2 ripple-container"
                onClick={(e) => {
                  handleRippleEffect(e);
                  increaseMonth();
                }}
              >
                <MdOutlineKeyboardArrowRight />
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="px-1 py-1 hide-sroll-bar max-h-56">
            {selectedTime === "day" ? (
              <table className="w-full gap-1">
                <thead className="w-full">
                  <tr className="w-full gap-1">
                    <th className="text-sm p-1 select-none">CN</th>
                    <th className="text-sm p-1 select-none">T2</th>
                    <th className="text-sm p-1 select-none">T3</th>
                    <th className="text-sm p-1 select-none">T4</th>
                    <th className="text-sm p-1 select-none">T5</th>
                    <th className="text-sm p-1 select-none">T6</th>
                    <th className="text-sm p-1 select-none">T7</th>
                  </tr>
                </thead>
                <tbody className="w-full">{renderArrDate()}</tbody>
              </table>
            ) : selectedTime === "month" ? (
              <>
                <div className="grid grid-cols-3 gap-1">
                  {months.map((month) => (
                    <div
                      onClick={() => {
                        setVirtualMonth(month);
                        const newDate = new Date(date ?? new Date());
                        newDate.setMonth(month - 1);
                        setDate(newDate);
                        setIsActive(!isActive);
                      }}
                      key={month}
                      className={`${
                        virtualMonth === month
                          ? "bg-[#35d1f5] text-white"
                          : "bg-white hover:bg-[#35d1f5] hover:text-white text-black"
                      } text-sm text-center px-2 py-2  transition-background duration-700 ease-in-out m-1`}
                    >
                      Tháng {month}
                    </div>
                  ))}
                </div>
              </>
            ) : selectedTime === "year" ? (
              <>
                <div className="grid grid-cols-4 gap-1">
                  {years.map((year) => (
                    <div
                      onClick={() => {
                        setVirtualYear(year);
                        const newDate = new Date(date ?? new Date());
                        newDate.setFullYear(year);
                        setDate(newDate);
                        setTimeout(() => {
                          setSelectedTime("month");
                        }, 50);
                      }}
                      key={year}
                      ref={year === virtualYear ? selectedYearRef : null}
                      className={`${
                        virtualYear === year
                          ? "bg-[#35d1f5] text-white"
                          : "bg-white hover:bg-[#35d1f5] hover:text-white text-black"
                      } text-sm text-center px-2 py-2  transition-background duration-700 ease-in-out m-1`}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </>
            ) : selectedTime === "time" ? (
              <>
                <div className="flex flex-row w-full gap-1 justify-start items-start">
                  {renderTimeItems(hours, true, hourRef)}
                  <div className="h-60 w-1 bg-gray-200 rounded"></div>
                  {renderTimeItems(minutes, false, minuteRef)}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

MonthPicker.propTypes = {
  date: PropTypes.any.isRequired,
  setDate: PropTypes.func.isRequired,
  isHaveHour: PropTypes.bool,
  isDisable: PropTypes.bool,
};
export default MonthPicker;

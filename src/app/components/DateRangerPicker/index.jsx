import PropTypes from "prop-types";
import { useState, useRef, useEffect, useCallback } from "react";
import { MdCalendarMonth } from "react-icons/md";
import { PiArrowsLeftRightThin } from "react-icons/pi";
import {
	MdOutlineKeyboardDoubleArrowLeft,
	MdOutlineKeyboardArrowLeft,
	MdOutlineKeyboardArrowRight,
	MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";

export function convertStringToDate(string) {
	var parts = string.split("-");
	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[2], 10);
	const newDate = new Date(year, month - 1, day);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
}
export function isValidDate(dateString) {
	if (dateString.length > 10) return false;
	var regex = /^\d{2}-\d{2}-\d{4}$/;
	if (!regex.test(dateString)) {
		return false;
	}
	var parts = dateString.split("-");
	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[2], 10);
	if (isNaN(day) || isNaN(month) || isNaN(year)) {
		return false;
	}
	if (month < 1 || month > 12) {
		return false;
	}
	var lastDateOfMonth = new Date(year, month, 0).getDate();
	if (day < 1 || day > lastDateOfMonth) {
		return false;
	}
	if (year < 1900 || year > 2099) {
		return false;
	}

	return true;
}
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
const formatDate = (date) => {
	if (!date) return "";
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};
function compareMonthAndYear(firstDay, secondDay) {
	const firstDayYear = firstDay.getFullYear();
	const firstDayMonth = firstDay.getMonth();

	const secondDayYear = secondDay.getFullYear();
	const secondDayMonth = secondDay.getMonth();

	if (firstDayYear === secondDayYear && firstDayMonth === secondDayMonth) {
		return 0; // first day and second day in the same month and year.
	} else if (
		firstDayYear > secondDayYear ||
		(firstDayYear === secondDayYear && firstDayMonth > secondDayMonth)
	) {
		return -1; // second day in the past of the first day.
	} else {
		return 1; // second day in the future of the first day.
	}
}
function DateRangerPicker({
	startDate,
	endDate,
	setStartDate,
	setEndDate,
	isLoading = false,
}) {
	const parentRef = useRef(null); // biến ref đến cha của component này
	const contentRef = useRef(null); // biến ref đến nội dung của khung chọn, đồng thời cũng là con của parentRef
	const [isActive, setIsActive] = useState(false); // biến cho biết khung chọn có được mở hay không
	const inputStartDateRef = useRef(null); // biết ref đến input của ngày bắt đầu
	const inputEndDateRef = useRef(null); // biến ref đến input của ngày kết thúc
	const [isInputStartDateActive, setIsInputStartDateActive] = useState(false); // biến cho biết input của ngày bắt đầu có đang được focus hay không
	const [isInputEndDateActive, setIsInputEndDateActive] = useState(false); // biến cho biết input của ngày kết thúc có đang được focus hay không
	const [virtualStartDate, setVirtualStartDate] = useState(new Date()); // biến lưu trữ ngày bắt đầu ảo
	const [virtualStartMonth, setVirtualStartMonth] = useState(); // biến lưu trữ tháng bắt đầu ảo
	const [virtualStartYear, setVirtualStartYear] = useState(); // biến lưu trữ năm bắt đầu ảo
	const [virtualEndDate, setVirtualEndDate] = useState(new Date()); // biến lưu trữ ngày bắt đầu ảo
	const [virtualEndMonth, setVirtualEndMonth] = useState(); // biến lưu trữ tháng bắt đầu ảo
	const [virtualEndYear, setVirtualEndYear] = useState(); // biến lưu trữ năm bắt đầu ảo
	const [arrStartDate, setArrStartDate] = useState([]); // biến lưu trữ mảng các ngày trong tháng của ngày bắt đầu
	const [arrEndDate, setArrEndDate] = useState([]); // biến lưu trữ mảng các ngày trong tháng của ngày kết thúc
	const [selectedTime, setSelectedTime] = useState("day"); //  biến cho biết là người dùng đang chọn ngày hay tháng hay năm để component biết render ra dữ liệu khung hợp lý
	const [virtualSelectedYear, setVirtualSelectedYear] = useState(2023); // biến để lưu trữ tạm dữ liệu hiển thị năm khi người dùng chọn tháng
	const [virtualSelectedMonth, setVirtualSelectedMonth] = useState(1);
	const [isPickStartMonth, setIsPickStartMonth] = useState(false); // biến cho biết đang chọn tháng bắt đầu hay tháng kết thúc
	const [isPickStartYear, setIsPickStartYear] = useState(false); // biến cho biết đang chọn năm bắt đầu và năm kết thúc
	const [hoverDay, setHoverDay] = useState();
	const [inputValueStartDate, setInputValueStartDate] = useState("");
	const [inputValueEndDate, setInputValueEndDate] = useState("");

	useEffect(() => {
		if (!isActive) {
			setIsInputEndDateActive(false);
			setIsInputStartDateActive(false);
			inputStartDateRef.current.blur();
			inputEndDateRef.current.blur();
		}
	}, [isActive]);

	const refreshDate = () => {
		if (startDate) {
			setVirtualStartDate(startDate);
			const startMonth = startDate.getMonth() + 1;
			const startYear = startDate.getFullYear();
			const endMonth = startDate.getMonth() + 2;
			const endYear = endMonth === 13 ? startYear + 1 : startYear;
			setVirtualStartMonth(startMonth);
			setVirtualStartYear(startYear);
			setVirtualEndDate(new Date(endYear, endMonth - 1, 1));
			setVirtualEndMonth(endMonth);
			setVirtualEndYear(endYear);
			setArrStartDate(getArrDate(startDate));
			setArrEndDate(getArrDate(new Date(endYear, endMonth - 1, 1)));
		} else {
			const today = new Date();
			const startMonth = today.getMonth() + 1;
			const startYear = today.getFullYear();
			const endMonth = today.getMonth() + 2;
			const endYear = endMonth === 13 ? startYear + 1 : startYear;
			setVirtualStartMonth(startMonth);
			setVirtualStartYear(startYear);
			setVirtualStartDate(new Date(startYear, startMonth - 1, 1));
			setVirtualEndDate(new Date(endYear, endMonth - 1, 1));
			setVirtualEndMonth(endMonth);
			setVirtualEndYear(endYear);
			setArrStartDate(getArrDate(today));
			setArrEndDate(getArrDate(new Date(endYear, endMonth - 1, 1)));
		}
	};
	useEffect(() => {
		if (!endDate) {
			setStartDate(null);
			setInputValueStartDate("");
		}
		refreshDate();
	}, [isActive]);
	const handleInputFocus = () => {
		setIsActive(true);
	};
	useEffect(() => {
		refreshDate();
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);
	const handleOutsideClick = (event) => {
		if (parentRef.current && !parentRef.current.contains(event.target)) {
			setIsActive(false);
			setIsInputStartDateActive(false);
			setIsInputEndDateActive(false);
		}
	};
	const isFocusing = useCallback(() => {
		if (isInputStartDateActive) {
			return "left-[8px]";
		} else if (isInputEndDateActive) {
			return "left-[152px]";
		} else {
			return "hidden";
		}
	}, [isInputStartDateActive, isInputEndDateActive]);
	const handleOpenRangerPicker = useCallback(() => {
		if (isActive) {
			return `absolute ${
				selectedTime === "day" ? "h-max" : "h-[270px] z-10"
			}`;
		} else {
			return "h-[0px] absolute border-none";
		}
	}, [isActive, selectedTime]);
	const getArrDate = (date) => {
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
	function isDateInRange(dateToCheck, startDate, endDate) {
		return dateToCheck >= startDate && dateToCheck <= endDate;
	}
	const renderArrStartDate = () => {
		const firstDateOfMonth = new Date(
			virtualStartDate.getFullYear(),
			virtualStartDate.getMonth(),
			1
		);
		const lastDateOfMonth = new Date(
			virtualStartDate.getFullYear(),
			virtualStartDate.getMonth() + 1,
			0
		);
		const rows = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		let _virtualStartDate;
		let _virtualEndDate;
		if (startDate) {
			_virtualStartDate = new Date(startDate);
			_virtualStartDate.setHours(0, 0, 0, 0);
		}
		if (endDate) {
			_virtualEndDate = new Date(endDate);
			_virtualEndDate.setHours(0, 0, 0, 0);
		}

		for (let i = 0; i < 6; i++) {
			const startIndex = i * 7;
			const endIndex = startIndex + 7;

			const rowCells = arrStartDate
				.slice(startIndex, endIndex)
				.map((day, index) => {
					const isInMonth =
						day >= firstDateOfMonth && day <= lastDateOfMonth;
					const dayWithoutTime = new Date(day);
					dayWithoutTime.setHours(0, 0, 0, 0);

					const isToday =
						today.getTime() === dayWithoutTime.getTime();
					const isCorrectStartDate = _virtualStartDate
						? _virtualStartDate.getTime() ===
						  dayWithoutTime.getTime()
						: null;
					const isCorrectEndDate = _virtualEndDate
						? _virtualEndDate.getTime() === dayWithoutTime.getTime()
						: null;
					const hoverDayWithoutTime = new Date(hoverDay);
					hoverDayWithoutTime.setHours(0, 0, 0, 0);
					const dayIsHoverDay =
						dayWithoutTime.getTime() ===
						hoverDayWithoutTime.getTime();
					const isRangeHover =
						startDate &&
						!endDate &&
						isInMonth &&
						isDateInRange(
							dayWithoutTime,
							_virtualStartDate,
							hoverDay
						);

					const isInRange =
						isDateInRange(
							dayWithoutTime,
							_virtualStartDate,
							_virtualEndDate
						) && isInMonth;
					return (
						<td key={index}>
							<div
								onMouseEnter={() => {
									const newDate = new Date(day);
									newDate.setHours(0, 0, 0, 0);
									setHoverDay(newDate);
								}}
								onClick={(e) => {
									handleRippleEffect(e);
									const newDate = new Date(day);
									newDate.setHours(0, 0, 0, 0);
									hanldeOnClickPickDate(newDate, true);
								}}
								className={`${
									isCorrectStartDate && isCorrectEndDate
										? "bg-[#262773] text-white rounded"
										: isCorrectStartDate && isInMonth
										? "bg-[#262773] text-white rounded-l"
										: isCorrectEndDate && isInMonth
										? "bg-[#262773] text-white rounded-r"
										: isRangeHover
										? `!border-dashed !border-y-1 text-black !border-x-0 !border-[#262773] ${
												dayIsHoverDay
													? "!border-r-1 !rounded-r"
													: ""
										  }`
										: isInRange
										? "bg-[#262773b7] text-white"
										: `${
												isInMonth
													? "text-black"
													: "text-gray-300"
										  } ${
												isToday && isInMonth
													? "!border-[#262773] !border rounded"
													: "hover:bg-[#262773] hover:text-white hover:rounded "
										  }`
								} my-1 text-sm select-none transition-bg duration-150 bg-none  p-1 border-y-1 border-transparent  text-center  ripple-container 
									`}
							>
								{GetDayNumber(day)}
							</div>
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
	};
	const renderArrEndDate = () => {
		const firstDateOfMonth = new Date(
			virtualEndDate.getFullYear(),
			virtualEndDate.getMonth(),
			1
		);
		const lastDateOfMonth = new Date(
			virtualEndDate.getFullYear(),
			virtualEndDate.getMonth() + 1,
			0
		);
		const rows = [];
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		let _virtualStartDate;
		let _virtualEndDate;
		if (startDate) {
			_virtualStartDate = new Date(startDate);
			_virtualStartDate.setHours(0, 0, 0, 0);
		}
		if (endDate) {
			_virtualEndDate = new Date(endDate);
			_virtualEndDate.setHours(0, 0, 0, 0);
		}

		for (let i = 0; i < 6; i++) {
			const startIndex = i * 7;
			const endIndex = startIndex + 7;

			const rowCells = arrEndDate
				.slice(startIndex, endIndex)
				.map((day, index) => {
					const isInMonth =
						day >= firstDateOfMonth && day <= lastDateOfMonth;
					const dayWithoutTime = new Date(day);
					dayWithoutTime.setHours(0, 0, 0, 0);

					const isToday =
						today.getTime() === dayWithoutTime.getTime();
					const isCorrectStartDate = _virtualStartDate
						? _virtualStartDate.getTime() ===
						  dayWithoutTime.getTime()
						: null;
					const isCorrectEndDate = _virtualEndDate
						? _virtualEndDate.getTime() === dayWithoutTime.getTime()
						: null;
					const hoverDayWithoutTime = new Date(hoverDay);
					hoverDayWithoutTime.setHours(0, 0, 0, 0);
					const dayIsHoverDay =
						dayWithoutTime.getTime() ===
						hoverDayWithoutTime.getTime();
					const isRangeHover =
						startDate &&
						!endDate &&
						isInMonth &&
						isDateInRange(
							dayWithoutTime,
							_virtualStartDate,
							hoverDay
						);
					const isInRange =
						isDateInRange(
							dayWithoutTime,
							_virtualStartDate,
							_virtualEndDate
						) && isInMonth;
					return (
						<td key={index}>
							<div
								onMouseEnter={() => {
									const newDate = new Date(day);
									newDate.setHours(0, 0, 0, 0);
									setHoverDay(newDate);
								}}
								onClick={(e) => {
									handleRippleEffect(e);
									const newDate = new Date(day);
									newDate.setHours(0, 0, 0, 0);
									hanldeOnClickPickDate(newDate, false);
								}}
								className={`${
									isCorrectStartDate && isCorrectEndDate
										? "bg-[#262773] text-white rounded"
										: isCorrectStartDate && isInMonth
										? "bg-[#262773] text-white rounded-l"
										: isCorrectEndDate && isInMonth
										? "bg-[#262773] text-white rounded-r"
										: isRangeHover
										? `!border-dashed !border-y-1 text-black !border-x-0 !border-[#262773] ${
												dayIsHoverDay
													? "!border-r-1 !rounded-r"
													: ""
										  }`
										: isInRange
										? "bg-[#262773b7] text-white"
										: `${
												isInMonth
													? "text-black"
													: "text-gray-300"
										  } ${
												isToday && isInMonth
													? "!border-[#262773] !border rounded"
													: "hover:bg-[#262773] hover:text-white hover:rounded "
										  }`
								} my-1 text-sm select-none transition-bg duration-150 bg-none  p-1 border-y-1 border-transparent  text-center  ripple-container`}
							>
								{GetDayNumber(day)}
							</div>
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
	};
	const hanldePickMonthYear = (isStart, month, year) => {
		let newYear = year;
		let newMonth = month;
		const tempDate = new Date(newYear, newMonth - 1, 1);
		if (isStart) {
			if (tempDate >= virtualEndDate) {
				const tempEndDate = new Date(tempDate);
				tempEndDate.setMonth(tempEndDate.getMonth() + 1);
				setVirtualEndMonth(tempEndDate.getMonth() + 1);
				setVirtualEndYear(tempEndDate.getFullYear());
				setVirtualEndDate(tempEndDate);
				setArrEndDate(getArrDate(tempEndDate));
			}
			setVirtualStartDate(tempDate);
			setArrStartDate(getArrDate(tempDate));
		} else {
			if (tempDate <= virtualStartDate) {
				const tempStartDate = new Date(tempDate);
				tempStartDate.setMonth(tempStartDate.getMonth() - 1);
				setVirtualStartMonth(tempStartDate.getMonth() + 1);
				setVirtualStartYear(tempStartDate.getFullYear());
				setVirtualStartDate(tempStartDate);
				setArrStartDate(getArrDate(tempStartDate));
			}
			setVirtualEndDate(tempDate);
			setArrEndDate(getArrDate(tempDate));
		}
	};
	const handleIncrementMonth = () => {
		let newYear = virtualStartYear;
		let newMonth = virtualStartMonth + 1;

		if (newMonth === 13) {
			newMonth = 1;
			newYear++;
		}
		if (newYear > 1899 && newYear < 2099) {
			const tempStartDate = new Date(newYear, newMonth - 1, 1);
			setVirtualStartMonth(tempStartDate.getMonth() + 1);
			setVirtualStartYear(tempStartDate.getFullYear());

			const tempEndDate = new Date(tempStartDate);
			tempEndDate.setMonth(tempEndDate.getMonth() + 1);
			setVirtualEndMonth(tempEndDate.getMonth() + 1);
			setVirtualEndYear(tempEndDate.getFullYear());

			setVirtualStartDate(tempStartDate);
			setVirtualEndDate(tempEndDate);
			setArrStartDate(getArrDate(tempStartDate));
			setArrEndDate(getArrDate(tempEndDate));
		}
	};

	const handleDecrementMonth = () => {
		let newYear = virtualStartYear;
		let newMonth = virtualStartMonth - 1;

		if (newMonth === 0) {
			newMonth = 12;
			newYear--;
		}
		if (newYear > 1899 && newYear < 2099) {
			const tempStartDate = new Date(
				newYear,
				newMonth - 1,
				virtualStartDate.getDate()
			);
			setVirtualStartMonth(tempStartDate.getMonth() + 1);
			setVirtualStartYear(tempStartDate.getFullYear());

			const tempEndDate = new Date(tempStartDate);
			tempEndDate.setMonth(tempEndDate.getMonth() + 1);
			setVirtualEndMonth(tempEndDate.getMonth() + 1);
			setVirtualEndYear(tempEndDate.getFullYear());

			setVirtualStartDate(tempStartDate);
			setVirtualEndDate(tempEndDate);
			setArrStartDate(getArrDate(tempStartDate));
			setArrEndDate(getArrDate(tempEndDate));
		}
	};

	const handleIncrementYear = () => {
		const newYear = virtualStartYear + 1;
		if (newYear > 1900 && newYear < 2100) {
			const tempStartDate = new Date(
				newYear,
				virtualStartMonth - 1,
				virtualStartDate.getDate()
			);
			setVirtualStartMonth(tempStartDate.getMonth() + 1);
			setVirtualStartYear(tempStartDate.getFullYear());

			const tempEndDate = new Date(tempStartDate);
			tempEndDate.setMonth(tempEndDate.getMonth() + 1);
			setVirtualEndMonth(tempEndDate.getMonth() + 1);
			setVirtualEndYear(tempEndDate.getFullYear());

			setVirtualStartDate(tempStartDate);
			setVirtualEndDate(tempEndDate);
			setArrStartDate(getArrDate(tempStartDate));
			setArrEndDate(getArrDate(tempEndDate));
		}
	};

	const handleDecrementYear = () => {
		const newYear = virtualStartYear - 1;
		if (newYear > 1900 && newYear < 2100) {
			const tempStartDate = new Date(
				newYear,
				virtualStartMonth - 1,
				virtualStartDate.getDate()
			);
			setVirtualStartMonth(tempStartDate.getMonth() + 1);
			setVirtualStartYear(tempStartDate.getFullYear());

			const tempEndDate = new Date(tempStartDate);
			tempEndDate.setMonth(tempEndDate.getMonth() + 1);
			setVirtualEndMonth(tempEndDate.getMonth() + 1);
			setVirtualEndYear(tempEndDate.getFullYear());

			setVirtualStartDate(tempStartDate);
			setVirtualEndDate(tempEndDate);
			setArrStartDate(getArrDate(tempStartDate));
			setArrEndDate(getArrDate(tempEndDate));
		}
	};
	const hanldeOnClickPickDate = (day, isStartMonth) => {
		if (isStartMonth) {
			if (compareMonthAndYear(day, virtualStartDate) === 1)
				handleDecrementMonth();
		} else {
			if (compareMonthAndYear(day, virtualEndDate) === -1)
				handleIncrementMonth();
		}
		if (startDate && endDate) {
			inputStartDateRef.current.focus();
			setStartDate(day);
			setInputValueStartDate(formatDate(day));
			setEndDate(null);
			setInputValueEndDate("");
		} else if (!startDate) {
			inputEndDateRef.current.focus();
			setStartDate(day);
			setInputValueStartDate(formatDate(day));
		} else if (startDate && !endDate) {
			if (day.getTime() < startDate.getTime()) {
				inputStartDateRef.current.focus();
				setStartDate(day);
				setInputValueStartDate(formatDate(day));
			} else {
				inputEndDateRef.current.focus();
				setEndDate(day);
				setInputValueEndDate(formatDate(day));
				setTimeout(() => {
					setIsActive(false);
				}, 100);
			}
		}
	};
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	const startYear = 1900;
	const endYear = 2099;
	const years = [];
	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}
	const selectedYearRef = useRef(null);
	useEffect(() => {
		if (selectedYearRef.current) {
			setTimeout(() => {
				selectedYearRef.current.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 350);
		}
	}, [selectedTime]);
	return (
		<>
			<div
				ref={parentRef}
				className={`h-10 max-w-[300px] animation-input border-2 rounded-[0.5rem] bg-transparent w-full relative cursor-pointer flex flex-row justify-center items-center ${
					isActive
						? "border-primary focus-input outline-none"
						: "border-[#d2d6da]"
				}`}
			>
				<input
					ref={inputStartDateRef}
					// value={startDate ? formatDate(startDate) : ""}
					value={inputValueStartDate}
					onChange={(e) => {
						setInputValueStartDate(e.target.value);
						if (isValidDate(e.target.value)) {
							if (endDate) {
								if (
									convertStringToDate(e.target.value) <=
									endDate
								)
									setStartDate(
										convertStringToDate(e.target.value)
									);
							} else {
								setStartDate(
									convertStringToDate(e.target.value)
								);
							}
						}
					}}
					onBlur={(e) => {
						if (e.target.value !== formatDate(startDate))
							setInputValueStartDate(formatDate(startDate));
					}}
					placeholder={
						hoverDay && isActive && !startDate
							? formatDate(hoverDay)
							: "Ngày bắt đầu"
					}
					className="bg-transparent text-white placeholder:text-white max-w-32 placeholder:font-light placeholder:opacity-80 placeholder:tracking-[0.01rem] text-inherit  text-sm px-2 py-1 outline-none"
					type="text"
					onFocus={() => {
						handleInputFocus();
						setIsInputStartDateActive(true);
						setIsInputEndDateActive(false);
					}}
				/>
				<span className="text-gray-600 text-sm">
					<PiArrowsLeftRightThin color="white" />
				</span>
				<input
					ref={inputEndDateRef}
					// value={endDate ? formatDate(endDate) : ""}
					value={inputValueEndDate}
					onChange={(e) => {
						setInputValueEndDate(e.target.value);
						if (isValidDate(e.target.value)) {
							if (startDate) {
								if (
									convertStringToDate(e.target.value) >=
									startDate
								)
									setEndDate(
										convertStringToDate(e.target.value)
									);
							}
						}
					}}
					onBlur={(e) => {
						if (!startDate || !endDate) {
							setInputValueEndDate("");
						} else if (e.target.value !== formatDate(endDate)) {
							setInputValueEndDate(formatDate(endDate));
						}
					}}
					placeholder={
						hoverDay && isActive && startDate
							? formatDate(hoverDay)
							: "Ngày kết thúc"
					}
					className={`bg-transparent text-white placeholder:text-white max-w-32 placeholder:font-light placeholder:opacity-80 placeholder:tracking-[0.01rem] text-inherit  text-sm px-2 py-1 outline-none mr-4 `}
					type="text"
					onFocus={() => {
						handleInputFocus();
						setIsInputStartDateActive(false);
						setIsInputEndDateActive(true);
					}}
				/>
				<div
					className={`absolute right-2 bottom-[50%] translate-y-[50%] cursor-pointer transition-[text] duration-1000 ease-in-out `}
				>
					{!isActive ? (
						<span
							onClick={(e) => {
								e.stopPropagation();
								setIsActive((pre) => !pre);
							}}
						>
							<MdCalendarMonth color="white" />
						</span>
					) : (
						<span
							onClick={(e) => {
								e.stopPropagation();
								setStartDate(null);
								setEndDate(null);
								setInputValueStartDate("");
								setInputValueEndDate("");
							}}
						>
							<IoMdCloseCircle color="white" />
						</span>
					)}
				</div>
				<div
					className={`animation-underline-input absolute bottom-[0.6px] h-[2px] rounded bg-white w-[45%] ${isFocusing()}`}
				></div>
				<div
					style={{ zIndex: 10000 }}
					ref={contentRef}
					className={`bg-gradient-to-r from-[#3235a8] to-[#1a1941] select-none flex flex-row justify-start items-center animation-date-ranger-picker  left-0 top-full border border-gray-200 rounded bg-white  my-1  overflow-y-hidden overflow-x-hidden   ${handleOpenRangerPicker()}`}
				>
					{selectedTime === "year" ? (
						<>
							<div className="w-72 h-full flex flex-col ">
								<div className="flex flex-row justify-center items-center  px-4 text-white bg-transparent py-3">
									<div className=" flex flex-row justify-center items-center gap-1">
										<span className="text-base text-white">
											{isPickStartYear
												? "Chọn năm bắt đầu"
												: "Chọn năm kết thúc"}
										</span>
									</div>
								</div>
								<div className="grid grid-cols-4 gap-1 overflow-auto">
									{years.map((year) => (
										<div
											onClick={() => {
												if (isPickStartYear) {
													setVirtualStartYear(year);
													hanldePickMonthYear(
														true,
														virtualStartMonth,
														year
													);
												} else {
													setVirtualEndYear(year);
													hanldePickMonthYear(
														false,
														virtualEndMonth,
														year
													);
												}
												setTimeout(() => {
													setSelectedTime("day");
												}, 0);
											}}
											key={year}
											ref={
												year === virtualSelectedYear
													? selectedYearRef
													: null
											}
											className={`${
												virtualSelectedYear === year
													? "bg-transparent text-white"
													: "bg-white hover:bg-transparent hover:text-white text-black"
											} text-sm text-center px-2 py-2  transition-background duration-700 ease-in-out m-1`}
										>
											{year}
										</div>
									))}
								</div>
							</div>
						</>
					) : selectedTime === "month" ? (
						<>
							<div className="w-72 h-full flex flex-col ">
								<div className="flex flex-row justify-between items-center px-4 text-white bg-transparent py-3">
									<div className="flex flex-row justify-center items-center gap-1">
										<span
											className="bg-transparent  transition-bg duration-400 ease-in-out hover:bg-[#3235a8] rounded-full p-2 ripple-container"
											onClick={(e) => {
												handleRippleEffect(e);
												setVirtualSelectedYear(
													(pre) => {
														const newPre = pre - 1;
														if (
															newPre >= 1900 &&
															newPre <= 2099
														)
															return newPre;
														else return pre;
													}
												);
											}}
										>
											<MdOutlineKeyboardDoubleArrowLeft />
										</span>
									</div>
									<div className=" flex flex-row justify-center items-center gap-1">
										<span className="text-base text-white">
											{virtualSelectedYear}
										</span>
									</div>
									<div className=" flex-row justify-center items-center gap-1 flex">
										<span
											className="bg-transparent  transition-bg duration-400 ease-in-out hover:bg-[#3235a8] rounded-full p-2 ripple-container"
											onClick={(e) => {
												handleRippleEffect(e);
												setVirtualSelectedYear(
													(pre) => {
														const newPre = pre + 1;
														if (
															newPre >= 1900 &&
															newPre <= 2099
														)
															return newPre;
														else return pre;
													}
												);
											}}
										>
											<MdOutlineKeyboardDoubleArrowRight />
										</span>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-1">
									{months.map((month) => (
										<div
											onClick={() => {
												if (isPickStartMonth) {
													setVirtualStartMonth(month);
													setVirtualStartYear(
														virtualSelectedYear
													);
													hanldePickMonthYear(
														true,
														month,
														virtualSelectedYear
													);
												} else {
													setVirtualEndMonth(month);
													setVirtualEndYear(
														virtualSelectedYear
													);
													hanldePickMonthYear(
														false,
														month,
														virtualSelectedYear
													);
												}
												setTimeout(() => {
													setSelectedTime("day");
												}, 0);
											}}
											key={month}
											className={`${
												virtualSelectedMonth === month
													? "bg-transparent text-white"
													: "bg-white hover:bg-transparent hover:text-white text-black"
											} text-sm text-center px-2 py-2  transition-background duration-700 ease-in-out m-1`}
										>
											Tháng {month}
										</div>
									))}
								</div>
							</div>
						</>
					) : (
						<>
							<div className="w-72 h-full flex flex-col  ">
								<div className="flex flex-row justify-between items-center px-4 text-white bg-transparent py-1">
									<div className="flex flex-row justify-center items-center gap-1">
										<span
											className="bg-transparent  transition-bg duration-400 ease-in-out hover:bg-[#3235a8] rounded-full p-2 ripple-container"
											onClick={(e) => {
												handleDecrementYear();
												handleRippleEffect(e);
											}}
										>
											<MdOutlineKeyboardDoubleArrowLeft />
										</span>
										<span
											className="bg-transparent  transition-bg duration-400 ease-in-out hover:bg-[#3235a8] rounded-full p-2 ripple-container"
											onClick={(e) => {
												handleDecrementMonth();
												handleRippleEffect(e);
											}}
										>
											<MdOutlineKeyboardArrowLeft />
										</span>
									</div>
									<div className=" flex flex-row justify-center items-center gap-1">
										<span
											className="text-base text-white hover:text-[#121946] flex flex-row justify-center items-center gap-1 "
											onClick={() => {
												setVirtualSelectedMonth(
													virtualStartMonth
												);
												setVirtualSelectedYear(
													virtualStartYear
												);
												setIsPickStartMonth(true);
												setTimeout(() => {
													setSelectedTime("month");
												}, 0);
											}}
										>
											<p>Tháng </p>
											<p>{virtualStartMonth}</p>
										</span>
										<span className="text-base text-white">
											-
										</span>
										<span
											className="text-base text-white hover:text-[#121946]"
											onClick={() => {
												setVirtualSelectedMonth(
													virtualStartMonth
												);
												setVirtualSelectedYear(
													virtualStartYear
												);
												setIsPickStartYear(true);
												setTimeout(() => {
													setSelectedTime("year");
												}, 0);
											}}
										>
											{virtualStartYear}
										</span>
									</div>
									<div className=" flex-row justify-center items-center gap-1 flex opacity-0">
										<span>
											<MdOutlineKeyboardDoubleArrowLeft />
										</span>
										<span>
											<MdOutlineKeyboardArrowLeft />
										</span>
									</div>
								</div>
								<div className="px-1 py-1 overflow-y-hidden bg-white">
									<table className="w-full gap-1">
										<thead className="w-full">
											<tr className="w-full gap-1 text-black">
												<th className="text-sm p-1 select-none">
													CN
												</th>
												<th className="text-sm p-1 select-none">
													T2
												</th>
												<th className="text-sm p-1 select-none">
													T3
												</th>
												<th className="text-sm p-1 select-none">
													T4
												</th>
												<th className="text-sm p-1 select-none">
													T5
												</th>
												<th className="text-sm p-1 select-none">
													T6
												</th>
												<th className="text-sm p-1 select-none">
													T7
												</th>
											</tr>
										</thead>
										<tbody className="w-full">
											{renderArrStartDate()}
										</tbody>
									</table>
								</div>
							</div>
							<div className="w-72 h-full flex flex-col  ">
								<div className="flex flex-row justify-between items-center px-4 text-white bg-transparent py-1">
									<div className=" flex-row justify-center items-center gap-1 flex opacity-0">
										<span>
											<MdOutlineKeyboardDoubleArrowLeft />
										</span>
										<span>
											<MdOutlineKeyboardArrowLeft />
										</span>
									</div>
									<div className=" flex flex-row justify-center items-center gap-1">
										<span
											className="text-base text-white hover:text-[#121946] flex flex-row justify-center items-center gap-1"
											onClick={() => {
												setVirtualSelectedMonth(
													virtualEndMonth
												);
												setVirtualSelectedYear(
													virtualEndYear
												);
												setIsPickStartMonth(false);
												setTimeout(() => {
													setSelectedTime("month");
												}, 0);
											}}
										>
											<p>Tháng</p>
											<p>{virtualEndMonth}</p>
										</span>
										<span className="text-base text-white">
											-
										</span>
										<span
											className="text-base text-white hover:text-[#121946]"
											onClick={() => {
												setVirtualSelectedMonth(
													virtualEndMonth
												);
												setVirtualSelectedYear(
													virtualEndYear
												);
												setIsPickStartYear(false);
												setTimeout(() => {
													setSelectedTime("year");
												}, 0);
											}}
										>
											{virtualEndYear}
										</span>
									</div>

									<div className="flex flex-row justify-center items-center gap-1">
										<span
											className="bg-transparent  transition-bg duration-400 ease-in-out hover:bg-[#3235a8] rounded-full p-2 ripple-container"
											onClick={(e) => {
												handleIncrementMonth();
												handleRippleEffect(e);
											}}
										>
											<MdOutlineKeyboardArrowRight />
										</span>
										<span
											className="bg-transparent  transition-bg duration-400 ease-in-out hover:bg-[#3235a8] rounded-full p-2 ripple-container"
											onClick={(e) => {
												handleIncrementYear();
												handleRippleEffect(e);
											}}
										>
											<MdOutlineKeyboardDoubleArrowRight />
										</span>
									</div>
								</div>
								<div className="px-1 py-1 overflow-y-hidden bg-white">
									<table className="w-full gap-1">
										<thead className="w-full">
											<tr className="w-full gap-1 text-black">
												<th className="text-sm p-1 select-none">
													CN
												</th>
												<th className="text-sm p-1 select-none">
													T2
												</th>
												<th className="text-sm p-1 select-none">
													T3
												</th>
												<th className="text-sm p-1 select-none">
													T4
												</th>
												<th className="text-sm p-1 select-none">
													T5
												</th>
												<th className="text-sm p-1 select-none">
													T6
												</th>
												<th className="text-sm p-1 select-none">
													T7
												</th>
											</tr>
										</thead>
										<tbody className="w-full">
											{renderArrEndDate()}
										</tbody>
									</table>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}
DateRangerPicker.propTypes = {
	startDate: PropTypes.any,
	endDate: PropTypes.any,
	setStartDate: PropTypes.func.isRequired,
	setEndDate: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
};
export default DateRangerPicker;

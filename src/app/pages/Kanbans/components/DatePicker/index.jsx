import {Divider} from "@nextui-org/react";
import {useCallback, useMemo, useState} from "react";
import {IoChevronBackOutline, IoChevronForward} from "react-icons/io5";
import {
	daysInMonth,
	getMonth,
	getPrevDaysInMonth,
	getNextDaysInMonth,
} from "./utils";

const DAYS_OF_WEEK = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function DatePicker({startDate, endDate, setStartDate, setEndDate}) {
	const [currentDate, setCurrentDate] = useState(new Date());

	const days = useMemo(() => {
		const firstDayOfMonth = new Date(
			currentDate?.getFullYear(),
			currentDate?.getMonth(),
			1
		);
		// Get first day of week
		const offset = firstDayOfMonth?.getDay();

		const totalDaysInMonth = daysInMonth(
			currentDate?.getMonth() + 1,
			currentDate?.getFullYear()
		);

		// Initial array days
		const daysArray = [];
		const prevDaysInMonth = getPrevDaysInMonth(currentDate, offset);

		for (let i = 0; i < offset; i++) {
			daysArray.push(prevDaysInMonth[i]);
		}

		// Fill in the days of the month
		for (let i = 1; i <= totalDaysInMonth; i++) {
			daysArray.push({
				day: i,
				month: currentDate?.getMonth() + 1,
				year: currentDate.getFullYear(),
			});
		}

		// // Fill in the remaining days with empty cells
		const remainingDays = 42 - daysArray.length;
		const nextDaysInMonth = getNextDaysInMonth(currentDate, remainingDays);

		for (let i = 0; i < remainingDays; i++) {
			daysArray.push(nextDaysInMonth[i]);
		}

		return daysArray;
	}, [currentDate]);

	const textOverlayDays = (date) => {
		const textOverlay = " text-[#8585856e]";
		const textCurrentDay =
			" text-primary-400 font-medium after:absolute after:bottom-1 after:left-0 after:right-0 after:h-[2px] after:w-full after:bg-primary-400";

		if (date?.month !== currentDate?.getMonth() + 1) {
			return textOverlay;
		}

		if (
			date?.month === new Date().getMonth() + 1 &&
			date?.day === currentDate.getDate()
		) {
			return textCurrentDay;
		}

		return " text-task-title";
	};

	const handleClickPreviousMonth = () => {
		setCurrentDate((prevDate) => {
			const nextDate = new Date(prevDate);

			nextDate.setMonth(nextDate.getMonth() - 1);

			return nextDate;
		});
	};

	const handleClickNextMonth = () => {
		setCurrentDate((prevDate) => {
			const nextDate = new Date(prevDate);

			nextDate.setMonth(nextDate.getMonth() + 1);

			return nextDate;
		});
	};

	const handleDayClick = useCallback(
		(date) => {
			if (!startDate || (startDate && endDate)) {
				setStartDate(date);
				setEndDate(null); // Reset end date
			}

			if (startDate && !endDate) {
				// Check if the clicked date is before or the same as the current startDate
				if (
					date.year < startDate.year ||
					(date.year === startDate.year && date.month < startDate.month) ||
					(date.year === startDate.year &&
						date.month === startDate.month &&
						date.day <= startDate.day)
				) {
					setStartDate(date);
					setEndDate(startDate);
				} else {
					setEndDate(date);
				}
			}
		},
		[startDate, endDate]
	);

	const isRangeDate = useCallback(
		(date) => {
			if (!date || (!startDate && !endDate)) {
				return false;
			}

			if (startDate && !endDate) {
				return (
					date.year === startDate?.year &&
					date.month === startDate?.month &&
					date.day === startDate?.day
				);
			}

			// Check if the date falls within the range
			const isAfterStartDate =
				date.year > startDate.year ||
				(date.year === startDate.year && date.month > startDate.month) ||
				(date.year === startDate.year &&
					date.month === startDate.month &&
					date.day >= startDate.day);

			const isBeforeEndDate =
				date.year < endDate.year ||
				(date.year === endDate.year && date.month < endDate.month) ||
				(date.year === endDate.year &&
					date.month === endDate.month &&
					date.day <= endDate.day);

			// Handle the case where endDay < startDay by swapping startDate and endDate
			// if (endDate.year === startDate.year && endDate.month === startDate.month && endDate.day < startDate.day) {
			// 	return isAfterStartDate && !isBeforeEndDate;
			// }

			return isAfterStartDate && isBeforeEndDate;
		},
		[startDate, endDate]
	);

	const textBoldSelected = (date, selectedDate) => {
		if (!date || !selectedDate) {
			return "";
		}

		if (
			date?.year === selectedDate?.year &&
			date?.month === selectedDate?.month &&
			date?.day === selectedDate?.day
		) {
			return " !text-primary-400 !font-medium";
		}

		return "";
	};

	return (
		<div className="max-w-full">
			<header className="flex items-center justify-between">
				<span
					className="p-2 cursor-pointer hover:bg-btn-detail rounded-md"
					onClick={handleClickPreviousMonth}
				>
					<IoChevronBackOutline className="text-base text-task-title" />
				</span>

				<h3 className="select-none py-0 px-8 align-middle text-sm text-center tracking-wide font-semibold text-task-title text-ellipsis text-nowrap overflow-hidden">
					{`${getMonth(currentDate)} - ${currentDate?.getFullYear()}`}
				</h3>

				<span
					className="p-2 cursor-pointer hover:bg-btn-detail rounded-md"
					onClick={handleClickNextMonth}
				>
					<IoChevronForward className="text-base text-task-title" />
				</span>
			</header>

			<Divider className="my-3" />

			<div className="grid grid-cols-7 grid-rows-7">
				{/* DAYS_OF_WEEK */}
				{DAYS_OF_WEEK?.map((item) => (
					<div
						key={item}
						className="row-span-1 col-span-1 flex items-center justify-center"
					>
						<span className="text-sm text-task-title font-semibold p-2">
							{item}
						</span>
					</div>
				))}

				{/* Days In Current Month */}
				{days?.map((item, index) => (
					<div
						key={index}
						className={`row-span-1 col-span-1 relative flex items-center justify-center cursor-pointer hover:bg-btn-detail rounded-sm${
							isRangeDate(item) ? " !bg-primary-50 rounded-full" : ""
						}`}
						onClick={() => handleDayClick(item)}
					>
						<span
							className={`text-sm px-1 py-1 select-none${textOverlayDays(
								item
							)}${textBoldSelected(item, startDate)}${textBoldSelected(
								item,
								endDate
							)}`}
						>
							{item?.day}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default DatePicker;

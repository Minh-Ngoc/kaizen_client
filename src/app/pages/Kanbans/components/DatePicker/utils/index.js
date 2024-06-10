// Kiểm tra xem một năm có phải là năm nhuận hay không
export const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// Số ngày trong một tháng
export const daysInMonth = (month, year) => {
    if (month === 2) {
        return isLeapYear(year) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
    } else {
        return 31;
    }
};

export const getMonth = (date) => {
    const month = date.getMonth() + 1;
    if (month < 10) {
        return "Tháng 0" + month;
    }
    return "Tháng " + month;
};

export const getPrevDaysInMonth = (date, offset) => {
    // Get the month and year
    const month = (date.getMonth() + 1) === 1 ? 12 : date.getMonth();
    const year = (date.getMonth() + 1) === 1 ? date.getFullYear() - 1 : date.getFullYear();

    // Fill in the days before the first day of the month with empty cells
    const totalPrevDaysInMonth = daysInMonth(month, year);
    const prevDaysInMonth = Array.from({ length: totalPrevDaysInMonth }, (_, index) => ({
        day: index + 1,
        month: month,
        year: year,
    }));

    // Slice the array to get the required number of days based on the offset
    const newPrevDaysInMonth = prevDaysInMonth.slice(prevDaysInMonth.length - offset);

    return newPrevDaysInMonth;
}

export const getNextDaysInMonth = (date, offset) => {
    // Calculate the month and year of the next month
    const nextMonth = date.getMonth() === 11 ? 1 : date.getMonth() + 2;
    const nextYear = date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear();
    // Fill in the days before the first day of the month with empty cells
    const totalNextDaysInMonth = daysInMonth(nextMonth, nextYear);
    const nextDaysInMonth = Array.from({ length: totalNextDaysInMonth }, (_, index) => ({
        day: ++index,
        month: nextMonth,
        year: nextYear,
    }));

    const newNextDaysInMonth = nextDaysInMonth.slice(0, offset);

    return newNextDaysInMonth;
}
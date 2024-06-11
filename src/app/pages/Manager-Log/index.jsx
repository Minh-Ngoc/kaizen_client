import { useState, useEffect, useMemo, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { logAction } from "_redux/slice/logSlice";
import { userAction } from "_redux/slice/user.slice";
import DateRangerPicker from "app/components/DateRangerPicker";
import { Button } from "@nextui-org/react";
function dateToUtcTime(date) {
  if (!date) return "";
  const userTimeZoneOffset = date?.getTimezoneOffset();
  const utcOffsetInHours = -userTimeZoneOffset / 60;
  const utcTime = new Date(date.getTime() + utcOffsetInHours * 60 * 60 * 1000);
  return utcTime;
}

export default function ManagerLog() {
  return null;
}

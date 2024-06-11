import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as ButtonNextUi,
  Button,
} from "@nextui-org/react";
import { MdOutlineDone, MdOutlineClear } from "react-icons/md";
import FormData from "form-data";
import { IoCloseCircleSharp } from "react-icons/io5";
import PropTypes from "prop-types";
import * as yup from "yup";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import DateTimePicker from "../../../components/DateTimePicker";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import NotifyMessage from "_utils/notify";
import { URL_IMAGE } from "_constants";
import { GetDateExactTime } from "_utils";
import { userAction } from "_redux/slice/user.slice";
import { getAllKpiBonus } from "_redux/slice/kpiBonusSlice";
import MonthPicker from "./month_select";
import { updateKpiBonusDomainId } from "services/api.service";
import ModalRejectKpi from "./modalReject";
import { dateToUtcTimestamp } from "_constants";
import { Textarea } from "@nextui-org/react";
import Select from "react-select";
function ModalAddKpiBonus({ isOpen, onClose, domainData, onComplete }) {
  const [isOpenModalReject, setIsOpenModalReject] = useState(false);
  const [indexKpi, setIndexKpi] = useState("");
  const [isApprove, setIsApprove] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const listKpiBonus = useSelector((state) => state.kpiBonus.listKpiBonus);
  const listUsers = useSelector((state) => state.user.listUserGetAll);
  const [listOptionTop, setListOptionTop] = useState([]);
  useEffect(() => {
    if (!listUsers?.length) dispatch(userAction?.GetAllUser());
    if (!listKpiBonus?.length) dispatch(getAllKpiBonus());
  }, []);
  const domainSchema = yup.object({
    userManager: yup.string().required("Người quản lý không được để trống"),
    dateReceive: yup.date().required("Ngày nhận web không được để trống"),
    detailWebKpiBonus: yup
      .string()
      .required("Mức thưởng kpi không được để trống"),
    userSupport: yup.string().nullable(),
    leaderComment: yup.string().nullable(),
    arrayKpi: yup.array().of(
      yup.object().shape({
        _id: yup.string(),
        keyWord: yup.string().required("không được để trống"),
        condition: yup.object().shape({
          //   volume: yup
          //     .number()
          //     .required("Volume không được để trống")
          //     .typeError("Volume phải là một số"),
          top: yup.string().required("Top không được để trống"),
          customer: yup
            .number()
            .required("Khách hàng không được để trống")
            .typeError("Khách hàng phải là một số"),
          //   totalDeposit: yup
          //     .number()
          //     .required("Thưởng không được để trống")
          //     .typeError("Thưởng phải là một số"),
        }),
        user: yup.string().nullable(),
        review: yup.object().shape({
          userApprove: yup.string().nullable(),
          status: yup.string().nullable(),
          top: yup.string().nullable(),
        }),
        month: yup.date().required("tháng không được để trống"),
        src: yup.mixed().nullable(),
        tempBase64: yup.string().nullable(),
        isHaveImage: yup.bool(),
        isDelete: yup.bool(),
        indexImage: yup.number(),
        isNew: yup.bool(),
      })
    ),
  });

  useEffect(() => {
    reset();
    setValue("userManager", domainData?.userManager?._id ?? "");
    setValue(
      "dateReceive",
      domainData?.dateReceive ? GetDateExactTime(domainData?.dateReceive) : null
    );
    setValue("detailWebKpiBonus", domainData?.detailWebKpiBonus?._id ?? "");
    setValue("userSupport", domainData?.userSupport?._id ?? "");
    setValue("leaderComment", domainData?.leaderComment ?? "");
    const arr = [];
    for (let i = 0; i < domainData?.arrayKpi?.length; i++) {
      arr.push({
        _id: domainData?.arrayKpi[i]?._id,
        keyWord: domainData?.arrayKpi[i]?.keyWord,
        condition: {
          //   volume: domainData?.arrayKpi[i]?.condition?.volume,
          top: domainData?.arrayKpi[i]?.condition?.top,
          customer: domainData?.arrayKpi[i]?.condition?.customer,
          //   totalDeposit: domainData?.arrayKpi[i]?.condition?.totalDeposit,
        },
        user: domainData?.arrayKpi[i]?.user,
        review: {
          userApprove: domainData?.arrayKpi[i]?.review?.userApprove,
          status: domainData?.arrayKpi[i]?.review?.status ?? "pending",
          top: domainData?.arrayKpi[i]?.review?.top,
        },
        month: new Date(domainData?.arrayKpi[i]?.month),
        src: null,
        tempBase64: domainData?.arrayKpi[i]?.src
          ? URL_IMAGE + "/" + domainData?.arrayKpi[i]?.src
          : "",
        isHaveImage: false,
        isDelete: false,
        indexImage: i,
        isNew: false,
      });
    }
    setValue(
      "arrayKpi",
      arr?.length
        ? arr
        : [
            {
              _id: "",
              keyWord: "",
              condition: {
                // volume: "",
                top: "",
                customer: "",
                // totalDeposit: "",
              },
              user: "",
              review: {
                status: "pending",
                userApprove: "",
                top: null,
              },
              month: null,
              src: null,
              tempBase64: "",
              isHaveImage: false,
              isDelete: false,
              indexImage: -1,
              isNew: true,
            },
          ]
    );
  }, [isOpen]);
  const handleClose = () => {
    reset();
    onClose();
  };
  const {
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userManager: "",
      dateReceive: null,
      detailWebKpiBonus: "",
      userSupport: "",
      leaderComment: "",
      arrayKpi: [
        {
          _id: "",
          keyWord: "",
          condition: {
            // volume: "",
            top: "",
            customer: "",
            // totalDeposit: "",
          },
          user: "",
          review: {
            status: "pending",
            userApprove: "",
            top: null,
          },
          month: null,
          src: null,
          tempBase64: "",
          isHaveImage: false,
          isDelete: false,
          indexImage: -1,
          isNew: true,
        },
      ],
    },
    resolver: yupResolver(domainSchema),
  });
  useEffect(() => {
    const kpi = listKpiBonus?.find((e) => e._id === watch("detailWebKpiBonus"));
    const optionTop = kpi?.level?.map((e) => e.condition.top);
    setListOptionTop(optionTop?.length !== 0 ? optionTop : []);
    const currentArrayKpi = getValues("arrayKpi");
    const updatedArrayKpi = currentArrayKpi.map((item) => {
      if (!optionTop?.includes(item.condition.top)) {
        return {
          ...item,
          condition: {
            ...item.condition,
            top: "",
          },
        };
      }
      return item;
    });
    setValue("arrayKpi", updatedArrayKpi);
  }, [watch("detailWebKpiBonus"), listKpiBonus]);
  const handleAddKpi = () => {
    const newKpi = {
      _id: "",
      keyWord: "",
      condition: {
        // volume: "",
        top: "",
        customer: "",
        // totalDeposit: "",
      },
      user: "",
      review: {
        status: "pending",
        userApprove: "",
        top: null,
      },
      month: null, // Hoặc giá trị mặc định tùy ý khác
      src: null,
      tempBase64: "",
      isHaveImage: false,
      isDelete: false,
      indexImage: -1,
      isNew: true,
    };
    setValue("arrayKpi", [...getValues("arrayKpi"), newKpi]);
  };
  const [statusKpiOnComplete, setStatusKpiOnComplete] = useState("");
  const handleonCompleteKpi = () => {
    const newArrayKpi = [...getValues("arrayKpi")];
    newArrayKpi[indexKpi].review.status = statusKpiOnComplete;
    setValue("arrayKpi", newArrayKpi);
    onComplete();
  };
  const handleRemoveKpi = (indexToRemove) => {
    const updatedKpis = getValues("arrayKpi").filter(
      (_, index) => index !== indexToRemove
    );
    setValue("arrayKpi", updatedKpis);
  };
  const onSubmit = handleSubmit(async (values) => {
    try {
      const file = [];
      const modifiedArrayKpi = values.arrayKpi.map((kpi) => {
        const { tempBase64, src, ...rest } = kpi;
        file.push(src);
        return rest;
      });
      const modifiedValues = {
        ...values,
        arrayKpi: modifiedArrayKpi,
      };
      const formData = new FormData();

      formData.append("leaderComment", modifiedValues.leaderComment);
      formData.append("userSupport", modifiedValues.userSupport);
      formData.append("detailWebKpiBonus", modifiedValues.detailWebKpiBonus);
      formData.append("dateReceive", modifiedValues.dateReceive);
      formData.append("userManager", modifiedValues.userManager);
      modifiedArrayKpi.forEach((kpi, index) => {
        for (const key in kpi) {
          if (key === "condition") {
            for (const conditionKey in kpi.condition) {
              formData.append(
                `arrayKpi[${index}][condition][${conditionKey}]`,
                kpi.condition[conditionKey]
              );
            }
          } else if (key === "month") {
            formData.append(
              `arrayKpi[${index}][${key}]`,
              dateToUtcTimestamp(kpi[key])
            );
          } else {
            formData.append(`arrayKpi[${index}][${key}]`, kpi[key]);
          }
        }
      });
      file.forEach((filePath, index) => {
        formData.append(`file`, filePath);
      });
      await updateKpiBonusDomainId(domainData?._id, formData);
      onComplete();
      handleClose();
      NotifyMessage("Cập nhật thành công", "success");
    } catch (error) {
      NotifyMessage("Cập nhật thất bại thử lại sau!", "error");
    }
  });

  const handleImageUpload = (index) => {
    const arrayKpi = getValues("arrayKpi");
    if (arrayKpi[index].src || arrayKpi[index].tempBase64) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/webp";
    input.onchange = (e) => handleImageChange(e, index);
    input.click();
  };
  const handleImageChange = (e, index) => {
    const arrayKpi = getValues("arrayKpi");
    const file = e.target.files[0];
    if (
      !file ||
      !(
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp"
      )
    )
      return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      const updatedArrKpi = [...arrayKpi];
      updatedArrKpi[index].tempBase64 = base64;
      updatedArrKpi[index].src = file;
      updatedArrKpi[index].isHaveImage = true;
      setValue("arrayKpi", updatedArrKpi);
    };
    reader.readAsDataURL(file);
  };
  const handleDrop = (e, index) => {
    e.preventDefault();
    const arrayKpi = getValues("arrayKpi");
    if (arrayKpi[index].src || arrayKpi[index].tempBase64) return;
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp")
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const updatedArrKpi = [...arrayKpi];
        updatedArrKpi[index].tempBase64 = base64;
        updatedArrKpi[index].src = file;
        updatedArrKpi[index].isHaveImage = true;
        setValue("arrayKpi", updatedArrKpi);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e, index) => {
    const arrayKpi = getValues("arrayKpi");
    if (arrayKpi[index].src || arrayKpi[index].tempBase64) return;
    e.preventDefault();
  };
  const handleDeleteImage = (index) => {
    setTimeout(() => {
      const newArrKpi = [...getValues("arrayKpi")];
      newArrKpi[index].src = null;
      newArrKpi[index].tempBase64 = null;
      newArrKpi[index].isHaveImage = false;
      newArrKpi[index].isDelete = true;
      setValue("arrayKpi", newArrKpi);
    }, 100);
  };
  const statusKpi = [
    { value: "approved", label: "Duyệt" },
    { value: "rejected", label: "Từ chối" },
    { value: "peding", label: "Đang đợi duyệt" },
  ];
  return (
    <>
      <NextUIModal
        size="5xl"
        backdrop="opaque"
        isOpen={isOpen}
        onClose={!isLoading ? onClose : () => {}}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        classNames={{
          backdrop: "z-[51]",
          wrapper: "z-[52] w-full",
          base: `] !shadow-card-project !min-w-[90vw]`,
          closeButton: "right-5 z-10 text-lg",
          body: "overflow-auto ",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  Chi tiết kpi bonus
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[80vh] min-h-[55vh]">
                    <div className="w-full gap-2 flex flex-row justify-center items-start">
                      <div className="flex flex-col justify-start items-start w-[50%] gap-2 ">
                        <div className="flex flex-col justify-start items-start gap-1 w-full z-[999]">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">
                              Người quản lý
                            </p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <Select
                            placeholder="Chọn người quản lý..."
                            menuPosition="fixed"
                            className="w-full !text-sm"
                            options={listUsers?.map((user) => {
                              return {
                                value: user?._id,
                                label:
                                  user?.firstName || user?.lastName
                                    ? `${user?.firstName || ""} ${
                                        user?.lastName || ""
                                      }`
                                    : user?.name
                                    ? `${user?.name}`
                                    : "(Trống)",
                              };
                            })}
                            isSearchable={true}
                            value={listUsers
                              ?.map((user) => {
                                return {
                                  value: user?._id,
                                  label:
                                    user?.firstName || user?.lastName
                                      ? `${user?.firstName || ""} ${
                                          user?.lastName || ""
                                        }`
                                      : user?.name
                                      ? `${user?.name}`
                                      : "(Trống)",
                                };
                              })
                              .find((e) => e.value === watch("userManager"))}
                            onChange={(e) => {
                              setValue("userManager", e.value);
                            }}
                          />
                          {errors["userManager"]?.message && (
                            <div className="text-sm text-red-500">
                              {errors["userManager"]?.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-[50%] z-[998]">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Ngày nhận web</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <DateTimePicker
                          isHaveHour={false}
                          isBottom={true}
                          date={watch("dateReceive")}
                          setDate={(date) => {
                            setValue("dateReceive", date);
                          }}
                        />
                        {errors["dateReceive"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["dateReceive"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full gap-2 flex flex-row justify-center items-start">
                      <div className="flex flex-col justify-start items-start w-full gap-2">
                        <div className="flex flex-col justify-start items-start gap-1 w-full z-[997]">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">
                              Trợ lý xác nhận
                            </p>
                          </div>
                          <Select
                            placeholder="Chọn người quản lý..."
                            menuPosition="fixed"
                            className="w-full !text-sm"
                            options={listUsers?.map((user) => {
                              return {
                                value: user?._id,
                                label:
                                  user?.firstName || user?.lastName
                                    ? `${user?.firstName || ""} ${
                                        user?.lastName || ""
                                      }`
                                    : user?.name
                                    ? `${user?.name}`
                                    : "(Trống)",
                              };
                            })}
                            isSearchable={true}
                            value={listUsers
                              ?.map((user) => {
                                return {
                                  value: user?._id,
                                  label:
                                    user?.firstName || user?.lastName
                                      ? `${user?.firstName || ""} ${
                                          user?.lastName || ""
                                        }`
                                      : user?.name
                                      ? `${user?.name}`
                                      : "(Trống)",
                                };
                              })
                              .find((e) => e.value === watch("userSupport"))}
                            onChange={(e) => {
                              setValue("userSupport", e.value);
                            }}
                          />
                          {errors["userSupport"]?.message && (
                            <div className="text-sm text-red-500">
                              {errors["userSupport"]?.message}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start w-full gap-2 ">
                        <div className="flex flex-col justify-start items-start gap-1 w-full z-[996]">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">
                              Mức thưởng kpi
                            </p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          {/* <Select
                            options={listKpiBonus?.map((kpiBonus) => {
                              return {
                                value: kpiBonus?._id,
                                label: kpiBonus?.name,
                              };
                            })}
                            selectedValue={watch("detailWebKpiBonus")}
                            onSelect={(value) => {
                              setValue("detailWebKpiBonus", value);
                            }}
                            onShowValue={(value) => {
                              return listKpiBonus?.find(
                                (kpiBonus) => kpiBonus?._id === value
                              )?.name;
                            }}
                            isMutiple={false}
                          /> */}
                          <Select
                            placeholder="Chọn mức thưởng KPI..."
                            menuPosition="fixed"
                            className="w-full !text-sm"
                            options={listKpiBonus?.map((kpiBonus) => {
                              return {
                                value: kpiBonus?._id,
                                label: kpiBonus?.name,
                              };
                            })}
                            isSearchable={true}
                            value={listKpiBonus
                              ?.map((kpiBonus) => {
                                return {
                                  value: kpiBonus?._id,
                                  label: kpiBonus?.name,
                                };
                              })
                              .find(
                                (e) => e.value === watch("detailWebKpiBonus")
                              )}
                            onChange={(e) => {
                              setValue("detailWebKpiBonus", e.value);
                            }}
                          />
                          {errors["detailWebKpiBonus"]?.message && (
                            <div className="text-sm text-red-500">
                              {errors["detailWebKpiBonus"]?.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">
                          Tổ trưởng nhận xét
                        </p>
                      </div>
                      <Textarea
                        value={watch("leaderComment")}
                        onChange={(e) => {
                          setValue("leaderComment", e.target.value);
                        }}
                        placeholder="Nhập nhận xét..."
                        label=""
                        className="max-w-full w-full"
                        classNames={{
                          inputWrapper:
                            "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border",
                          input: "!text-black",
                          label: "!text-black",
                        }}
                      />
                      {errors["leaderComment"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["leaderComment"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="w-full flex flex-row justify-between items-center mb-3">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-base font-semibold">Chi tiết</p>
                        <p className="text-base text-red-600">(*)</p>
                      </div>
                      <div
                        onClick={handleAddKpi}
                        className="w-32 h-10 flex flex-row justify-center items-center rounded bg-green-500 cursor-pointer"
                      >
                        <p className="text-[15px] text-white">thêm</p>
                      </div>
                    </div>
                    <div
                      className={`flex flex-col justify-start items-start w-full  ${
                        watch("arrayKpi").length > 1 ? "gap-5" : "gap-3"
                      }`}
                    ></div>

                    {watch("arrayKpi").map((kpi, index) => (
                      <div
                        className="w-full flex flex-row justify-between items-start gap-1"
                        key={index}
                      >
                        <div className="flex flex-col justify-start items-start gap-1 w-full ">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">Keyword</p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <input
                            disabled={kpi?.review?.status !== "pending"}
                            value={kpi.keyWord}
                            onChange={(e) => {
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].keyWord = e.target.value;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                            type="text"
                            placeholder="Nhập keyword..."
                            className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                          />
                          {errors?.arrayKpi?.[index]?.keyWord && (
                            <div className="text-sm text-red-500">
                              {errors?.arrayKpi?.[index]?.keyWord.message}
                            </div>
                          )}
                        </div>
                        {/* <div className="flex flex-col justify-start items-start gap-1 w-full ">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">Volume</p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <input
                            disabled={kpi?.review?.status !== "pending"}
                            type="text"
                            placeholder="Nhập số volume..."
                            value={kpi?.condition?.volume}
                            onChange={(e) => {
                              console.log(e.target.value);
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].condition.volume =
                                e.target.value;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                            className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                          />
                          {errors?.arrayKpi?.[index]?.condition?.volume && (
                            <div className="text-sm text-red-500">
                              {
                                errors?.arrayKpi?.[index]?.condition?.volume
                                  ?.message
                              }
                            </div>
                          )}
                        </div> */}
                        <div className="flex flex-col justify-start items-start gap-1 w-full ">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">Top</p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <Select
                            isDisabled={kpi?.review?.status !== "pending"}
                            placeholder="(Trống)"
                            menuPosition="fixed"
                            className="w-full !text-sm"
                            options={listOptionTop?.map((top) => {
                              return {
                                value: top,
                                label: top,
                              };
                            })}
                            value={listOptionTop
                              ?.map((top) => {
                                return {
                                  value: top,
                                  label: top,
                                };
                              })
                              .find((e) => e.value === kpi.condition.top)}
                            onChange={(e) => {
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].condition.top = e.value;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                          />
                          {/* <input
                            disabled={kpi?.review?.status !== "pending"}
                            value={kpi.condition.top}
                            onChange={(e) => {
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].condition.top = e.target.value;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                            type="text"
                            placeholder="Nhập số top..."
                            className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                          /> */}
                          {errors?.arrayKpi?.[index]?.condition?.top && (
                            <div className="text-sm text-red-500">
                              {
                                errors?.arrayKpi?.[index]?.condition?.top
                                  ?.message
                              }
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1 w-full ">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">Khách hàng</p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <input
                            disabled={kpi?.review?.status !== "pending"}
                            value={kpi?.condition.customer}
                            onChange={(e) => {
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].condition.customer =
                                e.target.value;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                            type="text"
                            placeholder="Nhập số khách hàng..."
                            className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                          />
                          {errors?.arrayKpi?.[index]?.condition?.customer && (
                            <div className="text-sm text-red-500">
                              {
                                errors?.arrayKpi?.[index]?.condition?.customer
                                  .message
                              }
                            </div>
                          )}
                        </div>
                        {/* <div className="flex flex-col justify-start items-start gap-1 w-full ">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">Thưởng</p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <input
                            disabled={kpi?.review?.status !== "pending"}
                            value={kpi.condition.totalDeposit}
                            onChange={(e) => {
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].condition.totalDeposit =
                                e.target.value;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                            type="text"
                            placeholder="Nhập thưởng..."
                            className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                          />
                          {errors?.arrayKpi?.[index]?.condition
                            ?.totalDeposit && (
                            <div className="text-sm text-red-500">
                              {
                                errors?.arrayKpi?.[index]?.condition
                                  ?.totalDeposit?.message
                              }
                            </div>
                          )}
                        </div> */}
                        <div className="flex flex-col justify-start items-start gap-1 w-full z-[9999]">
                          <div className="flex flex-row justify-center items-center gap-1">
                            <p className="text-sm font-semibold">Tháng</p>
                            <p className="text-sm text-red-600">(*)</p>
                          </div>
                          <MonthPicker
                            isDisable={kpi?.review?.status !== "pending"}
                            isHaveHour={false}
                            isBottom={false}
                            date={kpi.month}
                            setDate={(date) => {
                              const newArrayKpi = [...getValues("arrayKpi")];
                              newArrayKpi[index].month = date;
                              setValue("arrayKpi", newArrayKpi);
                            }}
                          />
                          {errors?.arrayKpi?.[index]?.month && (
                            <div className="text-sm text-red-500">
                              {errors?.arrayKpi?.[index]?.month?.message}
                            </div>
                          )}
                        </div>
                        {kpi._id &&
                          (kpi?.review?.status === "pending" ? (
                            <>
                              <div className="flex flex-col justify-start items-start gap-3 px-2 min-w-32">
                                <div className="flex flex-row justify-center items-center gap-1">
                                  <p className="text-sm font-semibold min-w-[85px]">
                                    Hành động
                                  </p>
                                </div>
                                <div className="flex flex-row justify-center items-center gap-2">
                                  <div className="flex flex-row justify-start items-center">
                                    <Button
                                      p={0}
                                      minW={"30px"}
                                      h={"30px"}
                                      borderRadius={"full"}
                                      color={"white"}
                                      _hover={{
                                        bg: "green.400",
                                      }}
                                      bg={"#47c732"}
                                      onClick={() => {
                                        setIsOpenModalReject(
                                          !isOpenModalReject
                                        );
                                        setIsApprove(true);
                                        setIndexKpi(index);
                                        setStatusKpiOnComplete("approved");
                                      }}
                                    >
                                      <MdOutlineDone />
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setIsOpenModalReject(
                                          !isOpenModalReject
                                        );
                                        setIsApprove(false);
                                        setIndexKpi(index);
                                        setStatusKpiOnComplete("rejected");
                                      }}
                                    >
                                      <MdOutlineClear />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-col justify-start items-start gap-1 w-full ">
                                <div className="flex flex-row justify-center items-center gap-1">
                                  <p className="text-sm font-semibold">
                                    Trạng thái
                                  </p>
                                </div>
                                <input
                                  disabled={true}
                                  value={
                                    statusKpi.find(
                                      (e) => e.value === kpi?.review?.status
                                    )?.label ?? "Đang đợi duyệt"
                                  }
                                  type="text"
                                  className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                                />
                              </div>
                            </>
                          ))}
                        <div
                          key={index}
                          onClick={() => {
                            if (!kpi.tempBase64) {
                              handleImageUpload(index);
                            }
                          }}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          className={`w-[80%] border-1 border-gray-400 rounded flex flex-col justify-center items-center ${
                            !kpi.tempBase64 && "py-2"
                          }  cursor-pointer relative`}
                        >
                          {/* Ảnh được chọn hoặc được kéo thả */}
                          {kpi.tempBase64 && (
                            <img
                              src={kpi.tempBase64} // Hiển thị ảnh được chọn hoặc được kéo thả
                              alt="Ảnh đại diện"
                              className=" max-w-full max-h-full"
                            />
                          )}
                          {kpi.tempBase64 &&
                            kpi?.review?.status === "pending" && (
                              <>
                                <div
                                  className="absolute top-[0] right-0 transform translate-x-1/2 -translate-y-1/2"
                                  onClick={() => handleDeleteImage(index)}
                                >
                                  <IoCloseCircleSharp size={27} />
                                </div>
                              </>
                            )}
                          {/* Nếu không có ảnh, hiển thị thông báo */}
                          {!kpi.tempBase64 && (
                            <>
                              <img
                                src="/upload-file.png"
                                alt="Tải ảnh đại diện của bạn ở đây"
                                className="w-[50%] h-[50%]"
                              />
                              <p className="text-sm"> kéo thả ảnh vào đây.</p>
                            </>
                          )}
                        </div>
                        {watch("arrayKpi").length > 1 && (
                          <div className="self-center">
                            <div
                              className="ml-2 px-1 py-1 text-center cursor-pointer  flex-row justify-center items-center justify-content-center align-items-center gap-flex-1 rounded bg-danger text-white  mb-delete-btn"
                              onClick={() => handleRemoveKpi(index)}
                            >
                              <MdDelete size={23} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ButtonNextUi
                    type="submit"
                    radius="sm"
                    color="primary"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onClick={() => {
                      console.log(errors);
                    }}
                  >
                    Xác nhận
                  </ButtonNextUi>
                  <ButtonNextUi
                    radius="sm"
                    color="danger"
                    variant="solid"
                    className="bg-danger-400"
                    onPress={onClose}
                    isDisabled={isLoading}
                  >
                    Hủy
                  </ButtonNextUi>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </NextUIModal>
      <ModalRejectKpi
        isOpen={isOpenModalReject}
        onClose={() => {
          setIsOpenModalReject(!isOpenModalReject);
        }}
        indexKpi={indexKpi}
        domainId={domainData._id}
        onComplete={handleonCompleteKpi}
        isApprove={isApprove}
      />
    </>
  );
}
ModalAddKpiBonus.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  domainData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};
export default ModalAddKpiBonus;

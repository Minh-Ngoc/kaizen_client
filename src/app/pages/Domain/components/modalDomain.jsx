import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useEffect } from "react";
import DateTimePicker from "../../../components/DateTimePicker/index";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { createDomain, updateDomain } from "services/api.service";
import NotifyMessage from "_utils/notify";
import { getAllBrands } from "_redux/slice/brandSlice";
import { getAllTeams } from "_redux/slice/teamSlice";
import { dateToUtcTimestamp, GetDateExactTime } from "_utils";
import { userAction } from "_redux/slice/user.slice";
import { Textarea } from "@nextui-org/react";
import Select from "react-select";
function ModalDomain({ isOpen, onClose, isAdd, domainData, onComplete }) {
  const dispatch = useDispatch();
  const domainSchema = yup.object({
    domainName: yup.string().required("Tên domain không được để trống"),
    isCalculateKpi: yup.bool(),
    team: yup.string().required("Team được để trống"),
    statusDomain: yup.string().nullable(),
    brand: yup.string().required("Thương hiệu không được để trống"),
    dateOut: yup.date().nullable(),
    LinkBrand: yup.string().nullable(),
    codeBrand: yup.string().nullable(),
    userManager: yup.string().nullable(),
    userSupport: yup.string().nullable(),
    note: yup.string().nullable(),
  });
  useEffect(() => {
    if (!isAdd) {
      setValue("domainName", domainData?.domainName ?? "");
      setValue("isCalculateKpi", domainData?.isCalculateKpi ?? false);
      setValue("team", domainData?.team?._id ?? "");
      setValue("statusDomain", domainData?.statusDomain ?? "");
      setValue("brand", domainData?.brand?._id ?? "");
      setValue("LinkBrand", domainData?.LinkBrand ?? "");
      setValue("codeBrand", domainData?.codeBrand ?? "");
      setValue("userManager", domainData?.userManager?._id ?? "");
      setValue("userSupport", domainData?.userSupport?._id ?? "");
      setValue(
        "dateOut",
        domainData?.dateOut ? GetDateExactTime(domainData?.dateOut) : null
      );
      setValue("note", domainData?.note ?? "");
    } else {
      reset();
    }
  }, [isOpen]);
  const listTeams = useSelector((state) => state.team.listTeam);
  const listBrands = useSelector((state) => state.brand.listBrands);
  const listUsers = useSelector((state) => state.user.listUserGetAll);
  useEffect(() => {
    if (!listBrands?.length) dispatch(getAllBrands());
    if (!listTeams?.length) dispatch(getAllTeams());
    if (!listUsers?.length) dispatch(userAction?.GetAllUser());
  }, []);
  const handleClose = () => {
    reset();
    onClose();
  };

  const {
    handleSubmit,
    reset,

    watch,

    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      domainName: "",
      isCalculateKpi: false,
      team: "",
      statusDomain: "",
      brand: "",
      dateOut: null,
      LinkBrand: "",
      codeBrand: "",
      userManager: "",
      userSupport: "",
      note: "",
    },
    resolver: yupResolver(domainSchema),
  });
  //   const handleImageUpload = () => {
  //     if (watch("avatar") || base64Img) return;
  //     const input = document.createElement("input");
  //     input.type = "file";
  //     input.accept = "image/jpeg, image/png, image/webp";
  //     input.onchange = (e) => handleImageChange(e);
  //     input.click();
  //   };
  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (
  //       file &&
  //       (file.type === "image/jpeg" ||
  //         file.type === "image/png" ||
  //         file.type === "image/webp")
  //     ) {
  //       setValue("avatar", file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setBase64Img(reader.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };
  //   const handleClearImage = () => {
  //     setTimeout(() => {
  //       setBase64Img("");
  //       setValue("avatar", "");
  //     }, 0);
  //   };
  //   const handleDrop = (e) => {
  //     e.preventDefault();
  //     if (watch("avatar") || base64Img) return;
  //     const file = e.dataTransfer.files[0];
  //     if (
  //       file &&
  //       (file.type === "image/jpeg" ||
  //         file.type === "image/png" ||
  //         file.type === "image/webp")
  //     ) {
  //       setValue("avatar", file);
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setBase64Img(reader.result);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  //   const handleDragOver = (e) => {
  //     if (watch("avatar") || base64Img) return;
  //     e.preventDefault();
  //   };
  //   const handleClose = () => {
  //     reset();
  //     setBase64Img("");
  //     onClose();
  //   };
  const onSubmit = handleSubmit(async (values) => {
    let cleanedValues = values;
    if (cleanedValues.statusDomain === "") {
      delete cleanedValues.statusDomain;
    }
    if (isAdd) {
      try {
        await createDomain({
          ...cleanedValues,
          dateOut: cleanedValues.dateOut
            ? dateToUtcTimestamp(cleanedValues.dateOut)
            : null,
        });
        onComplete();
        handleClose();
        NotifyMessage("Thêm mới domain thành công", "success");
      } catch (error) {
        NotifyMessage("Thêm mới thất bại vui lòng thử lại sau", "error");
      }
    } else {
      try {
        await updateDomain(domainData?._id, {
          ...cleanedValues,
          dateOut: cleanedValues.dateOut
            ? dateToUtcTimestamp(cleanedValues.dateOut)
            : null,
        });
        onComplete();
        handleClose();
        NotifyMessage("Chỉnh sửa domain thành công", "success");
      } catch (error) {
        NotifyMessage("Cập nhật thất bại vui lòng thử lại sau", "error");
      }
    }
  });
  const statusDomain = [
    { value: "web-train", label: "Web đào tạo" },
    { value: "satellite", label: "Vệ tinh" },
    { value: "pause", label: "Tạm ngưng" },
    { value: "seo", label: "SEO" },
    { value: "pbn", label: "PBN" },
    { value: "do-not-use", label: "Không sử dụng" },
    { value: "301", label: "301" },
    { value: "for-assistant", label: "Cho trợ lý" },
    { value: "brand", label: "Hậu đài" },
    { value: "back-up", label: "Backup" },
    { value: "cdn", label: "CDN" },
  ];

  return (
    <>
      <NextUIModal
        size="5xl"
        backdrop="opaque"
        isOpen={isOpen}
        onClose={handleClose}
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
          base: `] !shadow-card-project min-w-[40%] `,
          closeButton: "right-5 z-10 text-lg",
          body: "overflow-auto",
        }}
      >
        <form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  {isAdd ? "Thêm mới" : "Chỉnh Sửa"} Domain
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh] min-h-[50vh]">
                    <div className="flex flex-row justify-center items-center w-full gap-2 ">
                      <div className="flex flex-col justify-start items-start gap-1 w-full ">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Tên domain</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <input
                          value={watch("domainName")}
                          onChange={(e) => {
                            setValue("domainName", e.target.value);
                          }}
                          type="text"
                          placeholder="Nhập tên domain..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                        {errors["domainName"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["domainName"]?.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">
                            Tính Kpi Bonus
                          </p>
                        </div>
                        <Switch
                          isSelected={watch("isCalculateKpi")}
                          onValueChange={(e) => {
                            setValue(
                              "isCalculateKpi",
                              !watch("isCalculateKpi")
                            );
                          }}
                        >
                          {watch("isCalculateKpi") ? (
                            <p className="text-sm">Tính</p>
                          ) : (
                            <p className="text-sm">Không tính</p>
                          )}
                        </Switch>
                      </div>
                    </div>

                    <div className="flex flex-row justify-center items-center w-full gap-2 ">
                      <div className="flex flex-col justify-start items-start gap-1 w-full ">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Team</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <Select
                          placeholder="Chọn team..."
                          menuPosition="fixed"
                          className="w-full !text-sm"
                          options={listTeams?.map((team) => {
                            return {
                              value: team?._id,
                              label: team?.name,
                            };
                          })}
                          isSearchable={true}
                          value={listTeams
                            ?.map((team) => {
                              return {
                                value: team?._id,
                                label: team?.name,
                              };
                            })
                            .find((e) => e.value === watch("team"))}
                          onChange={(e) => {
                            setValue("team", e.value);
                          }}
                        />
                        {errors["team"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["team"]?.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full z-[9999]">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Trạng thái</p>
                        </div>
                        <Select
                          placeholder="Chọn trạng thái dommain..."
                          menuPosition="fixed"
                          className="w-full !text-sm"
                          options={statusDomain?.map((status) => {
                            return {
                              value: status?.value,
                              label: status?.label,
                            };
                          })}
                          value={statusDomain
                            ?.map((status) => {
                              return {
                                value: status?.value,
                                label: status?.label,
                              };
                            })
                            .find((e) => e.value === watch("statusDomain"))}
                          onChange={(e) => {
                            setValue("statusDomain", e.value);
                          }}
                        />
                        {errors["statusDomain"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["statusDomain"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-full gap-2 ">
                      <div className="flex flex-col justify-start items-start gap-1 w-full ">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Brand</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <Select
                          placeholder="Chọn brand..."
                          menuPosition="fixed"
                          className="w-full !text-sm"
                          options={listBrands?.map((brand) => {
                            return {
                              value: brand?._id,
                              label: brand?.name,
                            };
                          })}
                          isSearchable={true}
                          value={listBrands
                            ?.map((brand) => {
                              return {
                                value: brand?._id,
                                label: brand?.name,
                              };
                            })
                            .find((e) => e.value === watch("brand"))}
                          onChange={(e) => {
                            setValue("brand", e.value);
                          }}
                        />
                        {errors["brand"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["brand"]?.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full z-[9998]">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Ngày hết hạn</p>
                        </div>
                        <DateTimePicker
                          isHaveHour={false}
                          isBottom={true}
                          date={watch("dateOut")}
                          setDate={(date) => {
                            setValue("dateOut", date);
                          }}
                        />
                        {/* <DatePicker
                          value={watch("dateOut")}
                          onChange={(date) => {
                            setValue("dateOut", date);
                          }}
                        /> */}
                        {errors["dateOut"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["dateOut"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-full gap-2 ">
                      <div className="flex flex-col justify-start items-start gap-1 w-full ">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Link hậu đài</p>
                        </div>
                        <input
                          value={watch("LinkBrand")}
                          onChange={(e) => {
                            setValue("LinkBrand", e.target.value);
                          }}
                          type="text"
                          placeholder="Nhập link hậu đài..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                        {errors["LinkBrand"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["LinkBrand"]?.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full ">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Mã hậu đài</p>
                        </div>
                        <input
                          value={watch("codeBrand")}
                          onChange={(e) => {
                            setValue("codeBrand", e.target.value);
                          }}
                          type="text"
                          placeholder="Nhập mã hậu đài..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                        {errors["codeBrand"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["codeBrand"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-full gap-2 ">
                      <div className="flex flex-col justify-start items-start gap-1 w-full ">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Người quản lý</p>
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
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Người hổ trợ</p>
                        </div>
                        <Select
                          placeholder="Chọn người hổ trợ..."
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
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Ghi chú</p>
                      </div>
                      {/* <input
                        value={watch("note")}
                        onChange={(e) => {
                          setValue("note", e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập ghi chú..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      /> */}
                      <Textarea
                        value={watch("note")}
                        onChange={(e) => {
                          setValue("note", e.target.value);
                        }}
                        placeholder="Nhập nhận xét..."
                        label=""
                        className="max-w-full w-full"
                        classNames={{
                          inputWrapper:
                            "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border ",
                          input: "!text-black",
                          label: "!text-black",
                        }}
                      />
                      {errors["note"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["note"]?.message}
                        </div>
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" radius="sm" color="primary">
                    Xác nhận
                  </Button>
                  <Button
                    radius="sm"
                    color="danger"
                    variant="solid"
                    className="bg-danger-400"
                    onPress={onClose}
                  >
                    Hủy
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </NextUIModal>
    </>
  );
}
ModalDomain.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  isAdd: PropTypes.bool.isRequired,
  domainData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};
export default ModalDomain;

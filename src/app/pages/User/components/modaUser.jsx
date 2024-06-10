import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { VscChromeClose } from "react-icons/vsc";
import DateTimePicker from "../../../components/DateTimePicker/index";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { departmentAction } from "../../../../_redux/slice/departmentSlice";
import { createUser, updateUserById } from "services/api.service";
import NotifyMessage from "_utils/notify";
import { URL_IMAGE } from "_constants";
import { dateToUtcTimestamp, GetDateExactTime } from "_utils";
import { rankList } from "_constants";
import { Textarea } from "@nextui-org/react";
import { getAllTeams } from "_redux/slice/teamSlice";
import Select from "react-select";
function ModalUser({ isOpen, onClose, isAdd, userDate, onComplete }) {
  const dispatch = useDispatch();
  const [base64Img, setBase64Img] = useState("");
  const listRole = useSelector((state) => state.role.listRole);
  const listTeam = useSelector((state) => state.team.listTeam);
  const listDepartment = useSelector(
    (state) => state.department.listDepartment
  );
  const userSchema = yup.object({
    username: yup.string().required("Tên người dùng không được để trống"),
    password: !isAdd
      ? null
      : yup
          .string()
          .required("Mật khẩu không được để trống")
          .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
    name: yup.string().required("Họ không được để trống"),
    phoneNumber: yup
      .string()
      .test("phoneNumber", "Số điện thoại không hợp lệ", (value) =>
        value ? /^[0-9]{10}$/.test(value) : true
      ),
    department: yup.string().nullable(),
    role: yup.string().required("Vai trò không được để trống"),
    team: yup.mixed().nullable(),
    birthday: yup.date().nullable(),
    avatar: yup.mixed().nullable(),
    rank: yup.string().nullable(),
    bio: yup.string().nullable(),
  });

  useEffect(() => {
    if (!isAdd) {
      setBase64Img(userDate?.avatar ? URL_IMAGE + "/" + userDate?.avatar : "");
      setValue("avatar", userDate?.avatar ?? "");
      setValue(
        "birthday",
        userDate?.birthday ? GetDateExactTime(userDate?.birthday) : null
      );
      setValue("department", userDate?.department?._id ?? "");
      setValue("name", userDate?.name ?? "");
      setValue("phoneNumber", userDate?.phoneNumber ?? "");
      setValue("role", userDate?.role?._id ?? "");
      setValue("team", userDate?.team?.map((te) => te?._id) ?? []);
      setValue("username", userDate?.username ?? "");
      setValue("rank", userDate?.rank ?? "");
      setValue("bio", userDate?.bio ?? "");
    } else {
      reset();
      setBase64Img("");
    }
  }, [isOpen]);
  useEffect(() => {
    if (!listDepartment?.length) dispatch(departmentAction.getAllDepart());
    if (!listTeam?.length) dispatch(getAllTeams());
  }, []);

  const {
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      name: "",
      phoneNumber: "",
      department: "",
      role: "",
      team: [],
      birthday: null,
      avatar: "",
      rank: "",
      bio: "",
    },
    resolver: yupResolver(userSchema),
  });
  const handleImageUpload = () => {
    if (watch("avatar") || base64Img) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg, image/png, image/webp";
    input.onchange = (e) => handleImageChange(e);
    input.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp")
    ) {
      setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Img(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClearImage = () => {
    setTimeout(() => {
      setBase64Img("");
      setValue("avatar", "");
    }, 0);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    if (watch("avatar") || base64Img) return;
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp")
    ) {
      setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Img(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    if (watch("avatar") || base64Img) return;
    e.preventDefault();
  };
  const handleClose = () => {
    reset();
    setBase64Img("");
    onClose();
  };
  const onSubmit = handleSubmit(async (values) => {
    console.log(values.team);
    if (isAdd) {
      try {
        await createUser({
          ...values,
          birthday: values.birthday
            ? dateToUtcTimestamp(values.birthday)
            : null,
        });
        onComplete();
        handleClose();
        NotifyMessage("Thêm mới người dùng thành công", "success");
      } catch (error) {
        if (error?.response?.data?.status === 3) {
          NotifyMessage("Tên người dùng đã tồn tại", "error");
          setError("username", { message: "Tên người dùng đã tồn tại" });
        } else if (error?.response?.data?.status === 9) {
          NotifyMessage(
            "Vai trò không tồn tại vui lòng tải lại trang",
            "error"
          );
        } else if (error?.response?.data?.status === 8) {
          NotifyMessage(
            "Phòng ban không tồn tại vui lòng tải lại trang",
            "error"
          );
        } else {
          NotifyMessage("Thêm mới thất bại vui lòng thử lại sau", "error");
        }
      }
    } else {
      try {
        const tempValues = values;
        delete tempValues?.password;
        await updateUserById(userDate?._id, {
          ...tempValues,
          birthday: values.birthday
            ? dateToUtcTimestamp(values.birthday)
            : null,
        });
        onComplete();
        handleClose();
        NotifyMessage("Chỉnh sửa người dùng thành công", "success");
      } catch (error) {
        if (error?.response?.data?.status === 3) {
          NotifyMessage("Tên người dùng đã tồn tại", "error");
          setError("username", { message: "Tên người dùng đã tồn tại" });
        } else if (error?.response?.data?.status === 9) {
          NotifyMessage(
            "Vai trò không tồn tại vui lòng tải lại trang",
            "error"
          );
        } else if (error?.response?.data?.status === 8) {
          NotifyMessage(
            "Phòng ban không tồn tại vui lòng tải lại trang",
            "error"
          );
        } else {
          NotifyMessage("Cập nhật thất bại vui lòng thử lại sau", "error");
        }
      }
    }
  });
  console.log(watch("team"));
  return (
    <>
      <NextUIModal
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
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  {isAdd ? "Thêm mới" : "Chỉnh Sửa"} Người Dùng
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 min-h-[60vh] max-h-[80vh]">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tên đăng nhập</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={watch("username")}
                        onChange={(e) => {
                          setValue("username", e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập tên đăng nhập của người dùng ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {errors["username"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["username"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row justify-between items-start gap-2 w-full">
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Họ và tên</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <input
                          value={watch("name")}
                          onChange={(e) => {
                            setValue("name", e.target.value);
                          }}
                          type="text"
                          placeholder="Nhập họ và tên người dùng ..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                        {errors["name"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["name"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    {isAdd && (
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Mật khẩu</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <input
                          value={watch("password")}
                          onChange={(e) => {
                            setValue("password", e.target.value);
                          }}
                          type="password"
                          placeholder="Nhập mật khẩu ..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                        {errors["password"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["password"]?.message}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <p className="text-sm font-semibold">Số điện thoại</p>
                      <input
                        value={watch("phoneNumber")}
                        onChange={(e) => {
                          setValue("phoneNumber", e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập số điện thoại ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {errors["phoneNumber"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["phoneNumber"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row justify-between items-start gap-2 w-full">
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Phòng ban</p>
                        </div>
                        <Select
                          placeholder="Chọn phòng ban..."
                          menuPosition="fixed"
                          className="w-full !text-sm"
                          options={listDepartment?.map((department) => {
                            return {
                              value: department?._id,
                              label: department?.name,
                            };
                          })}
                          isSearchable={true}
                          value={listDepartment
                            ?.map((department) => {
                              return {
                                value: department?._id,
                                label: department?.name,
                              };
                            })
                            .find((e) => e.value === watch("department"))}
                          onChange={(e) => {
                            setValue("department", e.value);
                          }}
                        />
                        {errors["department"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["department"]?.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Team</p>
                        </div>
                        <Select
                          placeholder="Chọn team..."
                          menuPosition="fixed"
                          className="w-full !text-sm"
                          options={listTeam?.map((team) => {
                            return {
                              value: team?._id,
                              label: team?.name,
                            };
                          })}
                          isSearchable={true}
                          value={listTeam
                            ?.map((team) => {
                              return {
                                value: team?._id,
                                label: team?.name,
                              };
                            })
                            .filter((e) => watch("team").includes(e.value))}
                          onChange={(e) => {
                            setValue(
                              "team",
                              e?.map((e) => e?.value)
                            );
                          }}
                          isMulti
                        />
                        {errors["team"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["team"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Thứ hạng</p>
                      </div>
                      <Select
                        placeholder="Chọn hạng..."
                        menuPosition="fixed"
                        className="w-full !text-sm"
                        options={rankList?.map((rank) => {
                          return {
                            value: rank?.value,
                            label: rank?.label,
                          };
                        })}
                        isSearchable={true}
                        value={rankList
                          ?.map((rank) => {
                            return {
                              value: rank?.value,
                              label: rank?.label,
                            };
                          })
                          .find((e) => e.value === watch("rank"))}
                        onChange={(e) => {
                          setValue("rank", e.value);
                        }}
                      />
                      {errors["rank"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["rank"]?.message}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row justify-between items-start gap-2 w-full">
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Vai trò</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <Select
                          placeholder="Chọn vai trò..."
                          menuPosition="fixed"
                          className="w-full !text-sm"
                          options={listRole?.map((role) => {
                            return { value: role?._id, label: role?.name };
                          })}
                          isSearchable={true}
                          value={listRole
                            ?.map((role) => {
                              return { value: role?._id, label: role?.name };
                            })
                            .find((e) => e.value === watch("role"))}
                          onChange={(e) => {
                            setValue("role", e.value);
                          }}
                          // options={listRole?.map((role) => {
                          //   return { value: role?._id, label: role?.name };
                          // })}
                          // selectedValue={watch("role")}
                          // onSelect={(value) => {
                          //   setValue("role", value);
                          // }}
                          // onShowValue={(value) => {
                          //   return listRole?.find((role) => role?._id === value)
                          //     ?.name;
                          // }}
                          // isMutiple={false}
                        />
                        {errors["role"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["role"]?.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">
                            Ngày hoạt động
                          </p>
                        </div>

                        <DateTimePicker
                          isHaveHour={false}
                          date={watch("birthday")}
                          setDate={(date) => {
                            setValue("birthday", date);
                          }}
                        />
                        {errors["birthday"]?.message && (
                          <div className="text-sm text-red-500">
                            {errors["birthday"]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-start gap-2 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tiểu sử</p>
                      </div>
                      <Textarea
                        label={""}
                        placeholder={"Nhập tiểu sử người dùng..."}
                        value={watch("bio")}
                        onValueChange={(value) => {
                          setValue("bio", value);
                        }}
                        className="max-w-full w-full"
                        classNames={{
                          base: "!rounded",
                          inputWrapper:
                            "!rounded border-gray-300 bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border ",
                          input: "!text-black !text-[15px]",
                          label: "!text-black",
                        }}
                      />
                      {errors["bio"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["bio"]?.message}
                        </div>
                      )}
                    </div>

                    <div className="w-full mt-3 flex justify-center items-center flex-col max-h-40">
                      <div className="w-full flex justify-start items-center py-2">
                        <p className="text-sm font-semibold">Ảnh đại diện</p>
                      </div>
                      <div
                        className={` w-full flex flex-column gap-flex-1 justify-center items-center${
                          watch("avatar") || base64Img
                            ? ""
                            : "py-4 border-dashed border-gray-300 rounded"
                        } border-1  `}
                      >
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={() => {
                            handleImageUpload();
                          }}
                          id="user-image"
                          className="h-32 w-full flex flex-col justify-center items-center relative"
                          style={{
                            backgroundImage:
                              watch("avatar") || base64Img
                                ? `url(${base64Img})`
                                : "",
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          <img
                            style={{
                              display:
                                watch("avatar") || base64Img ? "none" : "block",
                            }}
                            src="/upload-file.png"
                            alt="Tải ảnh đại diện của bạn ở đây"
                            className="w-24 h-20"
                          />
                          <p
                            style={{
                              display:
                                watch("avatar") || base64Img ? "none" : "block",
                            }}
                            className="pt-2 text-base font-medium"
                          >
                            Click hoặc kéo thả ảnh vào đây.
                          </p>
                          {(watch("avatar") || base64Img) && (
                            <VscChromeClose
                              size={25}
                              onClick={() => handleClearImage()}
                              className="close-btn"
                            />
                          )}
                        </div>
                      </div>
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
              </form>
            </>
          )}
        </ModalContent>
      </NextUIModal>
    </>
  );
}
ModalUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  isAdd: PropTypes.bool.isRequired,
  userDate: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};
export default ModalUser;

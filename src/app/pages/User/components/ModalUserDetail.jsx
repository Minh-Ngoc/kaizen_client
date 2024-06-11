import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { rankList } from "_constants";
import { Textarea } from "@nextui-org/react";
import { URL_IMAGE } from "_constants";
import moment from "moment";
function ModalUserDetail({ isOpen, onClose, userDate }) {
  return (
    <>
      <NextUIModal
        backdrop="opaque"
        isOpen={isOpen}
        onClose={onClose}
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
              <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                Thông Tin Người Dùng
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col justify-start items-start w-full gap-2 min-h-[60vh] max-h-[80vh]">
                  <div className="flex flex-col justify-start items-start gap-1 w-full">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="text-sm font-semibold">Tên đăng nhập</p>
                      <p className="text-sm text-red-600">(*)</p>
                    </div>
                    <input
                      disabled={true}
                      value={userDate?.username ?? "(Trống)"}
                      type="text"
                      placeholder="Nhập tên đăng nhập của người dùng ..."
                      className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-start gap-2 w-full">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Họ và tên</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={
                          userDate?.firstName || userDate?.lastName
                            ? `${userDate?.firstName || ""} ${
                                userDate?.lastName || ""
                              }`
                            : userDate?.name
                            ? `${userDate?.name}`
                            : "(Trống)"
                        }
                        disabled={true}
                        type="text"
                        placeholder="Nhập họ và tên người dùng ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-start gap-1 w-full">
                    <p className="text-sm font-semibold">Số điện thoại</p>
                    <input
                      disabled={true}
                      value={userDate?.phoneNumber ?? "(Trống)"}
                      type="text"
                      placeholder="Nhập số điện thoại ..."
                      className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                    />
                  </div>
                  <div className="flex flex-row justify-between items-start gap-2 w-full">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Phòng ban</p>
                      </div>
                      <input
                        disabled={true}
                        value={userDate?.department?.name ?? "(Trống)"}
                        type="text"
                        placeholder="Nhập số điện thoại ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Team</p>
                      </div>
                      <input
                        disabled={true}
                        value={
                          userDate?.team?.length !== 0
                            ? userDate?.team?.reduce((acc, team, index) => {
                                if (index !== 0) acc += ", ";
                                acc += team?.name;
                                return acc;
                              }, "")
                            : "(Trống)"
                        }
                        type="text"
                        placeholder="(Trống)"
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1 w-full">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="text-sm font-semibold">Thứ hạng</p>
                    </div>
                    <input
                      disabled={true}
                      value={
                        rankList.find((rank) => rank.value === userDate?.rank)
                          ?.label ?? "(Trống)"
                      }
                      type="text"
                      placeholder="Nhập số điện thoại ..."
                      className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                    />
                  </div>

                  <div className="flex flex-row justify-between items-start gap-2 w-full">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Vai trò</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        disabled={true}
                        value={userDate?.role?.name ?? "(Trống)"}
                        type="text"
                        placeholder="Nhập số điện thoại ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Ngày hoạt động</p>
                      </div>
                      <input
                        disabled={true}
                        value={
                          moment(userDate?.birthday).format("DD/MM/yyyy") ??
                          "(Trống)"
                        }
                        type="text"
                        placeholder="Nhập số điện thoại ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {/* <DateTimePicker
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
                      )} */}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start gap-2 w-full">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="text-sm font-semibold">Tiểu sử</p>
                    </div>
                    <Textarea
                      label={""}
                      placeholder={"(Trống)"}
                      value={userDate?.bio}
                      disabled={true}
                      className="max-w-full w-full"
                      classNames={{
                        base: "!rounded",
                        inputWrapper:
                          "!rounded border-gray-300 bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border ",
                        input: "!text-black !text-[15px]",
                        label: "!text-black",
                      }}
                    />
                  </div>

                  <div className="w-full mt-3  flex justify-center items-center flex-col max-h-40">
                    <div className="w-full flex justify-start items-center py-2">
                      <p className="text-sm font-semibold">Ảnh đại diện</p>
                    </div>
                    <div
                      className={`min-h-40 w-full flex flex-column gap-flex-1 justify-center items-center
                         border-dashed border-gray-300 rounded
                       border-1  `}
                    >
                      {userDate?.avatar ? (
                        <img
                          src={URL_IMAGE + "/" + userDate?.avatar}
                          id="user-image"
                          className="h-full max-h-40 w-auto flex flex-col justify-center items-center relative"
                        />
                      ) : (
                        <p className="pt-2 text-base font-medium  text-center">
                          Không có ảnh đại diện
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
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
      </NextUIModal>
    </>
  );
}
ModalUserDetail.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  userDate: PropTypes.object.isRequired,
};
export default ModalUserDetail;

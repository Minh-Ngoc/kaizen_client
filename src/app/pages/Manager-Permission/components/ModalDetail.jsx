import PropTypes from "prop-types";
import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { deleteDepartmentById } from "../../../../services/api.service";
import NotifyMessage from "_utils/notify";
import { GoShieldCheck } from "react-icons/go";
import { GoShieldX } from "react-icons/go";
import { getDetailPermissionByRoleId } from "../../../../services/api.service";
import { titleRole, defaultRole } from "_utils/variable";
function ModalDetailPermission({
  isOpen,
  onClose,
  onComplete,
  permissionData,
}) {
  const [roles, setRoles] = useState(JSON.parse(JSON.stringify(defaultRole)));
  const handleOnComplete = () => {
    if (isLoading) return;
    onClose();
  };
  const handleGetDetail = async () => {
    if (!permissionData?._id || !isOpen) return;
    try {
      const res = await getDetailPermissionByRoleId(permissionData._id);

      const data = res?.data?.data;
      const newRoles = JSON.parse(JSON.stringify(defaultRole));

      for (let i = 0; i < data.length; i++) {
        const { subject, action } = data[i];
        if (subject === "all") {
          Object.keys(newRoles).forEach((subj) => {
            Object.keys(newRoles[subj]).forEach((act) => {
              newRoles[subj][act] = true;
            });
          });
          break;
        } else if (subject && newRoles[subject]) {
          if (action.includes("manage")) {
            Object.keys(newRoles[subject]).forEach((act) => {
              newRoles[subject][act] = true;
            });
          } else {
            action.forEach((act) => {
              if (newRoles[subject][act] !== undefined) {
                newRoles[subject][act] = true;
              }
            });
          }
        }
      }
      setRoles(newRoles);
    } catch (error) {
      NotifyMessage(
        "Không thể lấy chi tiết quyền hạn, vui lòng thử lại sau!",
        "error"
      );
    }
  };
  useEffect(() => {
    handleGetDetail();
  }, [isOpen]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <NextUIModal
        backdrop="opaque"
        isOpen={isOpen}
        onClose={handleOnComplete}
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
              <form onSubmit={() => {}}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  Chi tiết phân quyền
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh] shadow-sm px-3 py-4 rounded">
                    <div className="w-full px-4">
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Tên Quyền hạn</p>
                        </div>
                        <input
                          disabled={true}
                          name="role-name"
                          value={permissionData?.name}
                          type="text"
                          placeholder="Tên quyền hạn..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                      </div>
                    </div>
                    <div className="w-full p-3 rounded-md shadow-sm">
                      <div className="w-full rounded-md px-2 flex flex-row justify-between items-center">
                        <p className="font-semibold truncate w-[40%]">
                          Tên phân quyền
                        </p>
                        <div className=" flex flex-row justify-between items-center w-[60%]">
                          <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                            Xem
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                            Thêm
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                            Xóa
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                            Sửa
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                            Tất cả
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-6 w-full mt-4 ">
                      {Object.keys(roles).map((role) => {
                        return (
                          <>
                            <div className="w-full px-3 rounded-md">
                              <div className="w-full rounded-md px-2 flex flex-row justify-between items-center">
                                <p className="font-medium truncate w-[40%] text-sm">
                                  {titleRole[role]}
                                </p>
                                <div className=" flex flex-row justify-between items-center w-[60%]">
                                  <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                    {roles[role].read ? (
                                      <GoShieldCheck size={20} color="green" />
                                    ) : (
                                      <GoShieldX size={20} color="red" />
                                    )}
                                  </div>
                                  <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                    {roles[role].create ? (
                                      <GoShieldCheck size={20} color="green" />
                                    ) : (
                                      <GoShieldX size={20} color="red" />
                                    )}
                                  </div>
                                  <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                    {roles[role].delete ? (
                                      <GoShieldCheck size={20} color="green" />
                                    ) : (
                                      <GoShieldX size={20} color="red" />
                                    )}
                                  </div>
                                  <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                    {roles[role].update ? (
                                      <GoShieldCheck size={20} color="green" />
                                    ) : (
                                      <GoShieldX size={20} color="red" />
                                    )}
                                  </div>
                                  <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                    {roles[role].read &&
                                    roles[role].create &&
                                    roles[role].delete &&
                                    roles[role].update ? (
                                      <GoShieldCheck size={20} color="green" />
                                    ) : (
                                      <GoShieldX size={20} color="red" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  {/* <Button
                    type="submit"
                    radius="sm"
                    color="primary"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                  >
                    Xác nhận
                  </Button> */}
                  <Button
                    radius="sm"
                    color="danger"
                    variant="solid"
                    className="bg-danger-400"
                    onPress={handleOnComplete}
                    isDisabled={isLoading}
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
ModalDetailPermission.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  onComplete: PropTypes.func.isRequired,
  departmentData: PropTypes.object.isRequired,
};
export default ModalDetailPermission;

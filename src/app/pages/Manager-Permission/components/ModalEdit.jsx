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
import { Switch } from "@nextui-org/react";
import { createPermission } from "../../../../services/api.service";
import { addNewRole, updateNameByRoleId } from "_redux/slice/roleSlice";
import { useDispatch } from "react-redux";
import {
  getDetailPermissionByRoleId,
  updatePermissionByRoleId,
} from "../../../../services/api.service";
import { titleRole, defaultRole } from "_utils/variable";
const convertRolesObjectToArray = (rolesObject) => {
  const rolesArray = {};
  for (const [key, value] of Object.entries(rolesObject)) {
    rolesArray[key] = Object.keys(value).filter(
      (permission) => value[permission]
    );
  }
  return rolesArray;
};

function ModalEditPermission({
  isOpen,
  onClose,
  isAdd,
  onComplete,
  permissionData,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState(JSON.parse(JSON.stringify(defaultRole)));
  const [roleName, setRoleName] = useState("");
  const [roleNameError, setRoleNameError] = useState("");
  const handleOnComplete = () => {
    if (isLoading) return;
    onClose();
    clearForm();
  };
  const clearForm = () => {
    setRoleName("");
    setRoleNameError("");
    setRoles(JSON.parse(JSON.stringify(defaultRole)));
  };
  useEffect(() => {
    if (!isAdd && isOpen) {
      handleGetDetail();
    }
  }, [isOpen]);
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
      setRoleName(permissionData?.name);
    } catch (error) {
      console.log(error);
      NotifyMessage(
        "Không thể lấy chi tiết quyền hạn, vui lòng thử lại sau!",
        "error"
      );
    }
  };
  const hanldeSubmitForm = async (e) => {
    e.preventDefault();
    if (!roleName) {
      setRoleNameError("Tên quyền hạn không được để trống");
      return;
    } else {
      setRoleNameError("");
    }
    if (isAdd) {
      try {
        setIsLoading(true);
        const res = await createPermission({
          role: roleName,
          permission: convertRolesObjectToArray(roles),
        });
        const transformedRole = {
          _id: res.data.data.role._id,
          name: res.data.data.role.name,
          level: res.data.data.role.level,
          createdAt: res.data.data.role.createdAt,
          updatedAt: res.data.data.role.updatedAt,
          __v: res.data.data.role.__v,
        };
        dispatch(addNewRole(transformedRole));
        NotifyMessage("Thêm mới quyền hạn thành công", "success");
        onClose();
        clearForm();
      } catch (error) {
        NotifyMessage(
          "Thêm mới quyền hạn thất bại, vui lòng thử lại sau",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        await updatePermissionByRoleId(permissionData._id, {
          role: roleName,
          permission: convertRolesObjectToArray(roles),
        });
        NotifyMessage("Cập nhật quyền hạn thành công", "success");
        dispatch(
          updateNameByRoleId({ id: permissionData._id, name: roleName })
        );
        onClose();
        clearForm();
      } catch (error) {
        NotifyMessage(
          "Cập nhật quyền hạn thất bại, vui lòng thử lại sau",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
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
          backdrop: "z-[51] overflow-hidden",
          wrapper: "z-[52] w-full",
          base: `!shadow-card-project min-w-[40%] `,
          closeButton: "right-5 z-10 text-lg",
          body: "overflow-y-auto max-h-[80vh]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={hanldeSubmitForm}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  {isAdd ? "Thêm mới" : "Chỉnh sửa"} phân quyền
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[80vh] shadow-sm px-3 py-4 rounded overflow-auto">
                    <div className="w-full px-4">
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <p className="text-sm font-semibold">Tên Quyền hạn</p>
                          <p className="text-sm text-red-600">(*)</p>
                        </div>
                        <input
                          name=""
                          value={roleName}
                          onChange={(e) => {
                            setRoleName(e.target.value);
                          }}
                          type="text"
                          placeholder="Nhập tên quyền hạn..."
                          className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                        />
                        {roleNameError && (
                          <div className="text-sm text-red-500">
                            {roleNameError}
                          </div>
                        )}
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
                          <div className="w-full px-3 rounded-md">
                            <div className="w-full rounded-md px-2 flex flex-row justify-between items-center">
                              <p className="font-medium truncate w-[40%] text-sm">
                                {titleRole[role]}
                              </p>
                              <div className=" flex flex-row justify-between items-center w-[60%]">
                                <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                  <Switch
                                    onChange={(e) => {
                                      setRoles((prevRoles) => ({
                                        ...prevRoles,
                                        [role]: {
                                          ...prevRoles[role],
                                          read: !prevRoles[role].read,
                                        },
                                      }));
                                    }}
                                    color="success"
                                    isSelected={roles[role].read}
                                    select
                                    aria-label="Xem"
                                  />
                                </div>
                                <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                  <Switch
                                    onChange={(e) => {
                                      setRoles((prevRoles) => ({
                                        ...prevRoles,
                                        [role]: {
                                          ...prevRoles[role],
                                          create: !prevRoles[role].create,
                                        },
                                      }));
                                    }}
                                    isSelected={roles[role].create}
                                    color="success"
                                    aria-label="Thêm"
                                  />
                                </div>
                                <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                  <Switch
                                    onChange={(e) => {
                                      setRoles((prevRoles) => ({
                                        ...prevRoles,
                                        [role]: {
                                          ...prevRoles[role],
                                          delete: !prevRoles[role].delete,
                                        },
                                      }));
                                    }}
                                    isSelected={roles[role].delete}
                                    color="success"
                                    aria-label="Xóa"
                                  />
                                </div>
                                <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                  <Switch
                                    onChange={(e) => {
                                      setRoles((prevRoles) => ({
                                        ...prevRoles,
                                        [role]: {
                                          ...prevRoles[role],
                                          update: !prevRoles[role].update,
                                        },
                                      }));
                                    }}
                                    isSelected={roles[role].update}
                                    color="success"
                                    aria-label="Sửa"
                                  />
                                </div>
                                <div className="text-sm w-[20%] flex justify-center items-center font-semibold text-black">
                                  <Switch
                                    onChange={(e) => {
                                      if (
                                        roles[role].create &&
                                        roles[role].read &&
                                        roles[role].update &&
                                        roles[role].delete
                                      ) {
                                        setRoles((prevRoles) => ({
                                          ...prevRoles,
                                          [role]: {
                                            create: false,
                                            read: false,
                                            update: false,
                                            delete: false,
                                          },
                                        }));
                                      } else {
                                        setRoles((prevRoles) => ({
                                          ...prevRoles,
                                          [role]: {
                                            create: true,
                                            read: true,
                                            update: true,
                                            delete: true,
                                          },
                                        }));
                                      }
                                    }}
                                    isSelected={
                                      roles[role].create &&
                                      roles[role].read &&
                                      roles[role].update &&
                                      roles[role].delete
                                    }
                                    color="success"
                                    aria-label="Tất cả"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    radius="sm"
                    color="primary"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                  >
                    Xác nhận
                  </Button>
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
ModalEditPermission.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  isAdd: PropTypes.bool.isRequired,
  onComplete: PropTypes.func.isRequired,
  departmentData: PropTypes.object.isRequired,
};
export default ModalEditPermission;

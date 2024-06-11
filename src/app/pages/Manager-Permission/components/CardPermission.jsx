import { MdEdit } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaUserShield } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { useDisclosure } from "@chakra-ui/react/dist/chakra-ui-react.cjs";
import React, { useState, useEffect } from "react";
import PopUp from "app/components/PopUp/popUp";
import ModalDeletePermission from "./ModalDelete";
import ModalDetailPermission from "./ModalDetail";
import ModalEditPermission from "./ModalEdit";
import { BsShieldPlus } from "react-icons/bs";
import PropTypes from "prop-types";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import { Button, Stack, Icon } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Tooltip } from "@nextui-org/react";
function CardPermission({ role, isAdd }) {
  const userRole = useSelector((state) => state.auth.role);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isAddRole, setIsAddRole] = useState(false);
  return (
    <>
      {isAdd ? (
        <div
          onClick={() => {
            setIsAddRole(true);
            setIsOpenModalEdit(true);
          }}
          className="w-full rounded-md min-h-36 py-4 px-6 flex flex-col justify-start items-start gap-2 bg-table shadow-wrapper cursor-pointer"
        >
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <div className="w-full flex flex-row justify-start items-center gap-5">
              <div className="w-14 h-14 flex justify-center items-center rounded bg-white">
                <BsShieldPlus size={30} />
              </div>
              <p className="text-lg text-white">Thêm mới quyền hạn</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-md min-h-36 py-4 px-6 flex flex-col justify-start items-start gap-2 bg-table shadow-wrapper">
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <div className="w-full flex flex-row justify-between items-center">
              <p className="text-sm text-white">
                Tổng số {role?.name.toLowerCase()} là {role?.count}
              </p>
              <Stack gap={1} direction={"row"}>
                <Tooltip
                  color={"primary"}
                  content={"Xem chi tiết"}
                  className="capitalize"
                  disableAnimation={true}
                >
                  <Button
                    p={0}
                    minW={"30px"}
                    h={"30px"}
                    borderRadius={"full"}
                    color={"white"}
                    _hover={{
                      bg: "blue.400",
                    }}
                    bg={"#0389e9"}
                    onClick={() => {
                      setIsOpenModalDetail(!isOpenModalDetail);
                    }}
                  >
                    <Icon as={FaRegEye} />
                  </Button>
                </Tooltip>
                <Tooltip
                  color={"warning"}
                  content={"Chỉnh sửa"}
                  className="capitalize"
                  disableAnimation={true}
                >
                  <Button
                    disabled={role?._id === "6401aa0bf5537e9b6acc5806"}
                    p={0}
                    minW={"30px"}
                    h={"30px"}
                    borderRadius={"full"}
                    color={"white"}
                    _hover={{
                      bg: "orange.400",
                    }}
                    bg={"#e9bf03"}
                    onClick={() => {
                      setIsOpenModalEdit(!isOpenModalEdit);
                    }}
                  >
                    <Icon as={LiaEditSolid} />
                  </Button>
                </Tooltip>
                <Tooltip
                  color={"danger"}
                  content={"Xóa"}
                  className="capitalize"
                  disableAnimation={true}
                >
                  <Button
                    disabled={role?._id === "6401aa0bf5537e9b6acc5806"}
                    p={0}
                    minW={"30px"}
                    h={"30px"}
                    borderRadius={"full"}
                    color={"white"}
                    _hover={{
                      bg: "red.400",
                    }}
                    bg={"red.500"}
                    onClick={() => {
                      setIsOpenModalDelete(!isOpenModalDelete);
                    }}
                  >
                    <Icon as={FaTrash} />
                  </Button>
                </Tooltip>
              </Stack>
              {/* <PopUp
                children={
                  <>
                    <div className="flex flex-col justify-start items-start w-full gap-1 min-w-36">
                      <div
                        className=" flex flex-row gap-1 justify-start items-center w-full hover:cursor-pointer min-h-10 px-2 hover:bg-[#d7d7d7] "
                        onClick={() => {
                          setIsOpenModalDetail(!isOpenModalDetail);
                        }}
                      >
                        <FaRegEye />
                        <p>Xem chi tiết</p>
                      </div>
                      <div
                        className=" flex flex-row gap-1 justify-start items-center w-full hover:cursor-pointer min-h-10 px-2 hover:bg-[#d7d7d7] "
                        onClick={() => {
                          setIsOpenModalEdit(!isOpenModalEdit);
                        }}
                      >
                        <MdEdit />
                        <p>Chỉnh sửa</p>
                      </div>
                      <div
                        onClick={() => {
                          setIsOpenModalDelete(!isOpenModalDelete);
                        }}
                        className=" flex flex-row gap-1 justify-start items-center w-full hover:cursor-pointer min-h-10 px-2 hover:bg-[#d7d7d7] "
                      >
                        <MdDelete />
                        <p>Xóa</p>
                      </div>
                    </div>
                  </>
                }
              /> */}
            </div>
            <div className="w-full flex flex-row justify-start items-center gap-5">
              <div className=" w-14 h-14 flex justify-center items-center rounded bg-white">
                <FaUserShield size={30} />
              </div>
              <p className="text-lg text-white">{role?.name}</p>
            </div>
          </div>
        </div>
      )}

      <ModalDeletePermission
        isOpen={isOpenModalDelete}
        onClose={() => {
          setIsOpenModalDelete(!isOpenModalDelete);
        }}
        permissionData={role}
        onComplete={() => {}}
      />
      <ModalDetailPermission
        isOpen={isOpenModalDetail}
        onClose={() => {
          setIsOpenModalDetail(!isOpenModalDetail);
        }}
        permissionData={role}
        onComplete={() => {}}
      />
      <ModalEditPermission
        isAdd={isAddRole}
        isOpen={isOpenModalEdit}
        onClose={() => {
          setIsOpenModalEdit(!isOpenModalEdit);
        }}
        permissionData={role}
        onComplete={() => {}}
      />
    </>
  );
}

CardPermission.propTypes = {
  role: PropTypes.object.isRequired,
  isAdd: PropTypes.bool.isRequired,
};
export default CardPermission;

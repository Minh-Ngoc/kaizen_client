import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { departmentAction } from "../../../../_redux/slice/departmentSlice";
import { createDepartment, updateDepartment } from "services/api.service";
import NotifyMessage from "_utils/notify";
function ModalDepartment({
  isOpen,
  onClose,
  isAdd,
  departmentData,
  onComplete,
}) {
  const dispatch = useDispatch();
  const listDepartment = useSelector(
    (state) => state.department.listDepartment
  );
  const departmentSchema = yup.object({
    name: yup.string().required("Tên phòng ban không được để trống"),
    parent: yup.string(),
  });

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
      name: "",
      parent: "",
    },
    resolver: yupResolver(departmentSchema),
  });
  useEffect(() => {
    dispatch(departmentAction.getAllDepart());
    if (!isAdd) {
      setValue("name", departmentData?.name ?? "");
      setValue("parent", departmentData?.parent?._id ?? "");
    } else {
      reset();
    }
  }, [isOpen]);
  const onSubmit = handleSubmit(async (values) => {
    if (isAdd) {
      try {
        await createDepartment(values);
        onComplete();
        handleClose();
        NotifyMessage("Thêm mới phòng ban thành công", "success");
      } catch (error) {
        NotifyMessage("Thêm mới thất bại vui lòng thử lại sau", "error");
      }
    } else {
      try {
        await updateDepartment(departmentData?._id, values);
        onComplete();
        handleClose();
        NotifyMessage("Chỉnh sửa phòng ban thành công", "success");
      } catch (error) {
        NotifyMessage("Cập nhật thất bại vui lòng thử lại sau", "error");
      }
    }
  });
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
                  {isAdd ? "Thêm mới" : "Chỉnh Sửa"} Phòng ban
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2  max-h-[90vh]">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tên phòng ban</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={watch("name")}
                        onChange={(e) => {
                          setValue("name", e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập tên phòng ban ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {errors["name"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["name"]?.message}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">
                          Phòng ban cha (có thể bỏ trống)
                        </p>
                      </div>
                      <Select
                        label=""
                        classNames={{
                          label: "group-data-[filled=true]:-translate-y-5",
                          base: "w-full !rounded",
                        }}
                        popoverProps={{
                          classNames: {
                            base: "before:bg-default-200",
                            content: "w-full",
                          },
                        }}
                        placeholder="Chọn phòng ban cha..."
                        isMultiline={true}
                        selectionMode="single"
                        items={
                          listDepartment?.map((department) => {
                            return {
                              value: department?._id,
                              label: department?.name,
                            };
                          }) || []
                        }
                        selectedKeys={[watch("parent")]}
                        onSelectionChange={(value) => {
                          console.log(value);
                          const arrVal = [...value];
                          setValue("parent", arrVal[0] ?? "");
                        }}
                      >
                        {(item) => (
                          <SelectItem key={item.value}>{item.label}</SelectItem>
                        )}
                      </Select>
                      {errors["parent"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["parent"]?.message}
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
              </form>
            </>
          )}
        </ModalContent>
      </NextUIModal>
    </>
  );
}
ModalDepartment.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  isAdd: PropTypes.bool.isRequired,
  departmentData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};
export default ModalDepartment;

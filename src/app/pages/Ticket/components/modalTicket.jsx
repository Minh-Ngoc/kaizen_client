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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { createTicket } from "services/api.service";
import NotifyMessage from "_utils/notify";
import { listPriorityModal } from "_utils";
import { listProjectTicketModal } from "_utils";
import TinyMCE from "app/components/TinyMCE";
import { IoClose } from "react-icons/io5";
function ModalTicket({ isOpen, onClose, onComplete }) {
  const departmentSchema = yup.object({
    priority: yup.string().required("Mức độ ưu tiên không được để trống"),
    project: yup.string().required("Dự án không được để trống"),
    title: yup.string().required("Tiêu đề không được để trống"),
    content: yup.string().nullable(),
    file: yup.mixed().nullable(),
  });

  const handleClose = () => {
    setSelectedFile(null);
    setIsFileValid(true);
    reset();
    onClose();
  };
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      parent: "",
      priority: "",
      project: "",
      title: "",
      content: "",
      file: null,
    },
    resolver: yupResolver(departmentSchema),
  });
  
  useEffect(() => {
    reset();
  }, [isOpen]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createTicket(values);
      onComplete();
      handleClose();
      NotifyMessage("Tạo mới ticket thành công!", "success");
    } catch (error) {
      NotifyMessage("Tạo mới ticket thất bại, thử lại sau.", "error");
    }
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileValid, setIsFileValid] = useState(true);

  const isValidFileExtension = (fileName) => {
    const allowedExtensions = [".gif", ".jpeg", ".jpg", ".png", ".pdf"];
    const extension = fileName.slice(
      ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
    );
    return allowedExtensions.includes("." + extension.toLowerCase());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && isValidFileExtension(file.name)) {
      setSelectedFile(file);
      setIsFileValid(true);
      setValue("file", file);
    } else {
      setSelectedFile(null);
      if (file) setIsFileValid(false);
      else setIsFileValid(true);
      setValue("file", null);
    }
    setTimeout(() => {
      setIsFileValid(true);
    }, 5000);
  };
  const handleFileRemove = () => {
    setTimeout(() => {
      setSelectedFile(null);
      setIsFileValid(true);
      setValue("file", null);
    }, 100);
  };
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
          base: `!shadow-card-project min-w-[40%]`,
          closeButton: "right-5 z-10 text-lg",
          body: "overflow-auto",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  Tạo mới ticket
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2  max-h-[90vh]">
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-20">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Mức độ ưu tiên</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <Select
                        placeholder="Chọn mức độ ưu tiên..."
                        menuPosition="fixed"
                        className="w-full !text-sm"
                        options={listPriorityModal}
                        isSearchable={true}
                        value={listPriorityModal.find(
                          (e) => e.value === watch("priority")
                        )}
                        onChange={(e) => {
                          setValue("priority", e.value);
                        }}
                      />
                      {errors["priority"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["priority"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-10">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Dự án</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <Select
                        placeholder="Chọn dự án..."
                        menuPosition="fixed"
                        className="w-full !text-sm"
                        options={listProjectTicketModal}
                        isSearchable={true}
                        value={listProjectTicketModal.find(
                          (e) => e.value === watch("project")
                        )}
                        onChange={(e) => {
                          setValue("project", e.value);
                        }}
                      />
                      {errors["project"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["project"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tiêu đề</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={watch("title")}
                        onChange={(e) => {
                          setValue("title", e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập tiêu đề..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {errors["title"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["title"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-1">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">
                          Nội dung yêu cầu:
                        </p>
                      </div>
                      <TinyMCE
                        value={watch("content")}
                        onEditorChange={(value) => setValue("content", value)}
                        height="400px"
                        placeholder="Nhập nội dung yêu cầu..."
                      />
                      {errors["content"]?.message && (
                        <div className="text-sm text-red-500">
                          {errors["content"]?.message}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-1">
                      <div className="flex flex-col justify-center items-start gap-1">
                        <p className="text-sm font-semibold">
                          Chọn file đính kèm:
                        </p>
                      </div>
                      <label className="w-full cursor-pointer relative">
                        {!selectedFile && (
                          <input
                            type="file"
                            accept=".gif, .jpeg, .jpg, .png, .pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        )}
                        {selectedFile ? (
                          <>
                            <div
                              onClick={() => handleFileRemove()}
                              className="z-40 w-5 h-5 rounded-full  absolute right-[-8.5px] top-[-8.5px] bg-white border-1 border-gray-300 flex flex-row justify-center items-center"
                            >
                              <IoClose />
                            </div>
                            <div className="w-full flex flex-row justify-center items-center py-5 border-1 border-gray-300 rounded">
                              <p className="text-sm font-medium">
                                {selectedFile.name}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="w-full flex flex-row justify-center items-center py-5 border-1 border-gray-300 rounded border-dashed cursor-pointer">
                            <p className="text-sm">
                              Nhấn vào đây để chọn file đính kèm
                            </p>
                          </div>
                        )}
                      </label>

                      <div className="flex flex-col justify-center items-start gap-1">
                        <p className="text-xs font-semibold">
                          Các loại file được hổ trợ: .gif, .jpeg, .jpg, .png,
                          .pdf
                        </p>
                      </div>
                      {!isFileValid && (
                        <div className="text-sm text-red-500">
                          Vui lòng chọn một tệp có định dạng .gif, .jpeg, .jpg,
                          .png hoặc .pdf
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
ModalTicket.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  onComplete: PropTypes.func.isRequired,
};
export default ModalTicket;

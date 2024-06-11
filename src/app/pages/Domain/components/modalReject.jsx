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
import {
  approveKpiDomain,
  rejectKpiDomain,
} from "../../../../services/api.service";
import NotifyMessage from "_utils/notify";
import { useDispatch } from "react-redux";
function ModalRejectKpi({
  isOpen,
  onClose,
  domainId,
  onComplete,
  indexKpi,
  isApprove,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [top, setTop] = useState();
  const [errorTop, setErrorTop] = useState("");
  useEffect(() => {
    setErrorTop("");
    setTop("");
  }, [isOpen]);
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!top) {
      setErrorTop("Top không được để trống");
      return;
    }
    if (isNaN(top)) {
      setErrorTop("Giá trị của top phải là một số");
      return;
    }
    setErrorTop("");
    try {
      if (isApprove) {
        await approveKpiDomain(domainId, indexKpi, { top });
      } else {
        await rejectKpiDomain(domainId, indexKpi, { top });
      }
      onComplete();
      onClose();
      NotifyMessage("Cập nhật thành công", "success");
    } catch (error) {
      NotifyMessage("Cập nhật thất bại", "error");
    }
  };
  return (
    <>
      <NextUIModal
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
          backdrop: "z-[999]",
          wrapper: "z-[1000] w-full",
          base: `min-w-[40%]`,
          closeButton: "right-5 z-10 text-lg",
          body: "overflow-auto z-[999999]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleOnSubmit}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  <div className="flex flex-row justify-start items-center gap-2">
                    <p className="">Xác nhận duyệt</p>
                    <p className="text-red-500">
                      {isApprove ? `"Đạt"` : `"Không Đạt"`}
                    </p>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh]">
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Nhập top</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        disabled={isLoading}
                        value={top}
                        onChange={(e) => {
                          setTop(e.target.value);
                        }}
                        type="text"
                        placeholder="Nhập top ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {errorTop && (
                        <div className="text-sm text-red-500">{errorTop}</div>
                      )}
                    </div>
                    <div className="flex flex-row justify-start items-start gap-1 w-full">
                      <p className="text-[15px] text-red-500 font-semibold">
                        Lưu ý :
                      </p>
                      <p className="text-[15px] text-red-500 ">
                        Mỗi KPI chỉ được duyệt một lần, kiểm tra kỹ trước khi
                        xác nhận!
                      </p>
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
                    onPress={onClose}
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
ModalRejectKpi.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  onComplete: PropTypes.func.isRequired,
  _id: PropTypes.string.isRequired,
  domainId: PropTypes.string.isRequired,
  isApprove: PropTypes.bool.isRequired,
};
export default ModalRejectKpi;

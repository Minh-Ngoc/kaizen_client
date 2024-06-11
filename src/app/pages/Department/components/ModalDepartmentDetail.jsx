import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import PropTypes from "prop-types";
function ModalDetailDepartment({ isOpen, onClose, departmentData }) {
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
                Chi Tiết Phòng Ban
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col justify-start items-start w-full gap-2  max-h-[90vh]">
                  <div className="flex flex-col justify-start items-start gap-1 w-full">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="text-sm font-semibold">Tên phòng ban</p>
                      <p className="text-sm text-red-600">(*)</p>
                    </div>
                    <input
                      value={departmentData?.name}
                      disabled={true}
                      type="text"
                      placeholder="Nhập tên phòng ban ..."
                      className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                    />
                  </div>

                  <div className="flex flex-col justify-start items-start gap-1 w-full">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="text-sm font-semibold">
                        Phòng ban cha (có thể bỏ trống)
                      </p>
                    </div>
                    <input
                      value={
                        departmentData?.parent
                          ? departmentData?.parent?.name
                          : "(Trống)"
                      }
                      disabled={true}
                      type="text"
                      placeholder="Nhập tên phòng ban ..."
                      className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                    />
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
ModalDetailDepartment.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  departmentData: PropTypes.object.isRequired,
};
export default ModalDetailDepartment;

import PropTypes from "prop-types";
import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { deleteUser } from "../../../../services/api.service";
import NotifyMessage from "_utils/notify";
function ModalDeleteUser({ isOpen, onClose, onComplete, userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleOnDelete = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log(userData);
      await deleteUser(userData?._id);
      NotifyMessage("Xóa người dùng thành công", "success");
      onComplete();
      onClose();
    } catch (error) {
      console.log(error);
      NotifyMessage("Lỗi vui lòng thử lại sau", "error");
    } finally {
      setIsLoading(false);
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
              <form onSubmit={handleOnDelete}>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  Thông báo
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh]">
                    <p>Xác nhận xóa người dùng này?</p>
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
ModalDeleteUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  onComplete: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};
export default ModalDeleteUser;

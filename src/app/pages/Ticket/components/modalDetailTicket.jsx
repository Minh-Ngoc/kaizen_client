import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import {
  getPriorityText,
  getProjectTicketText,
} from "_utils";
import TinyMCE from "app/components/TinyMCE";
import { URL_IMAGE } from "_constants";
function ModalDetailTicket({ isOpen, onClose, ticket }) {
  const handleClose = () => {
    onClose();
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
              <form>
                <ModalHeader className="flex flex-col gap-1 uppercase text-black">
                  Chi tiết ticket
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col justify-start items-start w-full gap-2  max-h-[80vh]">
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-20">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Mức độ ưu tiên</p>
                      </div>
                      <div className="shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal">
                        {getPriorityText[ticket?.priority]?.text || "(Trống)"}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-10">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Dự án</p>
                      </div>
                      <div className="shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal">
                        {getProjectTicketText[ticket?.project]?.text ||
                          "(Trống)"}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tiêu đề</p>
                      </div>
                      <div className="shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal">
                        {ticket?.title || "(Trống)"}
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-1">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">
                          Nội dung yêu cầu:
                        </p>
                      </div>
                      <TinyMCE
                        value={ticket?.content || "(Trống)"}
                        height="400px"
                        disabled={true}
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-1">
                      <div className="flex flex-col justify-center items-start gap-1">
                        <p className="text-sm font-semibold">File đính kèm:</p>
                      </div>
                      <label className="w-full relative">
                        {ticket?.file ? (
                          <>
                            {/\.(gif|jpe?g|png)$/i.test(ticket?.file) ? (
                              <img
                                src={`${URL_IMAGE}/${ticket?.file}`}
                                alt="Hình ảnh đính kèm"
                                className="w-full"
                              />
                            ) : (
                              <>
                                <div className="w-full flex flex-col justify-center items-center py-5 border-1 border-gray-300 rounded">
                                  <p className="text-sm font-medium">
                                    {ticket?.file}
                                  </p>
                                  {/\.pdf$/i.test(ticket?.file) && (
                                    <a
                                      href={`${URL_IMAGE}/${ticket?.file}`}
                                      download={`${URL_IMAGE}/${ticket?.file}`}
                                      className="bg-blue-500 text-sm py-1 px-3 rounded text-white"
                                    >
                                      Tải xuống
                                    </a>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="w-full flex flex-row justify-center items-center py-5 border-1 border-gray-300 rounded border-dashed cursor-pointer">
                            <p className="text-sm">Không có tệp đính kèm.</p>
                          </div>
                        )}
                      </label>
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
                    Quay về
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
ModalDetailTicket.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  ticket: PropTypes.any.isRequired,
};
export default ModalDetailTicket;

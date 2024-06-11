/* eslint-disable no-extra-boolean-cast */
import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
} from "@nextui-org/react";
import PropTypes from "prop-types";
import { Textarea } from "@nextui-org/react";
import moment from "moment";
function ModalDetailDomain({ isOpen, onClose, domainData }) {
  console.log("domain data:", domainData);
  const statusDomain = [
    { value: "web-train", label: "Web đào tạo" },
    { value: "satellite", label: "Vệ tinh" },
    { value: "pause", label: "Tạm ngưng" },
    { value: "seo", label: "SEO" },
    { value: "pbn", label: "PBN" },
    { value: "do-not-use", label: "Không sử dụng" },
    { value: "301", label: "301" },
    { value: "for-assistant", label: "Cho trợ lý" },
    { value: "brand", label: "Hậu đài" },
    { value: "back-up", label: "Backup" },
    { value: "cdn", label: "CDN" },
  ];
  return (
    <>
      <NextUIModal
        size="5xl"
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
                Chi tiết Domain
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col justify-start items-start w-full gap-2 max-h-[90vh] min-h-[50vh]">
                  <div className="flex flex-row justify-center items-center w-full gap-2 ">
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tên domain</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={domainData?.domainName ?? "(Trống)"}
                        disabled
                        type="text"
                        placeholder="Nhập tên domain..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Tính Kpi Bonus</p>
                      </div>
                      <Switch isSelected={domainData?.isCalculateKpi} disabled>
                        {domainData?.isCalculateKpi ? (
                          <p className="text-sm">Tính</p>
                        ) : (
                          <p className="text-sm">Không tính</p>
                        )}
                      </Switch>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center items-center w-full gap-2 ">
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Team</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={domainData?.team?.name ?? "(Trống)"}
                        disabled
                        type="text"
                        placeholder="Nhập link hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {/* <Select
                        placeholder="Chọn team..."
                        menuPosition="fixed"
                        className="w-full !text-sm"
                        options={listTeams?.map((team) => {
                          return {
                            value: team?._id,
                            label: team?.name,
                          };
                        })}
                        isSearchable={true}
                        value={listTeams
                          ?.map((team) => {
                            return {
                              value: team?._id,
                              label: team?.name,
                            };
                          })
                          .find((e) => e.value === watch("team"))}
                        onChange={(e) => {
                          setValue("team", e.value);
                        }}
                      /> */}
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-[9999]">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Trạng thái</p>
                      </div>
                      <input
                        value={
                          statusDomain
                            ?.map((status) => {
                              return {
                                value: status?.value,
                                label: status?.label,
                              };
                            })
                            .find((e) => e.value === domainData?.statusDomain)
                            ?.label ?? "(Trống)"
                        }
                        disabled
                        type="text"
                        placeholder="Nhập link hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {/* <Select
                        placeholder="Chọn trạng thái dommain..."
                        menuPosition="fixed"
                        className="w-full !text-sm"
                        options={statusDomain?.map((status) => {
                          return {
                            value: status?.value,
                            label: status?.label,
                          };
                        })}
                        value={statusDomain
                          ?.map((status) => {
                            return {
                              value: status?.value,
                              label: status?.label,
                            };
                          })
                          .find((e) => e.value === watch("statusDomain"))}
                        onChange={(e) => {
                          setValue("statusDomain", e.value);
                        }}
                      /> */}
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center w-full gap-2 ">
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Brand</p>
                        <p className="text-sm text-red-600">(*)</p>
                      </div>
                      <input
                        value={domainData?.brand?.name ?? "(Trống)"}
                        disabled
                        type="text"
                        placeholder="Nhập link hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full z-[9998]">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Ngày hết hạn</p>
                      </div>
                      <input
                        disabled={true}
                        value={
                          domainData?.dateOut
                            ? moment(domainData?.dateOut).format("DD/MM/yyyy")
                            : "(Trống)"
                        }
                        type="text"
                        placeholder="Nhập số điện thoại ..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                      {/* <DateTimePicker
                        isHaveHour={false}
                        isBottom={true}
                        date={watch("dateOut")}
                        setDate={(date) => {
                          setValue("dateOut", date);
                        }}
                      /> */}
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center w-full gap-2 ">
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Link hậu đài</p>
                      </div>
                      <input
                        value={
                          !!domainData?.LinkBrand
                            ? domainData?.LinkBrand
                            : "(Trống)"
                        }
                        disabled
                        type="text"
                        placeholder="Nhập link hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Mã hậu đài</p>
                      </div>
                      <input
                        value={
                          !!domainData?.codeBrand
                            ? domainData?.codeBrand
                            : "(Trống)"
                        }
                        disabled
                        type="text"
                        placeholder="Nhập mã hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center w-full gap-2 ">
                    <div className="flex flex-col justify-start items-start gap-1 w-full ">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Người quản lý</p>
                      </div>
                      <input
                        value={
                          domainData?.userManager?.firstName ||
                          domainData?.userManager?.lastName
                            ? `${domainData?.userManager?.firstName || ""} ${
                                domainData?.userManager?.lastName || ""
                              }`
                            : domainData?.userManager?.name
                            ? `${domainData?.userManager?.name}`
                            : "(Trống)"
                        }
                        disabled
                        type="text"
                        placeholder="Nhập mã hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                      <div className="flex flex-row justify-center items-center gap-1">
                        <p className="text-sm font-semibold">Người hổ trợ</p>
                      </div>
                      <input
                        value={
                          domainData?.userSupport?.firstName ||
                          domainData?.userSupport?.lastName
                            ? `${domainData?.userSupport?.firstName || ""} ${
                                domainData?.userSupport?.lastName || ""
                              }`
                            : domainData?.userSupport?.name
                            ? `${domainData?.userSupport?.name}`
                            : "(Trống)"
                        }
                        disabled
                        type="text"
                        placeholder="Nhập mã hậu đài..."
                        className="transition-all duration-200 shadow-none ease-in-out border-1 border-gray-300 focus:outline-none focus:border-[#3182ce] focus:shadow-input-modal w-full rounded px-2 py-2 text-sm font-normal"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1 w-full ">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <p className="text-sm font-semibold">Ghi chú</p>
                    </div>

                    <Textarea
                      value={!!domainData?.note ? domainData?.note : "(Trống)"}
                      disabled
                      placeholder="Nhập nhận xét..."
                      label=""
                      className="max-w-full w-full"
                      classNames={{
                        inputWrapper:
                          "bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:bg-transparent border ",
                        input: "!text-black",
                        label: "!text-black",
                      }}
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
ModalDetailDomain.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.any.isRequired,
  isAdd: PropTypes.bool.isRequired,
  domainData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
};
export default ModalDetailDomain;

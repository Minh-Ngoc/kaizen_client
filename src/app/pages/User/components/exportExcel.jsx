import { useState } from "react";
import ExcelJS from "exceljs";
import moment from "moment";
import NotifyMessage from "_utils/notify";
import { getDataForExportExcel } from "services/api.service";
import { SiMicrosoftexcel } from "react-icons/si";
import { Button } from "@nextui-org/react";

function ButtonExportExcel() {
  const [isLoading, setIsLoading] = useState(false);
  const handleExportExcel = (listUser) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách người dùng");
    worksheet.mergeCells("A1", "AL");
    worksheet.getCell("A1").value = "Thông tin nhân sự";
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "darkTrellis",
      fgColor: { argb: "FFFFFF00" },
      bgColor: { argb: "FFFF00" },
    };

    worksheet.getCell("A1", "AL").font = {
      name: "Time New Romans",
      family: 4,
      size: 25,
      bold: true,
      fgColor: { argb: "ffffcc00" },
    };

    worksheet.getRow(2).values = [
      "STT",
      "Mã nhân sự",
      "Tên đăng nhập",
      "Họ",
      "Tên",
      "Tên đầy đủ",
      "Số điện thoại",
      "Vai trò",
      "Chứng minh nhân dân",
      "Địa chỉ",
      "Ngân hàng",
      "Phòng ban",
      "Ngày sinh",
      "Lương",
    ];
    worksheet.getRow(2).height = 30;
    worksheet.getRow(2).font = {
      family: 4,
      size: 14,
      bold: true,
      fgColor: { argb: "ffffcc00" },
      underline: true,
      scheme: "major",
    };

    worksheet.columns = [
      { key: "STT", width: 10 },
      { key: "id", width: 20 },
      { key: "username", width: 30 },
      { key: "firstName", width: 30 },
      { key: "lastName", width: 30 },
      { key: "name", width: 30 },
      { key: "phoneNumber", width: 30 },
      { key: "role", width: 30 },
      { key: "cmnd", width: 30 },
      { key: "address", width: 30 },
      { key: "bank", width: 30 },
      { key: "department", width: 30 },
      { key: "birthday", width: 30 },
      { key: "salary", width: 30 },
    ];

    const dataExport = [];
    let count = 1;
    listUser?.map((item, index) => {
      const user = {
        STT: count,
        id: item?.id,
        username: item?.username ?? "(Trống)",
        firstName: item?.firstName ?? "(Trống)",
        lastName: item?.lastName ?? "(Trống)",
        name: item?.name ?? "(Trống)",
        phoneNumber: item?.phoneNumber ?? "(Trống)",
        role: item?.role?.name ?? "(Trống)",
        cmnd: item?.cmnd ?? "(Trống)",
        address: item?.address ?? "(Trống)",
        bank: item?.bank ?? "(Trống)",
        department: item?.department?.name ?? "(Trống)",
        birthday: item?.birthday
          ? moment(item?.birthday).format("DD-MM-YYYY")
          : "(Trống)",
        salary: item?.salary ?? "(Trống)",
      };
      dataExport.push(user);
      worksheet.addRow(user);
      count++;
    });
    if (dataExport.length !== 0) {
      workbook.xlsx.writeBuffer().then((dataExport) => {
        const blob = new Blob([dataExport], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "danh_sach_nguoi_dung.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
      NotifyMessage("Xuất file thành công!", "success");
    } else {
      NotifyMessage(
        "Không có dữ liệu người dùng, không thể xuất file!",
        "error"
      );
    }
  };
  const handleGetUserDate = async () => {
    try {
      setIsLoading(true);
      const res = await getDataForExportExcel();
      handleExportExcel(res?.data?.data);
    } catch (error) {
      NotifyMessage("Xuất file thất bại, thử lại sau!", "error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      radius="sm"
      className="min-w-36"
      startContent={<SiMicrosoftexcel />}
      color="success"
      isLoading={isLoading}
      onClick={handleGetUserDate}
    >
      Xuất Excel
    </Button>
  );
}
export default ButtonExportExcel;

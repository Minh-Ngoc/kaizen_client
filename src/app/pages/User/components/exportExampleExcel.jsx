import ExcelJS from "exceljs";
import NotifyMessage from "_utils/notify";
import { Button } from "@nextui-org/react";
import { TbPackageExport } from "react-icons/tb";
function ButtonExportExampleExcel() {
  const handleExportExcelExample = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách người dùng mẫu");
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
    for (let i = 1, charCode = 97; i < 11; i++, charCode++) {
      const user = {
        STT: i,
        id: "0000" + `${i}`,
        username: `user_name_${String.fromCharCode(charCode)}`,
        firstName: "Nguyễn Văn",
        lastName: String.fromCharCode(charCode).toUpperCase(),
        name: "Nguyễn Văn" + " " + String.fromCharCode(charCode).toUpperCase(),
        phoneNumber: "0941572957",
        role: "Nhân Viên",
        cmnd: "26156842228",
        address:
          "231 Tây Thanh, Phường Tây Thạnh, Tân Phú, Thành Phố Hồ Chí Minh",
        bank: "97555442221",
        department: "Phòng IT",
        birthday: "13-11-1998",
        salary: "15,000,000 đ",
      };
      worksheet.addRow(user);
    }
    workbook.xlsx.writeBuffer().then((dataExport) => {
      const blob = new Blob([dataExport], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "danh_sach_nguoi_dung_mau.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
    NotifyMessage("Xuất file mẫu thành công!", "success");
  };
  return (
    <Button
      radius="sm"
      className="min-w-36"
      startContent={<TbPackageExport />}
      color="success"
      onClick={handleExportExcelExample}
    >
      Xuất File Mẫu
    </Button>
  );
}
export default ButtonExportExampleExcel;

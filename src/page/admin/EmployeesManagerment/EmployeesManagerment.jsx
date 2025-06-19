import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { useNavigate } from "react-router-dom";

export const EmployeesManagerment = () => {
  const navigate = useNavigate();

  const handleAddEmployees = () => {
    navigate("/admin/employees/addEmployees");
  };
  return (
    <div>
      <TableContainer>
        <div className="flex justify-end gap-3 pb-4">
          <Button variant="contained" onClick={handleAddEmployees}>
            Thêm nhân viên
          </Button>
        </div>
        <Divider />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold text-text-sub">
                STT
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold text-text-sub">
                Họ và tên
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold text-text-sub">
                Chức vụ
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold text-text-sub">
                Thời gian tạo
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold text-text-sub">
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Nguyễn Bỉnh Khiêm</TableCell>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>11/06/2025</TableCell>
              <TableCell>
                <Button>Xóa</Button>
                <Button>Sửa</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

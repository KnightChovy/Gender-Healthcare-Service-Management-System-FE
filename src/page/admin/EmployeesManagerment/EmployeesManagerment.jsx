import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_GET_STAFF } from "../../../constants/Apis";
import axiosClient from "../../../services/axiosClient";

export const EmployeesManagerment = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const res = await axiosClient.get(API_GET_STAFF);
        setStaff(res.data.listAllUsers);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };
    fetchStaffData();
  }, []);

  const roleStaff = staff.filter(
    (staff) =>
      (staff.role === "manager" ||
        staff.role === "doctor" ||
        staff.role === "staff") &&
      staff.status !== 0
  );

  const handleAddEmployees = () => {
    navigate("/admin/employees/addEmployees");
  };

  const handleEdit = (staffData) => {
    navigate("/admin/employees/addEmployees", {
      state: {
        isEdit: true,
        staffData: staffData,
      },
    });
  };

  const handleRemove = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setStaff((prevStaff) =>
        prevStaff.map((staffMember) =>
          staffMember.user_id === id
            ? { ...staffMember, status: 0 }
            : staffMember
        )
      );
      // Gọi API xóa nhân viên ở đây (nếu cần)
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý nhân viên</h1>

      <TableContainer className="shadow-sm rounded-lg border border-gray-200">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-semibold">Danh sách nhân viên</div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEmployees}
            startIcon={<span className="text-lg">+</span>}
          >
            Thêm nhân viên
          </Button>
        </div>
        <Divider />
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold">
                STT
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold">
                Họ và tên
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold">
                Chức vụ
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold">
                Thời gian tạo
              </TableCell>
              <TableCell className="whitespace-nowrap p-3 text-base font-semibold text-center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roleStaff.length > 0 ? (
              roleStaff.map((staff, index) => (
                <TableRow
                  key={staff.user_id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell className="p-3">{index + 1}</TableCell>
                  <TableCell className="p-3 font-medium">
                    {staff.last_name + " " + staff.first_name}
                  </TableCell>
                  <TableCell className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.role === "doctor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {staff.role.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="p-3">
                    {new Date(staff.created_at).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="p-3 text-center">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(staff)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemove(staff.user_id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không có dữ liệu nhân viên
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

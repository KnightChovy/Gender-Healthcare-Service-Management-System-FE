import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Stack,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import axiosClient from "../../services/axiosClient";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get("/v1/users");

        const filtered = (res.data.listAllUsers || []).filter(
          (u) =>
            u.role?.toLowerCase() === "user" ||
            u.role?.toLowerCase() === "khách hàng"
        );
        setUsers(filtered);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Lọc theo tìm kiếm
  const displayedUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{ p: { xs: 1, md: 4 }, background: "#f3f4f6", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "#0f172a",
          letterSpacing: 1,
          textShadow: "0 2px 8px #e0e7ef",
        }}
      >
        Quản lý người dùng
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          boxShadow: "0 4px 24px #c7d2fe55",
          background: "#fff",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 700 }}>
            Danh sách người dùng
          </Typography>
          <TextField
            size="small"
            placeholder="Tìm kiếm tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress size={40} thickness={5} color="primary" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f1f5f9" }}>
                  <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Họ tên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có người dùng nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedUsers.map((user, idx) => (
                    <TableRow
                      key={user.id || idx}
                      hover
                      sx={{
                        transition: "background 0.2s",
                        "&:hover": { background: "#e0e7ef55" },
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{ width: 32, height: 32, bgcolor: "#6366f1" }}
                          >
                            {user.first_name?.[0] || user.name?.[0] || "U"}
                          </Avatar>
                          <span>{user.last_name + " " + user.first_name}</span>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={"Khách hàng"}
                          size="small"
                          sx={{
                            backgroundColor: "#6366f122",
                            color: "#6366f1",
                            fontWeight: 600,
                          }}
                          icon={<PersonIcon />}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

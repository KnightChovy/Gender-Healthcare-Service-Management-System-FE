import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
import axiosClient from "../../services/axiosClient";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const ROLE_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e42",
  "#ef4444",
  "#3b82f6",
  "#a21caf",
];

const ROLE_ICONS = {
  "Khách hàng": <PersonIcon />,
  "Nhân viên": <SupervisorAccountIcon />,
  Admin: <AdminPanelSettingsIcon />,
};

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleCount = users.reduce((acc, user) => {
    const role = user.role || "Khách hàng";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(roleCount).map(([role, count], idx) => ({
    name: role.toUpperCase(),
    value: count,
    color: ROLE_COLORS[idx % ROLE_COLORS.length],
  }));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get("/v1/users");
        setUsers(res.data.listAllUsers);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 1, md: 4 },
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}
      >
        Bảng điều khiển
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {pieData.map((role, idx) => (
          <Grid item key={role.name}>
            <Chip
              label={`${role.name}: ${role.value}`}
              sx={{
                backgroundColor: role.color + "22",
                color: role.color,
                fontWeight: 600,
                fontSize: 16,
                px: 2,
                py: 1,
              }}
            />
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : null}

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Tỉ lệ vai trò người dùng
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}

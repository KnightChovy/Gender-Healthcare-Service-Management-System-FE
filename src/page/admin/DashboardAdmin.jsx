import React from "react";
import { Box, Grid, Paper, Typography, Divider, Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ScienceIcon from "@mui/icons-material/Science";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";

const StatCard = ({ icon, title, value, color, bgColor }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        background: bgColor || "#fff",
        border: "1px solid #f0f0f0",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              color: color,
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </Box>

      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: "bold",
          mb: 1,
          fontSize: { xs: "1.75rem", md: "2rem" },
          color: "#1e293b",
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {title}
      </Typography>
    </Paper>
  );
};

const RoleCard = ({ roles }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: "1px solid #f0f0f0",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: "#6366f115",
              color: "#6366f1",
              borderRadius: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SettingsIcon />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 1, fontWeight: 600 }}
          >
            Vai trò hệ thống
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {roles.map((role) => (
          <Chip
            key={role.name}
            label={role.name}
            sx={{
              backgroundColor: role.color + "15",
              color: role.color,
              fontWeight: 500,
              px: 1,
              border: `1px solid ${role.color}30`,
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default function DashboardAdmin() {
  // Các vai trò trong hệ thống với màu riêng
  const roles = [
    { name: "Admin", color: "#7e22ce" },
    { name: "Bác sĩ", color: "#2563eb" },
    { name: "Kỹ thuật viên", color: "#0891b2" },
    { name: "Quản lý", color: "#059669" },
    { name: "Nhân viên", color: "#ca8a04" },
    { name: "Khách hàng", color: "#475569" },
  ];

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}
        >
          Bảng điều khiển
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem tổng quan về các chỉ số quan trọng của hệ thống
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<PersonIcon fontSize="medium" />}
            title="Tổng số người dùng"
            value="1,250"
            color="#3b82f6" // blue
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<ScienceIcon fontSize="medium" />}
            title="Tổng số dữ liệu xét nghiệm"
            value="4,580"
            color="#8b5cf6" // purple
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<HealthAndSafetyIcon fontSize="medium" />}
            title="Nhân sự đang hoạt động"
            value="27"
            color="#10b981" // green
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<LockIcon fontSize="medium" />}
            title="Tài khoản bị khóa"
            value="5"
            color="#ef4444" // red
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RoleCard roles={roles} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              border: "1px solid #f0f0f0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: "#f97316" + "15",
                  color: "#f97316",
                  borderRadius: 2,
                  p: 1,
                  mr: 1,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="24px"
                  height="24px"
                >
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75Z" />
                </svg>
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Hoạt động gần đây
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box>
              {[
                "Nguyễn Văn A đã đăng ký tài khoản mới",
                "Bác sĩ Trần B đã hoàn thành tư vấn",
                "Admin đã cập nhật thông tin dịch vụ",
                "Phòng xét nghiệm đã cập nhật 15 kết quả mới",
              ].map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1.5,
                    borderBottom: index !== 3 ? "1px solid #f0f0f0" : "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#64748b",
                      mr: 2,
                    }}
                  />
                  <Typography variant="body2">{activity}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

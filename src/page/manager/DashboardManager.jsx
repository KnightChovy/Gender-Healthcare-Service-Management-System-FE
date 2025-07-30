import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import axiosClient from "../../services/axiosClient";

const StatCard = ({ icon, label, value, color, bg }) => (
  <Paper
    elevation={4}
    sx={{
      display: "flex",
      alignItems: "center",
      p: 3,
      borderRadius: 4,
      background: bg,
      boxShadow: "0 6px 32px #c7d2fe33",
      minHeight: 110,
    }}
  >
    <Avatar
      sx={{
        bgcolor: color,
        width: 56,
        height: 56,
        mr: 2,
        boxShadow: "0 2px 12px #6366f155",
      }}
    >
      {icon}
    </Avatar>
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: 22, color: color }}>
        {value}
      </Typography>
      <Typography sx={{ color: "#334155", fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  </Paper>
);

export const DashboardManager = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConsult: 0,
    pendingConsult: 0,
    completedConsult: 0,
    totalTest: 0,
    pendingTest: 0,
    completedTest: 0,
    revenueConsult: 0,
    revenueTest: 0,
  });
  const [recentConsults, setRecentConsults] = useState([]);
  const [recentTests, setRecentTests] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Lịch tư vấn
        const resConsult = await axiosClient.get("v1/managers/appointments");
        const consults = resConsult.data?.data || [];
        const completedConsult = consults.filter(
          (c) => c.status === "completed"
        );
        const pendingConsult = consults.filter((c) => c.status === "pending");
        const revenueConsult = completedConsult.reduce(
          (sum, c) => sum + (Number(c.price_apm) || 0),
          0
        );
        setRecentConsults(
          consults
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
        );

        // Lịch xét nghiệm
        const resTest = await axiosClient.get("v1/staff/getAllOrder");
        const orders = resTest.data?.data?.orders || [];
        const completedTest = orders.filter(
          (o) => o.order?.order_status === "completed"
        );
        const pendingTest = orders.filter(
          (o) => o.order?.order_status === "pending"
        );
        const revenueTest = completedTest.reduce(
          (sum, o) => sum + (Number(o.order?.total_amount) || 0),
          0
        );
        setRecentTests(
          orders
            .sort(
              (a, b) =>
                new Date(b.order?.created_at) - new Date(a.order?.created_at)
            )
            .slice(0, 5)
        );

        setStats({
          totalConsult: consults.length,
          pendingConsult: pendingConsult.length,
          completedConsult: completedConsult.length,
          totalTest: orders.length,
          pendingTest: pendingTest.length,
          completedTest: completedTest.length,
          revenueConsult,
          revenueTest,
        });
      } catch (err) {
        setStats({
          totalConsult: 0,
          pendingConsult: 0,
          completedConsult: 0,
          totalTest: 0,
          pendingTest: 0,
          completedTest: 0,
          revenueConsult: 0,
          revenueTest: 0,
        });
        setRecentConsults([]);
        setRecentTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f3f4f6 60%, #dbeafe 100%)",
        minHeight: "100vh",
        p: { xs: 1, md: 4 },
      }}
    >
      <Typography
        sx={{
          color: "#0f172a",
          fontWeight: 900,
          mb: 4,
          fontSize: { xs: 28, md: 36 },
          letterSpacing: 1,
          textShadow: "0 2px 8px #e0e7ef",
        }}
        variant="h4"
      >
        Dashboard Quản lý Hệ thống
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<AssignmentIcon fontSize="large" />}
            label="Lịch tư vấn"
            value={stats.totalConsult}
            color="#6366f1"
            bg="#eef2ff"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<ScienceIcon fontSize="large" />}
            label="Lịch xét nghiệm"
            value={stats.totalTest}
            color="#10b981"
            bg="#ecfdf5"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<MonetizationOnIcon fontSize="large" />}
            label="Doanh thu tư vấn"
            value={stats.revenueConsult.toLocaleString("vi-VN") + "₫"}
            color="#6366f1"
            bg="#eef2ff"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<LocalAtmIcon fontSize="large" />}
            label="Doanh thu xét nghiệm"
            value={stats.revenueTest.toLocaleString("vi-VN") + "₫"}
            color="#10b981"
            bg="#ecfdf5"
          />
        </Grid>
      </Grid>

      {/* Tổng hợp trạng thái */}
      {!loading && (
        <Paper
          sx={{
            borderRadius: 4,
            mb: 4,
            p: { xs: 2, md: 4 },
            background: "linear-gradient(120deg, #fff 80%, #e0e7ff 100%)",
            boxShadow: "0 4px 24px #c7d2fe55",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: "#3b82f6" }}
          >
            Tổng hợp trạng thái
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#6366f1" }}
              >
                Lịch tư vấn
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Chip
                  icon={<HourglassEmptyIcon />}
                  label={`Đang chờ: ${stats.pendingConsult}`}
                  color="warning"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Hoàn thành: ${stats.completedConsult}`}
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Tổng: ${stats.totalConsult}`}
                  sx={{ fontWeight: 600, background: "#eef2ff" }}
                />
              </Stack>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#10b981" }}
              >
                Lịch xét nghiệm
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Chip
                  icon={<HourglassEmptyIcon />}
                  label={`Đang chờ: ${stats.pendingTest}`}
                  color="warning"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Hoàn thành: ${stats.completedTest}`}
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={`Tổng: ${stats.totalTest}`}
                  sx={{ fontWeight: 600, background: "#ecfdf5" }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* Bảng lịch gần đây */}
      {!loading && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                borderRadius: 4,
                mb: 4,
                p: { xs: 2, md: 4 },
                background: "#fff",
                boxShadow: "0 4px 24px #c7d2fe33",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#6366f1",
                  letterSpacing: 0.5,
                }}
              >
                Lịch tư vấn gần đây
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "#eef2ff" }}>
                      <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentConsults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentConsults.map((c) => (
                        <TableRow key={c.appointment_id}>
                          <TableCell>{c.appointment_id}</TableCell>
                          <TableCell>
                            {c.appointments_user?.last_name}{" "}
                            {c.appointments_user?.first_name}
                          </TableCell>
                          <TableCell>
                            {c.appointment_time
                              ? new Date(c.appointment_time).toLocaleString(
                                  "vi-VN"
                                )
                              : ""}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                c.status === "completed"
                                  ? "Hoàn thành"
                                  : c.status === "pending"
                                  ? "Đang chờ"
                                  : c.status
                              }
                              color={
                                c.status === "completed"
                                  ? "success"
                                  : c.status === "pending"
                                  ? "warning"
                                  : "default"
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                borderRadius: 4,
                mb: 4,
                p: { xs: 2, md: 4 },
                background: "#fff",
                boxShadow: "0 4px 24px #c7d2fe33",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: "#10b981",
                  letterSpacing: 0.5,
                }}
              >
                Lịch xét nghiệm gần đây
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ background: "#ecfdf5" }}>
                      <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentTests.map((o) => (
                        <TableRow key={o.order?.order_id}>
                          <TableCell>{o.order?.order_id}</TableCell>
                          <TableCell>
                            {o.order?.user?.last_name}{" "}
                            {o.order?.user?.first_name}
                          </TableCell>
                          <TableCell>
                            {o.order?.created_at
                              ? new Date(o.order.created_at).toLocaleString(
                                  "vi-VN"
                                )
                              : ""}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                o.order?.order_status === "completed"
                                  ? "Hoàn thành"
                                  : o.order?.order_status === "pending"
                                  ? "Đang chờ"
                                  : o.order?.order_status
                              }
                              color={
                                o.order?.order_status === "completed"
                                  ? "success"
                                  : o.order?.order_status === "pending"
                                  ? "warning"
                                  : "default"
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress color="primary" size={40} sx={{ thickness: 5 }} />
        </Box>
      )}
    </Box>
  );
};

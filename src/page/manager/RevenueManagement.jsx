import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import axiosClient from "../../services/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

const GROUP_OPTIONS = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
];

export default function RevenueManagement() {
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState("month");
  const [dataService1, setDataService1] = useState([]);
  const [dataService2, setDataService2] = useState([]);

  // Hàm group doanh thu theo ngày/tuần/tháng
  const groupRevenue = (data, type) => {
    const grouped = {};
    data.forEach((item) => {
      let key;
      if (type === "day") key = dayjs(item.date).format("YYYY-MM-DD");
      else key = dayjs(item.date).format("YYYY-MM");
      grouped[key] = (grouped[key] || 0) + item.amount;
    });
    // Trả về mảng cho recharts
    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        // Dịch vụ 1
        const res1 = await axiosClient.get("v1/managers/appointments");
        const apmArr = res1.data?.data || [];
        const filtered1 = apmArr
          .filter((item) => item.status === "completed")
          .map((item) => ({
            amount: Number(item.price_apm) || 0,
            date: item.created_at,
          }));
        setDataService1(groupRevenue(filtered1, groupBy));

        // Dịch vụ 2
        const res2 = await axiosClient.get("v1/staff/getAllOrder");
        const ordersArr = res2.data?.data?.orders || [];
        const filtered2 = ordersArr
          .filter((item) => item.order?.order_status === "completed")
          .map((item) => ({
            amount: Number(item.order?.total_amount) || 0,
            date: item.order?.created_at,
          }));
        setDataService2(groupRevenue(filtered2, groupBy));
      } catch (error) {
        setDataService1([]);
        setDataService2([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [groupBy]);

  // Gộp data cho recharts
  const mergedData = (() => {
    const map = {};
    dataService1.forEach((item) => {
      map[item.date] = {
        date: item.date,
        "Dịch vụ tư vấn": item.amount,
        "Dịch vụ xét nghiệm": 0,
      };
    });
    dataService2.forEach((item) => {
      if (!map[item.date])
        map[item.date] = {
          date: item.date,
          "Dịch vụ tư vấn": 0,
          "Dịch vụ xét nghiệm": 0,
        };
      map[item.date]["Dịch vụ xét nghiệm"] = item.amount;
    });
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  })();

  const total1 = dataService1.reduce((sum, d) => sum + d.amount, 0);
  const total2 = dataService2.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Box
      sx={{
        p: { xs: 1, md: 4 },
        background: "linear-gradient(135deg, #f3f4f6 60%, #dbeafe 100%)",
        minHeight: "100vh",
      }}
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
        Quản lý doanh thu
      </Typography>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 4,
          boxShadow: "0 4px 24px #c7d2fe55",
          background: "linear-gradient(120deg, #fff 80%, #e0e7ff 100%)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 700 }}>
            Doanh thu theo{" "}
            {GROUP_OPTIONS.find((g) => g.value === groupBy).label}
          </Typography>
          <ToggleButtonGroup
            value={groupBy}
            exclusive
            onChange={(_, val) => val && setGroupBy(val)}
            size="small"
            sx={{ ml: 2, background: "#f1f5f9", borderRadius: 2 }}
          >
            {GROUP_OPTIONS.map((g) => (
              <ToggleButton
                key={g.value}
                value={g.value}
                sx={{ fontWeight: 600 }}
              >
                {g.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip
            icon={<MonetizationOnIcon sx={{ color: "#6366f1" }} />}
            label={
              <span>
                Tổng doanh thu tư vấn:{" "}
                <b style={{ color: "#6366f1" }}>
                  {total1.toLocaleString("vi-VN")}₫
                </b>
              </span>
            }
            sx={{
              background: "#eef2ff",
              color: "#222",
              fontWeight: 600,
              fontSize: 16,
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          />
          <Chip
            icon={<LocalAtmIcon sx={{ color: "#10b981" }} />}
            label={
              <span>
                Tổng doanh thu xét nghiệm:{" "}
                <b style={{ color: "#10b981" }}>
                  {total2.toLocaleString("vi-VN")}₫
                </b>
              </span>
            }
            sx={{
              background: "#ecfdf5",
              color: "#222",
              fontWeight: 600,
              fontSize: 16,
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          />
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress size={40} thickness={5} color="primary" />
          </Box>
        ) : (
          <Box sx={{ width: "100%", height: 480 }}>
            <ResponsiveContainer>
              <BarChart
                data={mergedData}
                margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  allowDataOverflow={true}
                  tickFormatter={(value) => value.toLocaleString("vi-VN")}
                  width={110}
                />
                <Tooltip
                  formatter={(value) => value.toLocaleString("vi-VN") + "₫"}
                />
                <Legend />
                <Bar
                  dataKey="Dịch vụ tư vấn"
                  fill="#6366f1"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="Dịch vụ xét nghiệm"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

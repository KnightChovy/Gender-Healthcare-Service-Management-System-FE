import * as React from "react";
import { styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import DatasetIcon from "@mui/icons-material/Dataset";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/feature/auth/authenSlice";

const drawerWidth = 280;

// Gradient background for AppBar - Giữ màu xanh dương hiện tại
const appBarGradient = "linear-gradient(90deg, #2c3e50 0%, #34495e 100%)";

// Styled AppBar with gradient
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: appBarGradient,
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Styled Search component
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// Animate the drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#ffffff",
  boxShadow: "0 0 15px rgba(0,0,0,0.05)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#ffffff",
  boxShadow: "0 0 15px rgba(0,0,0,0.05)",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  background: appBarGradient,
  color: "#ffffff",
  minHeight: 64,
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function LayoutAdmin() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Dashboard",
      path: "/admin",
      icon: <DashboardIcon />,
    },
    {
      text: "Quản lí nhân sự",
      path: "/admin/employees",
      icon: <AssignmentIndIcon />,
    },
    {
      text: "Quản lí dữ liệu",
      path: "/admin/data",
      icon: <DatasetIcon />,
    },
    {
      text: "Quản lí người dùng",
      path: "/admin/users",
      icon: <ManageAccountsIcon />,
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      {/* App Bar with gradient and enhanced styling */}
      <AppBar position="fixed" open={open} elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          {/* Left section with brand and toggle */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 2,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              fontWeight="700"
              sx={{
                letterSpacing: -0.5,
                background:
                  "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GenCare Admin Portal
            </Typography>
          </Box>

          {/* Center section with search */}
          <Search sx={{ display: { xs: "none", md: "block" }, maxWidth: 400 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          {/* Right section with user profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" size="large">
              <Badge badgeContent={4} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                A
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  sx={{ lineHeight: 1.2 }}
                >
                  Admin User
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Administrator
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Redesigned Drawer with better styling */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography
            variant="h6"
            sx={{
              ml: 2,
              fontWeight: "bold",
              display: open ? "block" : "none",
              background:
                "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GenCare Admin
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Box sx={{ mt: 2, mb: 1, px: 2, display: open ? "block" : "none" }}>
          <Typography
            variant="overline"
            sx={{ color: "#94a3b8", fontWeight: 600, letterSpacing: 1 }}
          >
            QUẢN TRỊ
          </Typography>
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/admin" && location.pathname === "/admin/");

            return (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: "block",
                  mb: 0.5,
                }}
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    py: 1.2,
                    borderRadius: 2,
                    justifyContent: open ? "initial" : "center",
                    background: isActive
                      ? "linear-gradient(90deg, #2980b9 0%, #3498db 100%)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(41, 128, 185, 0.2)"
                      : "none",
                    "&:hover": {
                      backgroundColor: isActive
                        ? ""
                        : "rgba(41, 128, 185, 0.08)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? "#ffffff" : "#64748b",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      "& .MuiTypography-root": {
                        fontWeight: 500,
                        color: isActive ? "#ffffff" : "#334155",
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider sx={{ mx: 2, opacity: 0.6 }} />

        <Box sx={{ mt: 1, mb: 1, px: 2, display: open ? "block" : "none" }}>
          <Typography
            variant="overline"
            sx={{ color: "#94a3b8", fontWeight: 600, letterSpacing: 1 }}
          >
            HỆ THỐNG
          </Typography>
        </Box>

        <List sx={{ px: 1, mb: 2 }}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                px: 2.5,
                py: 1.2,
                borderRadius: 2,
                justifyContent: open ? "initial" : "center",
                "&:hover": {
                  backgroundColor: "rgba(231, 76, 60, 0.08)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "#e74c3c",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Đăng xuất"
                sx={{
                  opacity: open ? 1 : 0,
                  "& .MuiTypography-root": {
                    fontWeight: 500,
                    color: "#e74c3c",
                    fontSize: "0.95rem",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main content area with improved styling */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f7fa", // Giữ màu nền chính
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
            p: { xs: 2, md: 3 },
            minHeight: "calc(100vh - 100px)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

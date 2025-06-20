import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/feature/auth/authenSlice";
import { toast } from "react-toastify"; // Thêm import toast
import axiosClient from "../../services/axiosClient";

export default function AccountMenu() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      handleClose();
      toast.info("Đang đăng xuất...", { autoClose: 800 });

      const response = await axiosClient.post("/v1/auth/logout");

      if (response.data?.success) {
        setTimeout(() => {
          dispatch(logout());
          toast.success("Đăng xuất thành công", { autoClose: 1500 });
          navigate("/login");
        }, 500);
      } else {
        toast.error("Logout thất bại: " + (response.data?.message || ""));
      }
    } catch (error) {
      console.error("Lỗi khi logout:", error);

      if (error.response) {
        console.error("Chi tiết lỗi từ server:", error.response.data);
        toast.error(
          "Logout thất bại: " +
            (error.response.data?.message || "403 Forbidden")
        );
      } else {
        toast.error("Lỗi mạng hoặc server không phản hồi.");
      }
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const userRole = user?.role || "user";

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Cài đặt tài khoản">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#3b82f6",
                fontWeight: "bold",
              }}
            >
              {user?.first_name?.charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar />
          <Link to="/profile">Hồ sơ</Link>
        </MenuItem>

        {(() => {
          switch (userRole) {
            case "admin":
              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/admin");
                  }}
                >
                  <Avatar /> Trang quản trị
                </MenuItem>
              );
            case "doctor":
              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/doctor");
                  }}
                >
                  <Avatar /> Bảng điều khiển Bác sĩ
                </MenuItem>
              );
            case "manager":
              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/manager");
                  }}
                >
                  <Avatar /> Bảng điều khiển Quản lý
                </MenuItem>
              );
            case "user":
            default:
              return (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                >
                  <Avatar /> Đổi mật khẩu
                </MenuItem>
              );
          }
        })()}

        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Thêm tài khoản khác
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

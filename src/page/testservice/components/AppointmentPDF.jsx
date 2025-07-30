import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import roboto from "../../../assets/fonts/Roboto-Regular.ttf";
// Tạo styles cho PDF
Font.register({
  family: "Roboto",
  src: roboto,
});
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#3B82F6",
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  content: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
  },
  tableCellService: {
    width: "70%",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableCellPrice: {
    width: "30%",
    textAlign: "right",
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
    color: "#6B7280",
  },
  totalRow: {
    backgroundColor: "#EFF6FF",
    fontWeight: "bold",
  },
  important: {
    color: "red",
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: "bold",
  },
});

const AppointmentPDF = ({ appointmentDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Phiếu Hẹn Xét Nghiệm</Text>

      <View style={styles.section}>
        <Text style={styles.title}>Mã lịch hẹn:</Text>
        <Text style={styles.content}>
          {appointmentDetails.order_id || "Đang cập nhật"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Thông tin cá nhân:</Text>
        <Text style={styles.content}>
          Họ tên: {appointmentDetails.userInfo.fullName}
        </Text>
        <Text style={styles.content}>
          Email: {appointmentDetails.userInfo.email}
        </Text>
        <Text style={styles.content}>
          SĐT: {appointmentDetails.userInfo.phone}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Thông tin lịch hẹn:</Text>
        <Text style={styles.content}>
          Ngày khám: {appointmentDetails.exam_date}
        </Text>
        <Text style={styles.content}>
          Giờ khám: {appointmentDetails.exam_time}
        </Text>
        <Text style={styles.content}>
          Phương thức thanh toán: Thanh toán tại cơ sở y tế
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Dịch vụ đã đặt:</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, styles.tableCellService]}>
              <Text>Tên dịch vụ</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellPrice]}>
              <Text>Giá (VNĐ)</Text>
            </View>
          </View>

          {appointmentDetails.services.map((service, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableCellService]}>
                <Text>{service.name}</Text>
              </View>
              <View style={[styles.tableCell, styles.tableCellPrice]}>
                <Text>
                  {new Intl.NumberFormat("vi-VN").format(service.price)}
                </Text>
              </View>
            </View>
          ))}

          <View style={[styles.tableRow, styles.totalRow]}>
            <View style={[styles.tableCell, styles.tableCellService]}>
              <Text>Tổng cộng</Text>
            </View>
            <View style={[styles.tableCell, styles.tableCellPrice]}>
              <Text>
                {new Intl.NumberFormat("vi-VN").format(
                  appointmentDetails.totalAmount
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {appointmentDetails.medicalHistory && (
        <View style={styles.section}>
          <Text style={styles.title}>Lịch sử bệnh:</Text>
          <Text style={styles.content}>
            {appointmentDetails.medicalHistory}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.title}>Lưu ý quan trọng:</Text>
        <Text style={styles.content}>
          - Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục.
        </Text>
        <Text style={styles.important}>
          - Mang theo phiếu hẹn xét nghiệm (bắt buộc).
        </Text>
        <Text style={styles.content}>
          - Mang theo CMND/CCCD và thẻ BHYT (nếu có).
        </Text>
        <Text style={styles.content}>
          - Nếu cần hủy/đổi lịch, vui lòng thông báo trước ít nhất 24 giờ.
        </Text>
      </View>

      <Text style={styles.footer}>
        Ngày tạo: {appointmentDetails.createdAt} | Mã phiếu:
        {appointmentDetails.order_id || "Đang cập nhật"}
      </Text>
    </Page>
  </Document>
);

export default AppointmentPDF;

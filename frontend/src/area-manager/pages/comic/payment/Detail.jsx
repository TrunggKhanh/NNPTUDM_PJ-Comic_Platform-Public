import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Lấy dữ liệu từ navigate state
import { Table, message } from "antd";
import { fetchPaymentsByCustomer } from "@/area-manager/services/paymentService";
import styles from "@/area-manager/styles/author-index.module.css";
import withPermission from "@/area-manager/withPermission";

const PaymentDetail = () => {
  const location = useLocation();
  const { customer } = location.state || {}; // Dữ liệu khách hàng từ navigate
  const userId = customer?.IdUser; // Lấy IdUser từ state
  const userName = customer?.GoogleAccount || "Không rõ"; // Lấy tên từ state hoặc mặc định

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      message.error("Không thể lấy thông tin khách hàng!");
      return;
    }
    loadPayments();
  }, [userId]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await fetchPaymentsByCustomer(userId);
      setPayments(data.map((payment) => ({ ...payment, key: payment.IdPayment })));
    } catch (error) {
      message.error("Không thể tải danh sách thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã Thanh Toán",
      dataIndex: "IdPayment",
      key: "IdPayment",
    },
    {
      title: "Số Tiền",
      dataIndex: "PayAmount",
      key: "PayAmount",
      render: (amount) => `${amount.toLocaleString()} VNĐ`,
    },
    {
      title: "Phương Thức",
      dataIndex: "PayMethod",
      key: "PayMethod",
    },
    {
      title: "Trạng Thái",
      dataIndex: "PayStats",
      key: "PayStats",
      render: (status) => {
        let color = "gray";
        switch (status) {
          case "Completed":
            color = "green";
            break;
          case "Cancelled":
            color = "red";
            break;
          case "Pending":
            color = "blue";
            break;
          default:
            break;
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Ngày Thanh Toán",
      dataIndex: "PayDate",
      key: "PayDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Hết Hạn",
      dataIndex: "ExpiresTime",
      key: "ExpiresTime",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "Không xác định"),
    },
  ];

  return (
    <div className={styles.authorIndexContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h1 className={styles.authorIndexTitle}>
          Chi Tiết Thanh Toán - <span style={{ color: "#0056b3" }}>{userName}</span>{" "}
          <span style={{ backgroundColor: "#f8f9fa", padding: "0 8px", borderRadius: "4px", fontWeight: "bold" }}>
            ID: {userId}
          </span>
        </h1>
      </div>
      <Table
        dataSource={payments}
        columns={columns}
        loading={loading}
        className={styles.antTable}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default withPermission(PaymentDetail, 10); // Quyền truy cập chi tiết thanh toán

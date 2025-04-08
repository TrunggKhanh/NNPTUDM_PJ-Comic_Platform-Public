import { useState, useEffect } from "react";
import { Table, message } from "antd";
import { fetchPayments } from "@/area-manager/services/paymentService"; // Sử dụng service đã viết
import styles from "@/area-manager/styles/author-index.module.css";

const PaymentIndex = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await fetchPayments(); // Gọi API để lấy toàn bộ dữ liệu thanh toán
      setPayments(data.map((payment) => ({ ...payment, key: payment.IdPayment })));
    } catch (error) {
      console.error("Error fetching payments:", error);
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
        <h1 className={styles.authorIndexTitle}>Danh Sách Thanh Toán</h1>
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

export default PaymentIndex;

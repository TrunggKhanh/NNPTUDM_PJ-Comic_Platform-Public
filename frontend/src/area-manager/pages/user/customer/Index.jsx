import { useState, useEffect } from "react";
import { Table, Button, message, Modal } from "antd";
import {
  fetchCustomers,
  deleteCustomer,
  toggleCustomerActive,
} from "@/area-manager/services/userService"; // Cập nhật tên service
import withPermission from "@/area-manager/withPermission";
import styles from "@/area-manager/styles/author-index.module.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate(); // Sử dụng hook điều hướng

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchCustomers();
      setCustomers(data.map((customer) => ({ ...customer, key: customer.IdUser }))); // Cập nhật sử dụng IdUser từ API
    } catch {
      message.error("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (customer) => {
    setConfirmAction({ type: "delete", record: customer });
    setCountdown(5);
  };

  const executeDelete = async () => {
    if (confirmAction?.type !== "delete") return;
    try {
      await deleteCustomer(confirmAction.record.IdUser);
      message.success("Xóa khách hàng thành công");
      loadCustomers();
    } catch {
      message.error("Không thể xóa khách hàng");
    } finally {
      setConfirmAction(null);
      setCountdown(5);
    }
  };

  const handleToggleActive = (record) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có chắc chắn muốn ${
        record.ActivePremium ? "vô hiệu hóa" : "kích hoạt"
      } khách hàng này không?`,
      onOk: async () => {
        try {
          await toggleCustomerActive(record.IdUser);
          message.success(
            `Trạng thái đã được ${
              record.ActivePremium ? "vô hiệu hóa" : "kích hoạt"
            } thành công`
          );
          loadCustomers();
        } catch {
          message.error("Không thể thay đổi trạng thái khách hàng");
        }
      },
    });
  };

  const handleNavigateToPayments = (customer) => {
    navigate(`/manager/user/customer-index/customer-payment-detail/${customer.IdUser}`, {
      state: { customer }, // Truyền thông tin khách hàng
    });
  };
  

  const columns = [
    {
      title: "ID Khách Hàng",
      dataIndex: "IdUser",
      key: "IdUser",
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "GoogleAccount",
      key: "GoogleAccount",
    },
    {
      title: "Email",
      dataIndex: "FacebookAccount",
      key: "FacebookAccount",
    },
    {
      title: "Premium",
      key: "ActivePremium",
      render: (record) => (
        <div
          onClick={() => handleToggleActive(record)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: record.ActivePremium ? "green" : "red",
          }}
        >
          {record.ActivePremium ? (
            <>
              <i className="feather icon-check-circle" /> Premium
            </>
          ) : (
            <>
              <i className="feather icon-slash" /> Không Premium
            </>
          )}
        </div>
      ),
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Button
            type="link"
            icon={<i className="feather icon-eye" />}
            onClick={() => handleNavigateToPayments(record)} // Chuyển hướng đến chi tiết thanh toán
          >
            Detail Payment
          </Button>
          <Button
            type="link"
            icon={<i className="feather icon-trash" />}
            onClick={() => handleDelete(record)}
            danger
          />
        </div>
      ),
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
        <h1 className={styles.authorIndexTitle}>Danh Sách Khách Hàng</h1>
      </div>
      <Table
        dataSource={customers}
        columns={columns}
        loading={loading}
        className={styles.antTable}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Cảnh báo xóa"
        visible={confirmAction?.type === "delete"}
        onOk={executeDelete}
        onCancel={() => setConfirmAction(null)}
        okText={`Xóa ngay (${countdown})`}
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa khách hàng này không? Thao tác không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default withPermission(CustomerManagement, 4);

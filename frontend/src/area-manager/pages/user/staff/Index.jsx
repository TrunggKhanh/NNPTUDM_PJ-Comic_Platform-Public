
import { useState, useEffect } from "react";
import { Table, Button, message, Modal, Form, Input } from "antd";
import {
  fetchStaffs,
  deleteStaff,
  updateStaff,
  toggleStaffActive,
} from "@/area-manager/services/userService"; // Cập nhật tên service
import AddStaff from "../staff/Add";
import styles from "@/area-manager/styles/author-index.module.css";

const StaffManagement = () => {

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = async () => {
    setLoading(true);
    try {
      const data = await fetchStaffs();
      setStaffs(data.map((staff) => ({ ...staff, key: staff.id }))); // Cập nhật sử dụng id từ API
    } catch {
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (staff) => {
    setConfirmAction({ type: "delete", record: staff });
    setCountdown(5);
  };

  const executeDelete = async () => {
    if (confirmAction?.type !== "delete") return;
    try {
      await deleteStaff(confirmAction.record.id);
      message.success("Xóa nhân viên thành công");
      loadStaffs();
    } catch {
      message.error("Không thể xóa nhân viên");
    } finally {
      setConfirmAction(null);
      setCountdown(5);
    }
  };

  const handleToggleActive = (record) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có chắc chắn muốn ${
        record.active ? "vô hiệu hóa" : "kích hoạt"
      } nhân viên này không?`,
      onOk: async () => {
        try {
          await toggleStaffActive(record.id);
          message.success(
            `Trạng thái đã được ${
              record.active ? "vô hiệu hóa" : "kích hoạt"
            } thành công`
          );
          loadStaffs();
        } catch {
          message.error("Không thể thay đổi trạng thái nhân viên");
        }
      },
    });
  };

  const handleUpdate = (staff) => {
    setEditingStaff(staff);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateStaff(editingStaff.id, values); // Sử dụng id thay vì _id
      message.success("Cập nhật nhân viên thành công");
      setIsEditModalVisible(false);
      loadStaffs();
    } catch {
      message.error("Không thể cập nhật nhân viên");
    }
  };

  const columns = [
    {
      title: "ID Nhân Viên",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng Thái",
      key: "active",
      render: (record) => (
        <div
          onClick={() => handleToggleActive(record)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: record.active ? "green" : "red",
          }}
        >
          {record.active ? (
            <>
              <i className="feather icon-check-circle" /> Hoạt Động
            </>
          ) : (
            <>
              <i className="feather icon-slash" /> Vô Hiệu
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
            icon={<i className="feather icon-edit" />}
            onClick={() => handleUpdate(record)}
          />
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
        <h1 className={styles.authorIndexTitle}>Danh Sách Nhân Viên</h1>
        <Button
          onClick={() => setIsAddModalVisible(true)}
          className={styles.addAuthorBtn}
        >
          Thêm Nhân Viên
        </Button>
      </div>
      <Table
        dataSource={staffs}
        columns={columns}
        loading={loading}
        className={styles.antTable}
        pagination={{ pageSize: 10 }}
      />

      <AddStaff
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={loadStaffs}
      />

      <Modal
        title="Cập Nhật Nhân Viên"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{ username: editingStaff?.username, email: editingStaff?.email }}
        >
          <Form.Item
            name="username"
            label="Tên Nhân Viên"
            rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cảnh báo xóa"
        visible={confirmAction?.type === "delete"}
        onOk={executeDelete}
        onCancel={() => setConfirmAction(null)}
        okText={`Xóa ngay (${countdown})`}
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa nhân viên này không? Thao tác không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default StaffManagement;

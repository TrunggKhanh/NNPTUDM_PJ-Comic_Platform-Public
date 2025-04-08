import { useState, useEffect } from "react";
import { Table, Button, message, Modal, Form, Input, Select, Switch } from "antd";
import {
  fetchPermissions,
  deletePermission,
  updatePermission,
  togglePermissionActive,
  updatePermissionStats,
} from "@/area-manager/services/rbacService"; // Cập nhật tên service
import AddPermission from "../config-service/permissionAdd";
import styles from "@/area-manager/styles/author-index.module.css";
import withPermission from "@/area-manager/withPermission";

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const data = await fetchPermissions();
      console.log("Fetched Permissions:", JSON.stringify(data, null, 2)); // Log toàn bộ dữ liệu trả về
      setPermissions(data.map((permission) => ({
        ...permission,
        key: permission.IdPermissions,
        active: permission.Active,
      }))); // Cập nhật sử dụng IdPermissions và Active từ API
    } catch (error) {
      console.error("Error fetching permissions:", error);
      message.error("Không thể tải danh sách quyền");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = (permission) => {
    setConfirmAction({ type: "delete", record: { id: permission.IdPermissions, PermissionsName: permission.PermissionsName } });
    setCountdown(5);
  };

  const executeDelete = async () => {
    if (confirmAction?.type !== "delete") return;
    try {
      await deletePermission(confirmAction.record.id);
      message.success("Xóa quyền thành công");
      loadPermissions();
    } catch {
      message.error("Không thể xóa quyền");
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
      } quyền này không?`,
      onOk: async () => {
        try {
          await togglePermissionActive(record.IdPermissions);
          message.success(
            `Trạng thái đã được ${
              record.active ? "vô hiệu hóa" : "kích hoạt"
            } thành công`
          );
          loadPermissions();
        } catch {
          message.error("Không thể thay đổi trạng thái quyền");
        }
      },
    });
  };

  const handleUpdateStats = (record, newStatus) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái",
      content: `Bạn có chắc chắn muốn cập nhật trạng thái quyền này thành "${newStatus}" không?`,
      onOk: async () => {
        try {
          await updatePermissionStats(record.IdPermissions, { PermissionsStats: newStatus });
          message.success("Cập nhật trạng thái quyền thành công");
          loadPermissions();
        } catch {
          message.error("Không thể cập nhật trạng thái quyền");
        }
      },
    });
  };

  const handleUpdate = (permission) => {
    setEditingPermission(permission);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await updatePermission(editingPermission.IdPermissions, values); // Sử dụng IdPermissions thay vì _id
      message.success("Cập nhật quyền thành công");
      setIsEditModalVisible(false);
      loadPermissions();
    } catch {
      message.error("Không thể cập nhật quyền");
    }
  };

  const AddButton = withPermission(
    ({ onClick }) => (
      <Button type="primary" onClick={onClick} className={styles.addAuthorBtn}>
        Thêm Quyền
      </Button>
    ),
    2 // Quyền thêm mới
  );

  const ToggleSwitch = withPermission(
    ({ record, onToggle }) => (
      <Switch
        checked={record.active}
        onChange={onToggle}
        checkedChildren="Hoạt động"
        unCheckedChildren="Vô hiệu"
      />
    ),
    2 // Quyền kích hoạt trạng thái
  );

  const columns = [
    {
      title: "ID Quyền",
      dataIndex: "IdPermissions",
      key: "IdPermissions",
    },
    {
      title: "Tên Quyền",
      dataIndex: "PermissionsName",
      key: "PermissionsName",
    },
    {
      title: "Mô Tả",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Trạng Thái",
      dataIndex: "PermissionsStats",
      key: "PermissionsStats",
      render: (text, record) => (
        <Select
          value={text}
          onChange={(newStatus) => handleUpdateStats(record, newStatus)}
          style={{ width: 150 }}
        >
          <Select.Option value="Có hiệu lực">Có hiệu lực</Select.Option>
          <Select.Option value="Bảo trì">Bảo trì</Select.Option>
          <Select.Option value="Ngừng vĩnh viễn">Ngừng vĩnh viễn</Select.Option>
        </Select>
      ),
    },
    {
      title: "Hoạt Động",
      key: "active",
      render: (record) => (
        <ToggleSwitch record={record} onToggle={() => handleToggleActive(record)} />
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
        <h1 className={styles.authorIndexTitle}>Danh Sách Quyền</h1>
        <AddButton onClick={() => setIsAddModalVisible(true)} />
      </div>
      <Table
        dataSource={permissions}
        columns={columns}
        loading={loading}
        className={styles.antTable}
        pagination={{ pageSize: 10 }}
      />

      <AddPermission
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={loadPermissions}
      />

      <Modal
        title="Cập Nhật Quyền"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{ PermissionsName: editingPermission?.PermissionsName, Description: editingPermission?.Description }}
        >
          <Form.Item
            name="PermissionsName"
            label="Tên Quyền"
            rules={[{ required: true, message: "Vui lòng nhập tên quyền!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Mô Tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
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
        <p>Bạn có chắc chắn muốn xóa quyền này không? Thao tác không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default withPermission(PermissionsManagement, 2); // Quyền truy cập vào trang là 2

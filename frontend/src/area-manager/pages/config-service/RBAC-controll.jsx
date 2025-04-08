import { useState, useEffect } from "react";
import { Table, Select, Button, Input, message, Switch, Modal, Form } from "antd";
import {
  fetchStaffs,
  fetchPermissions,
  fetchStaffPermissions,
  toggleStaffPermissionActive,
  grantPermission,
  updatePermission,
} from "@/area-manager/services/rbacService";
// Import HOC withPermission
import withPermission from "@/area-manager/withPermission";
import styles from "@/area-manager/styles/author-index.module.css";

const RBACController = () => {
  const [staffs, setStaffs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = async () => {
    setLoading(true);
    try {
      const staffData = await fetchStaffs();
      setStaffs(
        staffData.map((staff) => ({
          ...staff,
          label: `${staff.IdUser} - ${staff.FullName}`,
          value: staff.IdUser,
        }))
      );
    } catch {
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async (userId) => {
    setLoading(true);
    try {
      const permissionsData = await fetchPermissions();
      const staffPermissions = await fetchStaffPermissions(userId);

      const updatedPermissions = permissionsData.map((permission) => {
        const matchingPermission = staffPermissions.find(
          (sp) => sp.IdPermissions === permission.IdPermissions
        );

        return {
          ...permission,
          active: matchingPermission?.Active || false,
          granted: !!matchingPermission,
        };
      });

      setPermissions(updatedPermissions);
    } catch {
      message.error("Không thể tải danh sách quyền");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffChange = (staffId) => {
    setSelectedStaff(staffId);
    loadPermissions(staffId);
  };

  const handleToggleActive = async (permission) => {
    try {
      await toggleStaffPermissionActive(selectedStaff, permission.IdPermissions);
      message.success("Thay đổi trạng thái quyền thành công");
      loadPermissions(selectedStaff);
    } catch {
      message.error("Không thể thay đổi trạng thái quyền");
    }
  };

  const handleGrantPermission = async (permission) => {
    try {
      await grantPermission(selectedStaff, permission.IdPermissions);
      message.success("Cấp quyền thành công");
      loadPermissions(selectedStaff);
    } catch {
      message.error("Không thể cấp quyền");
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await updatePermission(editingPermission.IdPermissions, values);
      message.success("Cập nhật quyền thành công");
      setIsEditModalVisible(false);
      loadPermissions(selectedStaff);
    } catch {
      message.error("Không thể cập nhật quyền");
    }
  };

  const filteredStaffs = staffs.filter((staff) =>
    staff.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.IdUser.toLowerCase().includes(searchTerm.toLowerCase())
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
      key: "active",
      render: (record) => (
        <Switch
          checked={record.active}
          onChange={() => handleToggleActive(record)}
          disabled={!record.granted}
          checkedChildren="Hoạt động"
          unCheckedChildren="Vô hiệu"
        />
      ),
    },
    {
      title: "Cấp Quyền",
      key: "grant",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => handleGrantPermission(record)}
          disabled={record.granted}
        >
          Cấp Quyền
        </Button>
      ),
    },
    {
      title: "Chỉnh sửa",
      key: "edit",
      render: (record) => (
        <Button
          type="link"
          onClick={() => {
            setEditingPermission(record);
            setIsEditModalVisible(true);
          }}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.authorIndexContainer}>
      <h1 className={styles.authorIndexTitle}>Quản Lý Phân Quyền Nhân Viên</h1>
      <div className={styles.controls}>
        <Input
          placeholder="Tìm kiếm nhân viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <Select
          options={filteredStaffs}
          placeholder="Chọn nhân viên"
          onChange={handleStaffChange}
          className={styles.staffDropdown}
        />
      </div>

      <Table
        dataSource={permissions}
        columns={columns}
        loading={loading}
        className={styles.antTable}
        rowKey="IdPermissions"
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
          initialValues={{
            PermissionsName: editingPermission?.PermissionsName,
            Description: editingPermission?.Description,
          }}
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
    </div>
  );
};

export default withPermission(RBACController, 3);

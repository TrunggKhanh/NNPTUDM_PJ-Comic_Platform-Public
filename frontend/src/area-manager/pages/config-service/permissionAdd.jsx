import { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { addPermission } from "@/area-manager/services/rbacService"; // Service API

const { Option } = Select;

const AddPermission = ({ isVisible, onClose, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await addPermission(values);
      message.success(response.message); // Hiển thị thông báo thành công
      form.resetFields(); // Reset form sau khi thành công
      onAddSuccess(); // Gọi callback để refresh danh sách
      onClose(); // Đóng modal
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi thêm quyền. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Quyền"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ PermissionsName: "", Description: "", PermissionsStats: "Có hiệu lực" }}
      >
        <Form.Item
          name="PermissionsName"
          label="Tên Quyền"
          rules={[{ required: true, message: "Vui lòng nhập tên quyền!" }]}
        >
          <Input placeholder="Nhập tên quyền" />
        </Form.Item>

        <Form.Item
          name="Description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả quyền!" }]}
        >
          <Input placeholder="Nhập mô tả quyền" />
        </Form.Item>

        <Form.Item
          name="PermissionsStats"
          label="Trạng Thái Quyền"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái quyền!" }]}
        >
          <Select placeholder="Chọn trạng thái quyền">
            <Option value="Có hiệu lực">Có hiệu lực</Option>
            <Option value="Bảo trì">Bảo trì</Option>
            <Option value="Ngừng vĩnh viễn">Ngừng vĩnh viễn</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Thêm Quyền
          </Button>
        </Form.Item>

        <Form.Item>
          <Button onClick={onClose} block>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPermission;

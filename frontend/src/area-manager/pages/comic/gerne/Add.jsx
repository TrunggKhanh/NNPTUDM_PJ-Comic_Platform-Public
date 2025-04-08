import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { addGenre } from "@/area-manager/services/lookupService"; // Sử dụng service

const AddGenre = ({ isVisible, onClose, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Hàm gửi dữ liệu lên API thông qua service
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await addGenre(values); // Gọi service để thêm thể loại
      message.success(response.message); // Hiển thị thông báo thành công
      form.resetFields(); // Reset form sau khi thành công
      onAddSuccess(); // Gọi callback để refresh danh sách
      onClose(); // Đóng modal
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi thêm thể loại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Thể Loại"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ ten_loai: "" }}
      >
        <Form.Item
          name="ten_loai"
          label="Tên Thể Loại"
          rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
        >
          <Input placeholder="Nhập tên thể loại" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Thêm Thể Loại
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

export default AddGenre;

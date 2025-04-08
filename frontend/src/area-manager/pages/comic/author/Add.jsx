import { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { addAuthor } from "@/area-manager/services/authorService"; // Sử dụng service

const Add = ({ isVisible, onClose, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Hàm gửi dữ liệu lên API thông qua service
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await addAuthor(values); // Gọi service thay vì axios trực tiếp
      message.success(response.message); // Hiển thị thông báo thành công
      form.resetFields(); // Reset form sau khi thành công
      onAddSuccess(); // Gọi callback để refresh danh sách
      onClose(); // Đóng modal
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi thêm tác giả. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Tác Giả"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ ten_tg: "" }}
      >
        <Form.Item
          name="ten_tg"
          label="Tên Tác Giả"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
        >
          <Input placeholder="Nhập tên tác giả" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Thêm Tác Giả
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

export default Add;

import { useState } from "react";
import { Modal, Form, Input, Button, DatePicker, Select, message } from "antd";
import { addStaff } from "@/area-manager/services/userService"; // Sử dụng service

const { Option } = Select;

const AddStaff = ({ isVisible, onClose, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Hàm gửi dữ liệu lên API thông qua service
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await addStaff({
        username: values.username,
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        birth: values.birth?.format("YYYY-MM-DD"),
        gender: values.gender,
      });
      message.success(response.message); // Hiển thị thông báo thành công
      form.resetFields(); // Reset form sau khi thành công
      onAddSuccess(); // Gọi callback để refresh danh sách
      onClose(); // Đóng modal
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi thêm nhân viên. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Nhân Viên"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          username: "",
          email: "",
          password: "",
          fullName: "",
          phone: "",
          gender: "",
        }}
      >
        <Form.Item
          name="username"
          label="Tên Đăng Nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật Khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Họ và Tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số Điện Thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="birth"
          label="Ngày Sinh"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker placeholder="Chọn ngày sinh" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới Tính"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value={1}>Nam</Option>
            <Option value={0}>Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Thêm Nhân Viên
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

export default AddStaff;

import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "@/area-manager/styles/entry-denied.module.css";
import pic from "@/area-manager/assets/images/ban_girl.png";

const EntryDenied = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    onClose(); // Đóng popup nếu có logic này
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <Modal
      open={isVisible}
      footer={null}
      onCancel={onClose}
      className={styles.entryDeniedModal}
    >
      <div className={styles.entryDeniedContainer}>
        <img
          src={pic}
          alt="Không có quyền truy cập"
          className={styles.entryDeniedImage}
        />
        <div className={styles.entryDeniedContent}>
          <h2>Không có quyền truy cập!</h2>
          <p>Bạn không có quyền truy cập vào trang này.</p>
          <Button type="primary" onClick={handleNavigateBack}>
            Quay Lại
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EntryDenied;

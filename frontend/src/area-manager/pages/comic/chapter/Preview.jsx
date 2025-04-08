import { useState } from "react";
import { Modal, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "@/area-manager/styles/AddComic.module.css";

const ImagePreviewPopup = ({ visible, onClose, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      className={styles.previewPopup}
      width={1220}
      bodyStyle={{ padding: 0, width: '1220px' }}
      style={{ top: 50 }}
      title={
        images.length > 0
          ? `Trang ${currentIndex + 1} / ${images.length}`
          : "Chưa có dữ liệu"
      }
    >
      <div className={styles.previewContainer} style={{ display: "flex", alignItems: "center", padding: "10px", position: "relative" }}>
        {images.length > 0 ? (
          <>
            {/* Nút chuyển trái */}
            <Button
              icon={<LeftOutlined />}
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className={styles.controlButton}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
              }}
            />

            {/* Ảnh trước */}
            {currentIndex > 0 && (
              <div
                className={`${styles.imageSide} ${styles.imageBlur}`}
                style={{
                  backgroundImage: `url(${
                    images[currentIndex - 1].thumbUrl ||
                    URL.createObjectURL(images[currentIndex - 1].originFileObj)
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "240px",
                  height: "1200px",
                  marginRight: "20px",
                  filter: "brightness(0.3)",
                  transition: "transform 0.5s ease-in-out",
                }}
              ></div>
            )}

            {/* Ảnh trung tâm */}
            <div
              className={styles.imageCenter}
              style={{
                backgroundImage: `url(${
                  images[currentIndex].thumbUrl ||
                  URL.createObjectURL(images[currentIndex].originFileObj)
                })`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                width: "580px",
                height: "1200px",
                transition: "transform 0.5s ease-in-out",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  background: "rgba(0, 0, 0, 0.7)",
                  padding: "10px 20px",
                  borderRadius: "10px",
                }}
              >
                <span>{`Trang: ${currentIndex + 1}`}</span><br />
                <span>{`Tên file: ${images[currentIndex].name || "Không rõ"}`}</span>
              </div>
            </div>

            {/* Ảnh sau */}
            {currentIndex < images.length - 1 && (
              <div
                className={`${styles.imageSide} ${styles.imageBlur}`}
                style={{
                  backgroundImage: `url(${
                    images[currentIndex + 1].thumbUrl ||
                    URL.createObjectURL(images[currentIndex + 1].originFileObj)
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "240px",
                  height: "1200px",
                  marginLeft: "20px",
                  filter: "brightness(0.3)",
                  transition: "transform 0.5s ease-in-out",
                }}
              ></div>
            )}

            {/* Nút chuyển phải */}
            <Button
              icon={<RightOutlined />}
              disabled={currentIndex === images.length - 1}
              onClick={handleNext}
              className={styles.controlButton}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
              }}
            />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>Chưa có dữ liệu</div>
        )}
      </div>
    </Modal>
  );
};

export default ImagePreviewPopup;

import { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Switch, Alert, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addChapter, addImagesToChapter, completeChapter, checkChapterExists } from "@/area-manager/services/comicService";
import styles from "@/area-manager/styles/AddComic.module.css";
import ImagePreviewPopup from "../chapter/Preview";

const { TextArea } = Input;

const AddChapter = ({ visible, onClose, comicId }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [chapterId, setChapterId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitMessage, setExitMessage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
const openPreviewPopup = () => setPreviewVisible(true);
  const closePreviewPopup = () => setPreviewVisible(false);
  const handleFinishStep1 = async (values) => {
    setLoading(true);
    try {
      const response = await addChapter({ ...values, id_bo: comicId });
      setChapterId(response.chapter._id);
      message.success("Bước 1: Thêm chương thành công!");
      setStep(2);
    } catch (error) {
      console.error("Lỗi khi thêm chương mới:", error);
      message.error(error.response?.data?.message || "Lỗi khi thêm chương mới!");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishStep2 = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file.originFileObj); // Đặt key là "files"
      });
      console.log("Dữ liệu gửi đi:", Array.from(formData.entries()));
      await addImagesToChapter(chapterId, formData);
      message.success("Bước 2: Thêm ảnh thành công!");
      setStep(3);
    } catch (error) {
      console.error("Lỗi khi thêm ảnh vào chương:", error);
      message.error(error.response?.data?.message || "Lỗi khi thêm ảnh vào chương!");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishStep3 = async () => {
    setLoading(true);
    try {
      await completeChapter(chapterId);
      message.success("Bước 3: Hoàn tất chương thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi hoàn tất chương:", error);
      message.error(error.response?.data?.message || "Lỗi khi hoàn tất chương!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setStep(1);
    setChapterId(null);
    setFileList([]);
  };

  const confirmExit = () => {
    if (step === 1) {
      setExitMessage("Bạn sẽ hủy việc thêm chương mới ?");
    } else if (step === 2) {
      setExitMessage("Nếu bạn thoát ở bước hiện tại, bạn cần tự cập nhật ảnh sau đó !!");
    }
    setShowExitWarning(true);
  };

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    onClose();
  };

  const handleCancelExit = () => {
    setShowExitWarning(false);
  };


  const closeImageView = () => {
    setViewingImage(null);
  };


  const validateChapterNumber = async (_, value) => {
    if (value <= 0) {
      return Promise.reject(new Error("Số chương phải lớn hơn 0!"));
    }

    try {
      const exists = await checkChapterExists(comicId, value);
      if (exists) {
        return Promise.reject(new Error("Số chương đã tồn tại!"));
      }
    } catch (error) {
      console.error("Lỗi kiểm tra số chương:", error);
    }

    return Promise.resolve();
  };

  return (
    <>
      <Modal
        title={
          <div className={styles.breadcrumbContainer}>
            <div className={styles.stepWrapper}>
              <span className={`${styles.stepIndicator} ${step >= 1 ? styles.activeStep : ""}`}>
                <span className={styles.stepNumber}></span>
              </span>
              {step > 1 && <div className={styles.stepLine}></div>}
            </div>
            <div className={styles.stepWrapper}>
              <span className={`${styles.stepIndicator} ${step >= 2 ? styles.activeStep : ""}`}>
                <span className={styles.stepNumber}></span>
              </span>
              {step > 2 && <div className={styles.stepLine}></div>}
            </div>
            <div className={styles.stepWrapper}>
              <span className={`${styles.stepIndicator} ${step >= 3 ? styles.activeStep : ""}`}>
                <span className={styles.stepNumber}></span>
              </span>
            </div>
          </div>
        }
        open={visible} // Đã sửa `visible` thành `open`
        onCancel={confirmExit}
        footer={null}
        className={styles.modalContainer}
      >
        <Spin spinning={loading} tip="Đang xử lý...">
          {step === 1 && (
            <Form layout="vertical" form={form} onFinish={handleFinishStep1}>
              <Form.Item
                name="stt_chap"
                label="Số Thứ Tự Chương"
                rules={[
                  { required: true, message: "Vui lòng nhập số thứ tự chương!" },
                  { validator: validateChapterNumber },
                ]}
              >
                <Input type="number" className={styles.inputStyle} />
              </Form.Item>
              <Form.Item name="ten_chap" label="Tên Chương" rules={[{ required: true }]}>
                <Input className={styles.inputStyle} />
              </Form.Item>
              <Form.Item name="premium" label="Premium" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="ticket_cost" label="Giá Vé" rules={[{ required: false }]}>
                <Input type="number" className={styles.inputStyle} />
              </Form.Item>
              <Form.Item name="content" label="Nội Dung">
                <TextArea rows={4} className={styles.inputStyle} />
              </Form.Item>
              <Button type="primary" htmlType="submit" className={styles.buttonPrimary} block>
                Tiếp Tục
              </Button>
            </Form>
          )}
     
          {step === 2 && (
            <div className={styles.stepContainer}>
<h2 className={styles.stepTitle}>BƯỚC 2: UPLOAD ẢNH</h2>
              <div className={styles.uploadSection}>
                <Upload
                  listType="picture-card"
                  multiple
                  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                  beforeUpload={() => false}
                >
                  {fileList.length < 10 && <PlusOutlined />}
                </Upload>
                <Button
                  type="primary"
                  onClick={openPreviewPopup}
                  className={styles.previewButton}
                >
                  Xem Trước Ảnh
                </Button>
              </div>
              <Button
                type="primary"
                onClick={handleFinishStep2}
                block
                className={styles.nextButton}
              >
                Tiếp Tục
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className={styles.stepContainer}>
              <h2 className={styles.stepTitle}>BƯỚC 3: HOÀN TẤT</h2>
              <Alert
                message="Thêm chương thành công!"
                description="Chương của bạn đã được thêm thành công. Bạn có thể tiếp tục thêm hoặc hoàn tất."
                type="success"
                showIcon
              />
              <Button type="primary" onClick={handleFinishStep3} className={styles.buttonPrimary} block>
                Hoàn Thành
              </Button>
              <Button type="default" onClick={handleReset} className={styles.buttonDefault} block>
                Thêm Mới
              </Button>
            </div>
          )}
        </Spin>
      </Modal>

      {/* Popup Xem Trước Ảnh */}
      <ImagePreviewPopup
              visible={previewVisible}
              onClose={closePreviewPopup}
              images={fileList}
            />
    
  

      {viewingImage && (
        <Modal
          open={true} // Đã sửa `visible` thành `open`
          footer={null}
          onCancel={closeImageView}
          className={styles.imagePreviewModal}
        >
          <img src={viewingImage} alt="Preview" style={{ width: "100%" }} />
        </Modal>
      )}
      {showExitWarning && (
        <Modal
          open={true} // Đã sửa `visible` thành `open`
          footer={null}
          onCancel={handleCancelExit}
          className={styles.exitWarningModal}
        >
          <p>{exitMessage}</p>
          <div className={styles.buttonGroup}>
            <Button className={styles.buttonPrimary} onClick={handleConfirmExit}>
              Đồng Ý
            </Button>
            <Button className={styles.buttonDefault} onClick={handleCancelExit}>
              Hủy
            </Button>
          </div>
        </Modal>
      )}
      
    </>
  );
};

export default AddChapter;

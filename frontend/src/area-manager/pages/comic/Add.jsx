import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Upload, message, Switch, Alert, Row, Col, Spin } from "antd";
import { PlusOutlined, ExpandOutlined } from "@ant-design/icons";
import { addComic, uploadImagesToCloudinary, updateComicStats } from "@/area-manager/services/comicService";
import { fetchGenres } from "@/area-manager/services/lookupService";
import { fetchAuthors } from "@/area-manager/services/authorService";
import styles from "../../../area-manager/styles/AddComic.module.css";
import Add from "../../pages/comic/author/Add";

const { TextArea } = Input;

const AddComic = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [comicId, setComicId] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [bannerFileList, setBannerFileList] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("hoat_dong");
  const [viewingImage, setViewingImage] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitMessage, setExitMessage] = useState("");
  const [isAddAuthorVisible, setIsAddAuthorVisible] = useState(false); // Hiển thị popup thêm tác giả
  const [selectedAuthor, setSelectedAuthor] = useState(null); // Quản lý ID tác giả được chọn
  const [loading, setLoading] = useState(false); // Loading cho từng bước

  useEffect(() => {
    const fetchLookups = async () => {
      const authorsData = await fetchAuthors();
      const genresData = await fetchGenres();
      setAuthors(authorsData);
      setGenres(genresData);
    };
    fetchLookups();
  }, []);

  const handleAddAuthorSuccess = async (newAuthor) => {
    const updatedAuthors = await fetchAuthors();
    setAuthors(updatedAuthors);
    setSelectedAuthor(newAuthor._id); // Chọn ngay tác giả mới
  };
  
  const handleFinishStep1 = async (values) => {
    setLoading(true);
    try {
      const fakeData = {
        ...values,
        id_tg: selectedAuthor,
        poster: "https://via.placeholder.com/150",
        banner: "https://via.placeholder.com/600",
        active: isActive,
        premium: isPremium,
        trangthai: status,
        listloai: selectedGenres,
      };
      const response = await addComic(fakeData);
      setComicId(response.comic._id);
      message.success("Bước 1: Thêm bộ truyện thành công!");
      setStep(2);
    } catch {
      message.error("Lỗi khi thêm bộ truyện!");
    } finally {
      setLoading(false);
    }
  };

  const handleFinishStep2 = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("poster", fileList[0]?.originFileObj);
      formData.append("banner", bannerFileList[0]?.originFileObj);
  
      // Upload ảnh
      await uploadImagesToCloudinary(comicId, formData);
  
      // Cập nhật stats (active, premium, trangthai)
      const statsData = {
        active: isActive,
        premium: isPremium,
        trangthai: status,
      };
      await updateComicStats(comicId, statsData);
  
      message.success("Bước 2: Upload ảnh và cập nhật stats thành công!");
      setStep(3);
    } catch (error) {
      message.error("Lỗi khi upload ảnh hoặc cập nhật stats!", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    form.resetFields();
    setStep(1);
    setComicId(null);
    setSelectedGenres([]);
    setFileList([]);
    setBannerFileList([]);
    setIsActive(false);
    setIsPremium(false);
    setStatus("hoat_dong");
  };

  const confirmExit = () => {
    if (step === 1) {
      setExitMessage("Bạn sẽ hủy việc thêm bộ truyện mới ?");
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

  const handleViewImage = (file) => {
    setViewingImage(file.url || URL.createObjectURL(file.originFileObj));
  };

  const closeImageView = () => {
    setViewingImage(null);
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
        visible={visible}
        onCancel={confirmExit}
        footer={null}
        className={styles.modalContainer}
      >
        <Spin spinning={loading} tip="Đang xử lý...">
          {step === 1 && (
            <div className={styles.stepContainer}>
              <h2 className={styles.stepTitle}>BƯỚC 1: THÊM THÔNG TIN</h2>
              <Form layout="vertical" form={form} onFinish={handleFinishStep1}>
                <Form.Item name="tenbo" label="Tên Bộ Truyện" rules={[{ required: true }]}>                
                  <Input className={styles.inputStyle} />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="dotuoi" label="Độ Tuổi" rules={[{ required: true }]}>                    
                      <Select className={styles.selectStyle}>                      
                        <Select.Option value="0">For Everyone</Select.Option>                      
                        <Select.Option value="3">3+</Select.Option>                      
                        <Select.Option value="12">12+</Select.Option>                      
                        <Select.Option value="16">16+</Select.Option>                      
                        <Select.Option value="18">18+</Select.Option>                    
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
               
                  <Form.Item label="Tác Giả" required>
  <div className={styles.authorRow}>
    <Select
      placeholder="Chọn tác giả"
      style={{ flex: 1 }}
      value={selectedAuthor}
      onChange={(value) => {
        setSelectedAuthor(value); // Cập nhật state
        form.setFieldsValue({ id_tg: value }); // Đồng bộ với form
      }}
      options={authors.map((author) => ({
        label: author.ten_tg,
        value: author._id,
      }))}
    />
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => setIsAddAuthorVisible(true)}
      className={styles.addAuthorButton}
    >
    </Button>
  </div>
</Form.Item>

                  </Col>
                </Row>
                <Form.Item label="Thể Loại">
                  <Select
                    mode="multiple"
                    placeholder="Chọn thể loại"
                    onChange={setSelectedGenres}
                    className={styles.selectGrid}
                    dropdownStyle={{ maxHeight: 300, overflowY: "auto" }}
                  >
                    {genres.map((genre) => (
                      <Select.Option key={genre._id} value={genre._id}>
                        {genre.ten_loai}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="mota" label="Mô Tả">                
                  <TextArea rows={4} className={styles.inputStyle} />
                </Form.Item>
                <Button type="primary" htmlType="submit" className={styles.buttonPrimary} block>                
                  Tiếp Tục              
                </Button>
              </Form>
            </div>
          )}
          {step === 2 && (
            <div className={styles.stepContainer}>            
              <h2 className={styles.stepTitle}>BƯỚC 2: UPLOAD ẢNH</h2>            
              <div className={styles.uploadContainer}>              
                <div className={styles.uploadBox} style={{ width: 320, height: 250 }}>                
                  <Upload                  
                    listType="picture-card"                  
                    onChange={({ fileList: newFileList }) => setFileList(newFileList.slice(0, 1))} 
                    beforeUpload={() => false}                >                  
                    {fileList.length < 1 && <PlusOutlined />}                </Upload>                
                  {fileList.length > 0 && (                  
                    <div className={styles.imageActions}>                    
                      <ExpandOutlined onClick={() => handleViewImage(fileList[0])} />                  
                    </div>                
                  )}              
                </div>              
                <div className={styles.uploadBox} style={{ width: 600, height: 250 }}>                
                  <Upload                  
                    listType="picture-card"                  
                    onChange={({ fileList: newFileList }) => setBannerFileList(newFileList.slice(0, 1))}             
                    beforeUpload={() => false}                >                  
                    {bannerFileList.length < 1 && <PlusOutlined />}                </Upload>                
                  {bannerFileList.length > 0 && (                  
                    <div className={styles.imageActions}>                    
                      <ExpandOutlined onClick={() => handleViewImage(bannerFileList[0])} />                  
                    </div>                
                  )}              
                </div>            
              </div>            
              <div className={styles.switchContainer}>              
                <Switch checked={isActive} onChange={setIsActive} /> Active              
                <Switch checked={isPremium} onChange={setIsPremium} /> Premium              
                <Select value={status} onChange={setStatus} className={styles.selectStyle}>                
                  <Select.Option value="hoat_dong">Hoạt Động</Select.Option>                
                  <Select.Option value="tam_ngung">Tạm Ngừng</Select.Option>              
                </Select>            </div>            
              <Button type="primary" onClick={handleFinishStep2} className={styles.buttonPrimary} block>              
                Tiếp Tục            
              </Button>          </div>        )}
          {step === 3 && (          
            <div className={styles.stepContainer}>            
              <h2 className={styles.stepTitle}>BƯỚC 3: HOÀN THÀNH</h2>            
              <Alert              
                message="Thêm bộ truyện thành công!"              
                description="Bộ truyện của bạn đã được thêm thành công. Bạn có thể tiếp tục thêm hoặc hoàn tất."              
                type="success"              
                showIcon            />            
              <Button type="primary" onClick={onClose} className={styles.buttonPrimary} block>              
                Hoàn Thành            </Button>            
              <Button type="default" onClick={handleReset} className={styles.buttonDefault} block>              
                Thêm Mới            </Button>          
            </div>        )}      
        </Spin>
      </Modal>
      {viewingImage && (        
        <Modal          
          visible={true}          
          footer={null}          
          onCancel={closeImageView}          
          className={styles.imagePreviewModal}        >          
          <img src={viewingImage} alt="Preview" style={{ width: "100%" }} />        </Modal>      
      )}      
       {/* Popup thêm tác giả */}

       <Add
  isVisible={isAddAuthorVisible}
  onClose={() => setIsAddAuthorVisible(false)}
  onAddSuccess={(newAuthor) => handleAddAuthorSuccess(newAuthor)}
/>


{showExitWarning && (
  <Modal
    visible={true}
    footer={null}
    onCancel={handleCancelExit}
    className={styles.exitWarningModal}
  >
    <p>{exitMessage}</p>
    <div className={styles.buttonGroup}>
      <Button
        className={styles.buttonPrimary}
        onClick={handleConfirmExit}
      >
        Đồng Ý
      </Button>
      <Button
        className={styles.buttonDefault}
        onClick={handleCancelExit}
      >
        Hủy
      </Button>
    </div>
  </Modal>
)}

    </>  );
};
export default AddComic;

import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, message, Row, Col, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fetchComics, fetchComicById, updateComic, uploadImagesToCloudinary } from "@/area-manager/services/comicService";
import { fetchGenres } from "@/area-manager/services/lookupService";
import { fetchAuthors } from "@/area-manager/services/authorService";
import styles from "../../../area-manager/styles/UpdateComic.module.css";

const { TextArea } = Input;

const UpdateComicPage = () => {
  const [form] = Form.useForm();
  const [comics, setComics] = useState([]);
  const [comicData, setComicData] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [bannerFileList, setBannerFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [authorsData, genresData] = await Promise.all([fetchAuthors(), fetchGenres()]);
        setAuthors(authorsData);
        setGenres(genresData);
      } catch (error) {
        message.error("Không thể tải dữ liệu ban đầu!");
      }
    };
    loadInitialData();
  }, []);

  const handleSearchComics = async () => {
    try {
      const data = await fetchComics();
      const filteredComics = data.filter((comic) =>
        comic.tenbo.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setComics(filteredComics);
    } catch (error) {
      message.error("Không thể tải danh sách bộ truyện!");
    }
  };

  const handleSelectComic = async (comicId) => {
    try {
      const comicDetails = await fetchComicById(comicId);
      setComicData(comicDetails);

      form.setFieldsValue({
        tenbo: comicDetails.tenbo,
        dotuoi: comicDetails.dotuoi,
        mota: comicDetails.mota,
        id_tg: comicDetails.id_tg?._id,
      });
      setSelectedGenres(comicDetails.listloai.map((genre) => genre._id));
    } catch (error) {
      message.error("Không thể tải dữ liệu bộ truyện!");
    }
  };

  const handleUpdateComic = async (values) => {
    setLoading(true);
    try {
      const updatedData = {
        ...comicData,
        ...values,
        listloai: selectedGenres,
      };
      await updateComic(comicData._id, updatedData);

      const formData = new FormData();
      if (fileList[0]?.originFileObj) formData.append("poster", fileList[0].originFileObj);
      if (bannerFileList[0]?.originFileObj) formData.append("banner", bannerFileList[0].originFileObj);
      await uploadImagesToCloudinary(comicData._id, formData);

      message.success("Cập nhật bộ truyện thành công!");
    } catch (error) {
      message.error("Lỗi khi cập nhật bộ truyện!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.updateComicContainer}>
      <h2 className={styles.pageTitle}>Cập Nhật Bộ Truyện</h2>
      <Input.Search
        placeholder="Tìm kiếm bộ truyện..."
        enterButton="Tìm"
        size="large"
        onSearch={handleSearchComics}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <Table
        dataSource={comics}
        columns={[
          { title: "Tên Bộ Truyện", dataIndex: "tenbo", key: "tenbo" },
          { title: "Tác Giả", dataIndex: ["id_tg", "ten_tg"], key: "id_tg" },
          {
            title: "Thao Tác",
            key: "action",
            render: (_, record) => (
              <Button type="link" onClick={() => handleSelectComic(record._id)}>
                Chọn
              </Button>
            ),
          },
        ]}
        rowKey="_id"
        style={{ marginTop: "20px" }}
      />
      {comicData && (
        <Form layout="vertical" form={form} onFinish={handleUpdateComic} className={styles.updateForm}>
          <Form.Item name="tenbo" label="Tên Bộ Truyện" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dotuoi" label="Độ Tuổi" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="0">For Everyone</Select.Option>
                  <Select.Option value="3">3+</Select.Option>
                  <Select.Option value="12">12+</Select.Option>
                  <Select.Option value="16">16+</Select.Option>
                  <Select.Option value="18">18+</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="id_tg" label="Tác Giả" rules={[{ required: true }]}>
                <Select>
                  {authors.map((author) => (
                    <Select.Option key={author._id} value={author._id}>
                      {author.ten_tg}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Thể Loại">
            <Select
              mode="multiple"
              placeholder="Chọn thể loại"
              onChange={setSelectedGenres}
              value={selectedGenres}
            >
              {genres.map((genre) => (
                <Select.Option key={genre._id} value={genre._id}>
                  {genre.ten_loai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="mota" label="Mô Tả">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Ảnh Bìa">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList.slice(0, 1))}
              beforeUpload={() => false}
            >
              {fileList.length < 1 && <PlusOutlined />}
            </Upload>
          </Form.Item>
          <Form.Item label="Ảnh Banner">
            <Upload
              listType="picture-card"
              fileList={bannerFileList}
              onChange={({ fileList: newFileList }) => setBannerFileList(newFileList.slice(0, 1))}
              beforeUpload={() => false}
            >
              {bannerFileList.length < 1 && <PlusOutlined />}
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập Nhật
          </Button>
        </Form>
      )}
    </div>
  );
};

export default UpdateComicPage;

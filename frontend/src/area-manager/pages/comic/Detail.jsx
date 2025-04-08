import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBoTruyenById, fetchChaptersByComicId } from "@/services/BoTruyenServices";
import { Button, Select, message, Table, Tag, Row, Col, Tooltip } from "antd";
import { updateComicStats } from "@/area-manager/services/comicService";
import "@/area-manager/styles/comic-detail.css";
import AddChapter from "../../../area-manager/pages/comic/chapter/Add";
import Update from "../../../area-manager/pages/comic/Update"; // Import popup cập nhật chương
import { EditOutlined } from "@ant-design/icons";
import withPermission from "@/area-manager/withPermission";
const { Option } = Select;

const buildImageUrl = (poster) => {
  if (/^https?:\/\//.test(poster)) {
    return poster;
  }
  return `http://localhost:5000${poster}`;
};

const Detail = () => {
  const { id } = useParams();
  const [comic, setComic] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isAddChapterVisible, setIsAddChapterVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false); // Trạng thái popup cập nhật truyện

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const data = await fetchBoTruyenById(id);
        setComic(data);
        const chaptersData = await fetchChaptersByComicId(id);
        setChapters(chaptersData);
      } catch {
        message.error("Không thể tải thông tin chi tiết!");
      }
    };
    fetchComic();
  }, [id]);

  if (!comic) {
    return <div>Đang tải...</div>;
  }

  const handleUpdateClose = () => {
    setIsUpdateVisible(false);
    fetchBoTruyenById(id).then(setComic).catch(() => {
      message.error("Không thể làm mới thông tin truyện!");
    });
  };

  const handleAddChapterClose = () => {
    setIsAddChapterVisible(false);
    fetchChaptersByComicId(id).then(setChapters).catch(() => {
      message.error("Không thể làm mới danh sách chương!");
    });
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "stt_chap",
      key: "stt_chap",
    },
    {
      title: "Tên Chương",
      dataIndex: "ten_chap",
      key: "ten_chap",
    },
    {
      title: "Tổng Số Trang",
      dataIndex: "content",
      key: "content",
      render: (content) => `${content?.length || 0} trang`,
    },
    {
      title: "Ngày Đăng",
      dataIndex: "thoi_gian",
      key: "thoi_gian",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Demo Read",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleDemoRead(record._id)}
        >
          Demo Read
        </Button>
      ),
    },
  ];

  return (
    <div className="comic-detail-container">
      <div className="header-section">
        <h2 className="section-title">
          {comic.tenbo} <span className="comic-id">ID: {comic._id}</span>
          <Tooltip title="Cập Nhật Truyện">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setIsUpdateVisible(true)}
              style={{ marginLeft: "10px" }}
            />
          </Tooltip>
        </h2>
        <div className="timestamps">
          <Tag color="blue">Created: {new Date(comic.createdAt).toLocaleDateString()}</Tag>
          <Tag color="green">Updated: {new Date(comic.updatedAt).toLocaleDateString()}</Tag>
        </div>
      </div>
      <hr className="line" />

      <Row gutter={[20, 16]} align="middle">
        <Col span={8}>
          <div className="image-container">
            <div
              className="comic-poster"
              style={{
                width: "250px",
                height: "330px",
                backgroundImage: `url(${buildImageUrl(comic.poster)})`,
                backgroundSize: "cover",
                borderRadius: "5px",
              }}
            />
            <div className="image-tag">Poster</div>
          </div>
        </Col>
        <Col span={8} style={{ marginLeft: "20px" }}>
          <div className="image-container">
            <div
              className="comic-banner"
              style={{
                width: "750px",
                height: "330px",
                backgroundImage: `url(${buildImageUrl(comic.banner)})`,
                backgroundSize: "cover",
                borderRadius: "5px",
              }}
            />
            <div className="image-tag">Banner</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="stats-section">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <span>Trạng thái:</span>
              </Col>
              <Col span={12}>
                <Select
                  defaultValue={comic.trangthai}
                  onChange={async (value) => {
                    try {
                      await updateComicStats(comic._id, { trangthai: value });
                      setComic({ ...comic, trangthai: value });
                      message.success(`Trạng thái được chuyển thành: ${value}`);
                    } catch {
                      message.error("Không thể cập nhật trạng thái!");
                    }
                  }}
                  style={{ width: "150px" }}
                >
                  <Option value="hoat_dong">Hoạt động</Option>
                  <Option value="tam_ngung">Tạm ngừng</Option>
                  <Option value="hoan_thanh">Hoàn thành</Option>
                </Select>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr className="line purple-line" />

      <div className="description-section">
        <p>{comic.mota || "Chưa có mô tả"}</p>
      </div>

      <div className="chapters-section">
        <h3>Danh Sách Chương</h3>
        <Table
          dataSource={chapters}
          columns={columns}
          pagination={false}
          rowKey={(record) => record._id}
        />
      </div>

      <Button
        type="primary"
        onClick={() => setIsAddChapterVisible(true)}
        className="floating-add-button"
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        Thêm Chương
      </Button>

      <AddChapter
        visible={isAddChapterVisible}
        onClose={handleAddChapterClose}
        comicId={comic._id}
      />

      <Update
        visible={isUpdateVisible}
        onClose={handleUpdateClose}
        comicId={comic._id}
      />
    </div>
  );
};

export default withPermission(Detail, 17);

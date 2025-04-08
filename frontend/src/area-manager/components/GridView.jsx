import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/area-manager/styles/GridView.module.css";
import { Table, Tag, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

// Import component UpdateComic
import UpdateComic from "../pages/comic/Update";

const buildImageUrl = (poster) => {
  if (/^https?:\/\//.test(poster)) {
    return poster;
  }
  return `http://localhost:5000${poster}`;
};

const getStatusLabel = (status) => {
  switch (status) {
    case "hoat_dong":
      return "Đang Phát hành";
    case "tam_ngung":
      return "Ngừng Phát hành";
    case "hoan_thanh":
      return "Hoàn Thiện";
    default:
      return "Không xác định";
  }
};

const GridView = ({ comics, loading, onDelete }) => {
  const [hoveredRowId, setHoveredRowId] = useState(null);

  // State cho Modal update
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [comicIdToUpdate, setComicIdToUpdate] = useState(null);

  const navigate = useNavigate();

  // Hàm mở popup update
  const handleOpenUpdateModal = (record) => {
    setComicIdToUpdate(record._id);
    setIsUpdateModalVisible(true);
  };

  // Hàm đóng popup update
  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setComicIdToUpdate(null);
    // Nếu cần, bạn có thể gọi hàm load lại danh sách ở đây
    // Ví dụ: loadComics();
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "poster",
      key: "poster",
      render: (poster) => (
        <div
          className={styles.comicTableImage}
          style={{
            backgroundImage: `url(${buildImageUrl(poster)})`,
          }}
        ></div>
      ),
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên",
      dataIndex: "tenbo",
      key: "tenbo",
      render: (name, record) => (
        <div
          className={styles.comicNameContainer}
          onMouseEnter={() => setHoveredRowId(record._id)}
          onMouseLeave={() => setHoveredRowId(null)}
        >
          <span className={styles.comicName}>{name}</span>
          {hoveredRowId === record._id && (
            <div className={styles.hoverInfo}>
              <div className={styles.hoverItem}>
                <IdcardOutlined className={styles.hoverIcon} />
                {record.id_tg ? record.id_tg.ten_tg : "Không rõ"}
              </div>
              <div className={styles.hoverItem}>
                <EyeOutlined className={styles.hoverIcon} /> {record.TongLuotXem}
              </div>
              <div className={styles.hoverItem}>
                <StarOutlined className={styles.hoverIcon} /> {record.danhgia}/10
              </div>
              <div className={styles.hoverItem}>
                <UserOutlined className={styles.hoverIcon} /> {record.theodoi}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      key: "trangthai",
      render: (status, record) => (
        <div className={styles.comicStatusColumn}>
          <Tag color="gold" className={styles.comicTag}>
            {record.premium ? "Premium" : "Free"}
          </Tag>
          <Tag color="purple" className={styles.comicTag}>
            {getStatusLabel(status)}
          </Tag>
          <Tag color={record.active ? "green" : "red"} className={styles.comicTag}>
            {record.active ? "Hoạt động" : "Vô hiệu"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Tooltip title="Sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn Table onRow click
                handleOpenUpdateModal(record);
              }}
              className={styles.actionButton}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn Table onRow click
                onDelete(record);
              }}
              danger
              className={styles.actionButton}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Bảng hiển thị danh sách truyện */}
      <Table
        dataSource={comics}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className={styles.tableContainer}
        onRow={(record) => ({
          onClick: () =>
            navigate(`/manager/comic/comic-index/comic-detail/${record._id}`),
        })}
      />

      {/* Popup/Modal UpdateComic */}
      {isUpdateModalVisible && (
        <UpdateComic
          visible={isUpdateModalVisible}
          onClose={handleCloseUpdateModal}
          comicId={comicIdToUpdate}
        />
      )}
    </>
  );
};

export default GridView;

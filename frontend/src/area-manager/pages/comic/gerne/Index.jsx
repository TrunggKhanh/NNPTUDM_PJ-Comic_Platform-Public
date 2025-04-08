import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Import HOC withPermission
import withPermission from "@/area-manager/withPermission";
import { Table, Button, message, Modal, Form, Input, Popover } from "antd";
import {
  fetchGenres,
  deleteGenre,
  toggleGenreActive,
  updateGenre,
  fetchTopComicsByGenre, // Hàm API lấy top 5 bộ truyện
} from "@/area-manager/services/lookupService"; // Service dành cho thể loại
import AddGenre from "../gerne/Add"; // Component thêm thể loại
import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import styles from "@/area-manager/styles/genre-index.module.css"; // CSS riêng cho giao diện quản lý thể loại
import BanGirlImage from "@/area-manager/assets/images/ban_girl.png";

const GernIndex = () => {
  const navigate = useNavigate();

  const [currentFilter, setCurrentFilter] = useState("all");

  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [editingGenre, setEditingGenre] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
 

    // Load danh sách thể loại
    const loadGenres = async (filters = {}) => {
        setLoading(true);
        try {
          const data = await fetchGenres(filters);
          setGenres(
            data.map((genre) => ({
              ...genre,
              key: genre._id,
            }))
          );
        } catch {
          message.error("Không thể tải danh sách thể loại");
        } finally {
          setLoading(false);
        }
      };
      
  // Xử lý hover hiển thị top truyện
  const handleHover = async (genre, event) => {
    const { clientX, clientY } = event;
    setHoveredGenre({ ...genre, position: { x: clientX, y: clientY } });

    try {
      const topComics = await fetchTopComicsByGenre(genre._id);
      setHoveredGenre((prev) => ({ ...prev, topComics }));
    } catch {
      message.error("Không thể tải danh sách truyện hot");
    }
  };
    const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    const filters = {};
    if (filter === "active") {
        filters.active = true;
    } else if (filter === "inactive") {
        filters.active = false;
    }
    loadGenres(filters); // Gọi API với bộ lọc tương ứng
    };

  const handleNavigateToDetail = (genreId) => {
    navigate(`/manager/comic/genre/${genreId}`);
  };  
  const handleMouseLeave = () => {
    setHoveredGenre(null);
  };



  const confirmDelete = (genre) => {
    // Nếu số lượng truyện liên kết > 0, hiển thị popup tùy chỉnh
    if (genre.soLuongTruyen > 0) {
      Modal.info({
        title: "Không thể xóa thể loại",
        content: (
          <div style={{ textAlign: "center" }}>
            <img
              src={BanGirlImage}
              alt="Không thể xóa"
              style={{ width: "200px", height: "250px", marginBottom: "20px" }}
            />
            <p>
              Thể loại <strong>{genre.ten_loai}</strong> có{" "}
              <strong>{genre.soLuongTruyen}</strong> bộ truyện liên quan.
            </p>
            <Button
              type="primary"
              style={{
                backgroundColor: "#6a1b9a",
                border: "none",
                color: "#fff",
                padding: "5px 20px",
                borderRadius: "5px",
                marginTop: "10px",
              }}
              onClick={() => {
                window.open(`/manager/comic/gerne-index/genre-detail/${genre._id}`, "_blank");
              }}
            >
              Xem Chi Tiết
            </Button>
          </div>
        ),
        icon: null, // Không sử dụng icon mặc định
        closable: true, // Có nút "x" để đóng
        centered: true, // Hiển thị Modal ở giữa màn hình
      });
      return;
    }
  
    // Nếu có thể xóa, tiếp tục logic xóa như bình thường
    let countdownValue = 5;
    const interval = setInterval(() => {
      countdownValue -= 1;
      modal.update({
        content: (
          <p>
            Bạn có chắc chắn muốn xóa thể loại này không? Hành động sẽ được thực hiện
            sau <strong>{countdownValue}</strong> giây.
          </p>
        ),
        okText: `Xóa ngay (${countdownValue}s)`,
      });
      if (countdownValue <= 0) {
        clearInterval(interval);
        executeDelete(genre._id);
        modal.destroy();
      }
    }, 1000);
  
    const modal = Modal.confirm({
      title: "Xác nhận xóa",
      content: (
        <p>
          Bạn có chắc chắn muốn xóa thể loại này không? Hành động sẽ được thực hiện
          sau <strong>{countdownValue}</strong> giây.
        </p>
      ),
      okText: `Xóa ngay (${countdownValue}s)`,
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => {
        clearInterval(interval);
        executeDelete(genre._id);
      },
      onCancel: () => {
        clearInterval(interval);
      },
    });
  };
  
  
  
  
  const executeDelete = async (genreId) => {
    try {
      await deleteGenre(genreId); // Gửi yêu cầu xóa
      message.success("Xóa thể loại thành công");
      loadGenres(); // Refresh danh sách thể loại
    } catch (error) {
      if (error.response?.status === 400) {
        const { totalComics, genreDetailUrl } = error.response.data;
        message.error({
          content: (
            <div>
              {`Không thể xóa thể loại vì có ${totalComics} bộ truyện liên quan.`}
              <br />
              <a href={genreDetailUrl} target="_blank" rel="noopener noreferrer">
                Xem chi tiết
              </a>
            </div>
          ),
          duration: 5, // Thời gian hiển thị thông báo
        });
      } else {
        message.error("Không thể xóa thể loại");
      }
    }
  };
  
  
  // Thay đổi trạng thái hoạt động
  const handleToggleActive = async (genreId) => {
    try {
      await toggleGenreActive(genreId);
      message.success("Thay đổi trạng thái thành công");
      loadGenres();
    } catch {
      message.error("Không thể thay đổi trạng thái thể loại");
    }
  };

  // Cập nhật thể loại
  const handleUpdate = (genre) => {
    setEditingGenre(genre);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateGenre(editingGenre._id, values);
      message.success("Cập nhật thể loại thành công");
      setIsEditModalVisible(false);
      loadGenres();
    } catch {
      message.error("Không thể cập nhật thể loại");
    }
  };

  // Sắp xếp danh sách
  const handleSort = () => {
    const sortedGenres = [...genres].sort((a, b) =>
      isAscending ? a.ten_loai.localeCompare(b.ten_loai) : b.ten_loai.localeCompare(a.ten_loai)
    );
    setGenres(sortedGenres);
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    loadGenres();
  }, []);

  // Định nghĩa các cột trong bảng
  const columns = [
    {
      title: "ID Thể Loại",
      dataIndex: "_id",
      key: "_id",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Tên Thể Loại",
      dataIndex: "ten_loai",
      key: "ten_loai",
      sorter: (a, b) => a.ten_loai.localeCompare(b.ten_loai),
    },
    {
      title: "Số Bộ Truyện",
      dataIndex: "soLuongTruyen",
      key: "soLuongTruyen",
      render: (text) => <span className={styles.storyCount}>{text || 0}</span>,
    },
    {
      title: "Trạng Thái",
      key: "active",
      render: (record) => (
        <div
          onClick={() => handleToggleActive(record._id)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: record.active ? "green" : "red",
          }}
        >
          {record.active ? (
            <>
              <i className="feather icon-check-circle" /> Hoạt Động
            </>
          ) : (
            <>
              <i className="feather icon-slash" /> Vô Hiệu
            </>
          )}
        </div>
      ),
    },
    {
        title: "Thao Tác",
        key: "action",
        render: (_, record) => (
          <div className={styles.actionButtons}>
            <Button
              type="link"
              icon={<i className="feather icon-edit" />}
              onClick={() => handleUpdate(record)}
            />
            <Button
              type="link"
              icon={<i className="feather icon-trash" />}
              onClick={() => confirmDelete(record)} // Truyền toàn bộ record
              danger
            />
          </div>
        ),
      },
      
      
  ];

  return (
    <div className={styles.genreIndexContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h1 className={styles.genreIndexTitle}>Danh Sách Thể Loại</h1>
        <Button
          onClick={handleSort}
          icon={isAscending ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          style={{
            backgroundColor: "#6a1b9a",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        />
      </div>
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
  <Button
    type="default"
    onClick={() => handleFilterChange("all")}
    style={{
      backgroundColor: currentFilter === "all" ? "#6a1b9a" : "#fff",
      color: currentFilter === "all" ? "#fff" : "#000",
      borderRadius: "20px",
      border: currentFilter === "all" ? "none" : "1px solid #ddd",
      padding: "5px 15px",
    }}
  >
    Tất Cả
  </Button>
  <Button
    type="default"
    onClick={() => handleFilterChange("active")}
    style={{
      backgroundColor: currentFilter === "active" ? "#6a1b9a" : "#fff",
      color: currentFilter === "active" ? "#fff" : "#000",
      borderRadius: "20px",
      border: currentFilter === "active" ? "none" : "1px solid #ddd",
      padding: "5px 15px",
    }}
  >
    Hoạt Động
  </Button>
  <Button
    type="default"
    onClick={() => handleFilterChange("inactive")}
    style={{
      backgroundColor: currentFilter === "inactive" ? "#6a1b9a" : "#fff",
      color: currentFilter === "inactive" ? "#fff" : "#000",
      borderRadius: "20px",
      border: currentFilter === "inactive" ? "none" : "1px solid #ddd",
      padding: "5px 15px",
    }}
  >
    Vô Hiệu
  </Button>
</div>

      <Button className={styles.addGenreBtn} onClick={() => setIsAddModalVisible(true)}>
        Thêm Thể Loại
      </Button>
      <Table
  dataSource={genres}
  columns={columns}
  loading={loading}
  className={styles.antTable}
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50"],
  }}
  onRow={(record) => ({
    onMouseEnter: (event) => handleHover(record, event),
    onMouseLeave: handleMouseLeave,
    onClick: (event) => {
        // Ngăn điều hướng nếu đang hiển thị popup
        if (hoveredGenre?.topComics) {
          event.stopPropagation();
          event.preventDefault();
        } else {
          handleNavigateToDetail(record._id);
        }
      },
  })}
/>

      <AddGenre
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={loadGenres}
      />
      {hoveredGenre && hoveredGenre.topComics && (
  <Popover
    content={
      <div className={styles.popoverContent}>
        <h3 className={styles.popoverTitle}>
          Top 5 Of Genre: {hoveredGenre.ten_loai}
        </h3>
        {hoveredGenre.topComics.map((comic, index) => (
          <div key={comic._id} className={styles.popoverItem}>
            <span className={styles.popoverRank}>#{index + 1}</span>
            <div
              className={styles.popoverBanner}
              style={{
                backgroundImage: `url(http://localhost:5000${comic.poster})`,
              }}
            >
              <div className={styles.popoverComicName}>{comic.tenbo}</div>
              <div className={styles.popoverComicStats}>
                TF: {comic.theodoi} | V: {comic.TongLuotXem}
              </div>
            </div>
          </div>
        ))}
      </div>
    }
    visible
    getPopupContainer={(triggerNode) => triggerNode.parentElement} // Neo vào dòng
    placement="topLeft"
  />
)}

      <Modal
        title="Cập Nhật Thể Loại"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleEditSubmit} initialValues={{ ten_loai: editingGenre?.ten_loai }}>
          <Form.Item
            name="ten_loai"
            label="Tên Thể Loại"
            rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withPermission(GernIndex, 5);

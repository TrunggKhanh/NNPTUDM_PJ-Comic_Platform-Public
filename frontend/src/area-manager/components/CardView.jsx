import { Row, Col, Pagination, Tag } from "antd";
import styles from "@/area-manager/styles/CardView.module.css";
import  { useState } from "react";

const buildImageUrl = (poster) => {
  // Kiểm tra nếu đường dẫn đã là một URL đầy đủ
  if (/^https?:\/\//.test(poster)) {
    return poster; // Trả về URL đầy đủ
  }
  // Nếu không, thêm domain localhost
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
  
  const CardView = ({ comics }) => {
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 28; // Số item mỗi trang
  
    // Tính toán dữ liệu theo trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedComics = comics.slice(startIndex, endIndex);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    return (
      <div>
        <Row gutter={[16, 16]}>
          {paginatedComics.map((comic) => (
            <Col key={comic._id} xs={24} sm={12} md={8} lg={6}>
              <div className={styles.comicCard}>
                <div className={styles.comicId}>ID: {comic._id}</div>
                <div
                    className={styles.comicImage}
                    style={{
                      backgroundImage: `url(${buildImageUrl(comic.poster)})`,
                    }}
                  >

                  <div className={styles.comicOverlay}>
                    <h3 className={styles.comicTitle}>{comic.tenbo}</h3>
                    <div className={styles.comicStatsRow}>
                      <span>Theo dõi: {comic.theodoi}</span>
                      <span style={{ marginLeft: "100px" }}>
                        View: {comic.TongLuotXem}
                      </span>
                    </div>
                    <div className={styles.comicAuthor}>
                      Tác giả: {comic.id_tg ? comic.id_tg.ten_tg : "Không rõ"}
                    </div>
                    <div className={styles.comicStatsTags}>
                      <Tag color="gold" className={styles.comicTag}>
                        {comic.premium ? "Premium" : "Free"}
                      </Tag>
                      <Tag color="purple" className={styles.comicTag}>
                        {getStatusLabel(comic.trangthai)}
                      </Tag>
                      <Tag
                        color={comic.active ? "green" : "red"}
                        className={styles.comicTag}
                      >
                        {comic.active ? "Hoạt động" : "Vô hiệu"}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
  
        {/* Bộ phân trang */}
        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={comics.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
    );
  };
  
  export default CardView;
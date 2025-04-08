import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChapterDetails } from "@/area-manager/services/comicService";
import { Row, Col, Card, Table, Slider } from "antd";
import styles from "@/area-manager/styles/AddComic.module.css"; // Import CSS Module

// Import HOC withPermission
import withPermission from "@/area-manager/withPermission";

const DemoRead = () => {
  const { chapterId } = useParams();
  const [chapterDetails, setChapterDetails] = useState(null);
  const [zoom, setZoom] = useState(100); // Thay đổi kích thước ảnh

  useEffect(() => {
    if (!chapterId || !chapterId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("ID chương không hợp lệ:", chapterId);
      return;
    }

    const loadChapterDetails = async () => {
      try {
        const data = await fetchChapterDetails(chapterId);
        setChapterDetails(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chương:", error);
      }
    };

    loadChapterDetails();
  }, [chapterId]);

  if (!chapterDetails) return <div>Đang tải...</div>;

  return (
    <div className={styles.demoReadContainer}>
      {/* Phần ảnh */}
      <Row gutter={[16, 16]} className={styles.readingSection}>
        <Col span={24} className={styles.centeredArea}>
          <div className={styles.adjustableArea} style={{ zoom: `${zoom}%` }}>
            {chapterDetails.list_pages.map((page, index) => (
              <div key={index} className={styles.pageContainer}>
                <div className={styles.pageHeader}>
                  <span>Trang {page.so_trang}</span>
                </div>
                <img
                  src={page.anh_trang}
                  alt={`Trang ${page.so_trang}`}
                  className={styles.chapterImage}
                />
              </div>
            ))}
          </div>
          {/* Thanh chỉnh kích thước */}
          <div className={styles.zoomControls}>
            <Slider
              min={50}
              max={150}
              defaultValue={100}
              onChange={(value) => setZoom(value)}
              tooltipVisible
            />
          </div>
        </Col>
      </Row>

      {/* Phần thông tin chương */}
      <Row>
        <Col span={24}>
          <Card>
            <div className={styles.cardHeader}>
              <h5>Thông tin chương</h5>
            </div>
            <div className={styles.cardBody}>
              <Table responsive hover className="recent-users">
                <tbody>
                  <tr>
                    <td><strong>Tên chương:</strong></td>
                    <td>{chapterDetails.ten_chap}</td>
                  </tr>
                  <tr>
                    <td><strong>Số chương:</strong></td>
                    <td>{chapterDetails.stt_chap}</td>
                  </tr>
                  <tr>
                    <td><strong>Trạng thái:</strong></td>
                    <td>{chapterDetails.trangthai}</td>
                  </tr>
                  <tr>
                    <td><strong>Lượt xem:</strong></td>
                    <td>{chapterDetails.luotxem}</td>
                  </tr>
                  <tr>
                    <td><strong>Danh sách ảnh:</strong></td>
                    <td>
                      <ul>
                        {chapterDetails.list_pages.map((page, index) => (
                          <li key={index}>
                            <a
                              href={page.anh_trang}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {page.anh_trang}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default withPermission(DemoRead, 7);

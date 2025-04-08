import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const DashDefault = () => {
  const [totalSeries, setTotalSeries] = useState('00'); 
  const [totalChapters, setTotalChapters] = useState('00'); 
  const [totalAuthors, setTotalAuthors] = useState('00');
  const [trendingComics, setTrendingComics] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0); 

  const [dashSalesData, setDashSalesData] = useState([
    { title: 'Doang Thu', amount: '00', icon: 'icon-arrow-up text-c-green', value: 50, class: 'progress-c-theme' },
    { title: 'Lượt Truy Cập', amount: '00', icon: 'icon-arrow-down text-c-red', value: 36, class: 'progress-c-theme2' },
    { title: 'User Đang Hoạt Hộng', amount: '00', icon: 'icon-arrow-up text-c-green', value: 70, color: 'progress-c-theme' },
  ]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API đồng thời để lấy dữ liệu
        const [revenueRes, visitsRes, activeUsersRes] = await Promise.all([
          axios.get('/api/statistics/total-revenue'),
          axios.get('/api/statistics/total-visits'),
          axios.get('/api/statistics/active-users'),
          axios.get('/api/statistics/total-series'),
        ]);
  
        // Cập nhật dữ liệu cho từng phần tử trong dashSalesData
        setDashSalesData((prevData) => [
          { ...prevData[0], amount: `${revenueRes.data.amount} USD` }, 
          { ...prevData[1], amount: visitsRes.data.amount },
          { ...prevData[2], amount: activeUsersRes.data.amount }, 

        ]);

        console.log(revenueRes.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Gọi đồng thời 2 API
        const [seriesResponse, chaptersResponse, authorResponse] = await Promise.all([
          axios.get('/api/statistics/total-series'),
          axios.get('/api/statistics/total-chapters'),
          axios.get('/api/statistics/total-authors')
        ]);

        // Cập nhật state với giá trị từ API
        setTotalSeries(seriesResponse.data.amount);
        setTotalChapters(chaptersResponse.data.amount);
        setTotalAuthors(authorResponse.data.amount);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };

    fetchStatistics();
  }, []);

  useEffect(() => {
    const fetchTrendingComics = async () => {
      try {
        const response = await axios.get('/api/botruyen/trending', {
          params: { page: 1, limit: 4 }, 
        });
        setTrendingComics(response.data.comics); // Cập nhật danh sách truyện
      } catch (error) {
        console.error('Lỗi khi lấy danh sách truyện Trending:', error);
      }
    };

    fetchTrendingComics();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/statistics/ratings');
        const data = await response.json();
        const sortedRatings = data.ratings.sort((a, b) => b.star - a.star);
        setRatings(sortedRatings);
        const total = data.ratings.reduce((sum, rating) => sum + rating.count, 0); 
        setTotalRatings(total);
      } catch (error) {
        console.error('Lỗi khi lấy số lượng đánh giá:', error);
      }
    };

    fetchRatings();
  }, []);

  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3784
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Julie Vad</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3544
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            2739
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Frida Thomse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            1032
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            8750
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            8750
          </span>
        </div>
      </div>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount}
                      </h3>
                    </div>
                    <div className="col-3 text-end">
                      <p className="m-b-0">{data.value}%</p>
                    </div>
                  </div>
                  <div className="progress m-t-30" style={{ height: '7px' }}>
                    <div
                      className={`progress-bar ${data.class}`}
                      role="progressbar"
                      style={{ width: `${data.value}%` }}
                      aria-valuenow={data.value}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        <Col md={6} xl={8}>
        <Card className="Recent-Users widget-focus-lg">
          <Card.Header>
            <Card.Title as="h5">Danh Sách Truyện Tiêu Biểu</Card.Title>
          </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="recent-users">
                <tbody>
                  {trendingComics.map((comic) => (
                    <tr key={comic._id} className="unread">
                      <td>
                        <img
                          style={{ width: '60px' }}
                          src={`http://localhost:5000${comic.AnhBia}`}
                          alt={comic.TenBo}
                        />
                      </td>
                      <td>
                        <h6 className="mb-1">{comic.TenBo}</h6>
                        <p className="m-0">Lượt xem: {comic.TongLuotXem}</p>
                      </td>
                      <td>
                        <h6 className="text-muted">
                          <i className="fa fa-circle text-c-green f-10 m-r-15" />
                          {comic.latestChapter?.ThoiGian
                            ? new Date(comic.latestChapter.ThoiGian).toLocaleDateString()
                            : 'Chưa có chương'}
                        </h6>
                      </td>
                      <td>
                        <Link to={`/manager/comic/comic-index/comic-detail/${comic._id}`} className="label theme-bg text-white f-12">
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
    </Card>
        </Col>
        <Col md={6} xl={4}>
          <Card className="card-event">
            <Card.Body>
              <div className="row align-items-center justify-content-center">
                <div className="col">
                  <h5 className="m-0">Tổng Số Truyện</h5>
                </div>
                <div className="col-auto">
                  <label className="label theme-bg2 text-white f-14 f-w-400 float-end" style={{cursor:'pointer'}}>
                    <a href='/manager/comic/comic-index' className='text-white'>View</a>
                  </label>
                </div>
              </div>

              <h2 className="mt-2 f-w-300">
                {totalSeries}<sub className="text-muted f-14">  Bộ truyện</sub>
              </h2>
              <i className="fa-solid fa-chart-column text-c-purple f-50" />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{totalChapters}</h3>
                  <span className="d-block text-uppercase">Chapter Active</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="fa-solid fa-person f-30 text-c-blue" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{totalAuthors}</h3>
                  <span className="d-block text-uppercase">Authors</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="fa-solid fa-person f-30 text-c-blue" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{totalAuthors}</h3>
                  <span className="d-block text-uppercase">Authors</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
        <Card>
      <Card.Header>
        <Card.Title as="h5">Rating</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="row align-items-center justify-content-center m-b-20">
          <div className="col-6">
            <h2 className="f-w-300 d-flex align-items-center float-start m-0">
              4.7 <i className="fa fa-star f-10 m-l-10 text-c-yellow" />
            </h2>
          </div>
          <div className="col-6">
            <h6 className="d-flex align-items-center float-end m-0">
              {totalRatings} lượt đánh giá
            </h6>
          </div>
        </div>

        <div className="row">
          {ratings.map((rating) => (
            <div className="col-xl-12" key={rating.star}>
              <h6 className="align-items-center float-start">
                <i className="fa fa-star f-10 m-r-10 text-c-yellow" />
                {rating.star}
              </h6>
              <h6 className="align-items-center float-end">{rating.count}</h6>
              <div className="progress m-t-30 m-b-20" style={{ height: '6px' }}>
                <div
                  className="progress-bar progress-c-theme"
                  role="progressbar"
                  style={{
                    width: `${(rating.count / totalRatings) * 100}%`, // Tỷ lệ % so với tổng đánh giá
                  }}
                  aria-valuenow={rating.count}
                  aria-valuemin="0"
                  aria-valuemax={totalRatings}
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
        </Col>
        <Col md={6} xl={8} className="user-activity">
          <Card>
            <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
              <Tab eventKey="today" title="Staff active">
                {tabContent}
              </Tab>
              {/* <Tab eventKey="week" title="This Week">
                {tabContent}
              </Tab>
              <Tab eventKey="all" title="All">
                {tabContent}
              </Tab> */}
            </Tabs>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;

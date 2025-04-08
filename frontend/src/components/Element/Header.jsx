import{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown} from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/logo2.png';
import imgInfo from '../../assets/img/empty-cr-list.png';
import yuzu from '../../assets/yuzu.png';
import SearchBar from './SearchBar';
// import '../../styles/header.css'; // CSS tùy chỉnh cho header

function Header() {
  const navigate = useNavigate();

  // State quản lý trạng thái đăng nhập
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    // Kiểm tra dữ liệu từ URL
    const params = new URLSearchParams(window.location.search);
    const userDataFromParams = params.get("user");
    if (userDataFromParams) {
      const parsedUser = JSON.parse(decodeURIComponent(userDataFromParams));
      localStorage.setItem("user", JSON.stringify(parsedUser));
      setIsAuthenticated(true);
      setUserName(parsedUser.username);
      setUserAvatar(parsedUser.avatar);
  
      // Xóa thông tin từ URL
      window.history.replaceState({}, document.title, "/");
      // console.log("user header:  ", userDataFromStorage)
      return;
    }
    // Kiểm tra dữ liệu từ localStorage
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      setIsAuthenticated(true);
      setUserName(parsedUser.username);
      setUserAvatar(parsedUser.avatar);
      console.log("user header:  ", userDataFromStorage)
    }

    
  }, []);

  const handleLogout = () => {
    // Xóa thông tin đăng nhập
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserName("Guest");
    setUserAvatar("");
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleAuthAlert = ({width, height, title, text, imageUrl, onConfirm, }) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-oke",
        cancelButton: "btn btn-danger mr-3",
        popup: "custom-swal-popup", 
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title,
        text,
        imageUrl,
        imageWidth: width,
        imageHeight: height,
        imageAlt: "Custom image",
        showCancelButton: true,
        confirmButtonText: "Login Now!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        }
      });
  };
  const navigateToInfor = () => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const userData = JSON.parse(userDataFromStorage);
      console.log("Navigating with user data:", userData);
      navigate("/infor", { state: { user: userData } });
    } else {
      console.error("No user data found in localStorage.");
    }
  };

  const navigateToAccount = () => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      const userData = JSON.parse(userDataFromStorage);
      navigate("/account", { state: { user: userData } }); // Truyền thông tin vào state
    } else {
      console.error("No user data found in localStorage.");
    }
  };

  return (
    <header className="header" id="header">
      <div className="nav__side">
        <nav className="nav">
          <Link to="/" className="nav__logo">
            <img className="nav__logo-img" src={logo} alt="Website Logo" />
          </Link>
          <div className="nav__menu nav__menu-list" id="nav-menu">
            <SearchBar />

            <div className="nav__login">
              {isAuthenticated ? (
                <div className=" btn__login dropdown position-relative" style={{color: '#fff'}}>
                  <button className="btn dropdown-toggle " id="dropdown-basic-button" type="button" data-bs-toggle="dropdown">
                    <img
                      src={userAvatar ? `http://localhost:5000${userAvatar}` : "/default-avatar.png"}
                      alt="User"
                      className="header-avatar"
                    />
                    <span className='login-infor'>{userName}</span>
                  </button>
                 <ul className="dropdown-menu dropdown-menu-end" style={{width: '100% !important', maxHeight: 155}} >
                    <li >
                      <a onClick={navigateToInfor} className="dropdown-item text-start" style={{ padding: '.5rem!important' }}>
                        <i className="fa-solid fa-user"></i> Account
                      </a>
                    </li>
                    <li >
                      <a onClick={navigateToAccount} className="dropdown-item text-start" style={{ padding: '.5rem!important' }}>
                        <i className="fa-solid fa-sliders"></i> Settings
                      </a>
                    </li>
                    <li >
                      <a href='/history' className="dropdown-item text-start" style={{ padding: '.5rem!important' }}>
                      <i className="fa-solid fa-clock-rotate-left"></i> Histories
                      </a>
                    </li>
                    <li >
                      <a onClick={handleLogout} className="dropdown-item text-start" style={{ padding: '.5rem!important' }}>
                      <i style={{ color: '#FE0000' }} className="fa-solid fa-right-from-bracket"></i> Logout
                      </a>
                    </li>
                 </ul>
                </div>
              ) : (
                <>
                  <div className="btn__regis mr-2" onClick={handleRegister}>
                    Đăng ký
                  </div>
                  <div className="btn__login" onClick={handleLogin}>
                    Đăng nhập
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="nav__content">
        <nav className="containers nav__content">
          <input type="checkbox" id="sidebar-active" />
          <label htmlFor="sidebar-active" className="open-sidebar-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </label>
          <label id="overlay" htmlFor="sidebar-active"></label>
          <div className="links-container grids">
            <label htmlFor="sidebar-active" className="close-sidebar-button">
              <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </label>
            <Link to="/" className="nav__link">
              Trang Chủ
            </Link>
            <Dropdown>
              <Dropdown.Toggle as="a" className="nav__link" style={{ cursor: 'pointer' }}>
                Thể Loại Truyện
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div className="row">
                  <div className="col-3">
                    <Dropdown.Item className='item-main' as={Link} to="/latest">Tất cả</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406e8ec03445f4711481f5">Xuyên không</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406e97c03445f4711481f8">Adventure</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ea7c03445f4711481fb">One short</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406eaec03445f4711481fe">Sports</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406eb4c03445f471148201">Truyện màu</Dropdown.Item>
                  </div>
                  <div className="col-3">
                    <Dropdown.Item className='item-main' as={Link} to="">Theo Cảm xúc</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ebec03445f471148204">Nhẹ nhàng</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ec8c03445f471148207">Kinh dị</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ed2c03445f47114820a">Lãng mạng</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406e4ec03445f4711481f2">Action</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ee0c03445f471148210">Comedy</Dropdown.Item>
                  </div>
                  <div className="col-3">
                    <Dropdown.Item className='item-main' as={Link} to="">Theo Khu Vực</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ee5c03445f471148213">Manwa</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/adventure">Manhua</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406eedc03445f471148216">Manga</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ef1c03445f471148219">Comic</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/67406ef6c03445f47114821c">Webtoon</Dropdown.Item>
                  </div>
                  <div className="col-3">
                    <Dropdown.Item className='item-main' as={Link} to="">Theo đội tuổi</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/adventure">Mọi độ tuổi</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/adventure">Trẻ em</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/adventure">Thiếu Niên</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/adventure">Bạo lực</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/adventure">Trưởng thành</Dropdown.Item>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
            
            <Link to="/trending" className="nav__link">
              Xu Hướng
            </Link>
            <Link to="/rankings/1" className="nav__link">
              Xếp hạng
            </Link>
            <Link to="/latest" className="nav__item nav__link active-link">Mới cập nhật</Link>
            {isAuthenticated ? (
              <Link to="/following" className="nav__item nav__link active-link">
                Theo dõi
              </Link>
            ) : (
              <a
                id="follow"
                className="nav__item nav__link active-link"
                onClick={() =>
                  handleAuthAlert({
                    width: 200,
                    height: 100,
                    title: "Login Following!",
                    text: "Bạn cần đăng nhập để xem danh sách theo dõi",
                    imageUrl: yuzu,
                    onConfirm: () => navigate("/login"),
                  })
                }
              >
                Theo dõi
              </a>
            )}
            {isAuthenticated ? (
              <Link to="/history" className="nav__item nav__link active-link">
                Lịch sử
              </Link>
            ) : (
              <a
                id="history"
                className="nav__item nav__link active-link"
                onClick={() =>
                  handleAuthAlert({
                    width: 120,
                    height: 150,
                    title: "Login History!",
                    text: "Có vẻ như bạn cần đăng nhập để xem lịch sử đọc!",
                    imageUrl: imgInfo,
                    onConfirm: () => navigate("/login"),
                  })
                }
              >
                Lịch sử
              </a>
            )}
            <a href="https://www.facebook.com/share/fFgCruNduDrskWBa/" className="nav__item nav__link active-link">Fanpage</a>
            <div className="nav__buttons nav__buttons-Pre" style={{ marginLeft: '2.5rem' }}>
              <Link to="/premium">
                <i className="fa-solid fa-crown"></i>
                <span>Try</span> Premium
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

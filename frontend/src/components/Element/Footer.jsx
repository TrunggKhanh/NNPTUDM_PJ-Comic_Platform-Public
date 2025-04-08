import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    // style={{ position: 'relative', padding: '2rem 0', lineHeight: '20px' }}
    <footer className="footer" style={{zIndex: "10"}} >
      <div className="footer__container sections grid row align-content-md-between pt-5">
        <div className="footer__content col-12 col-md-6">
          {/* Main Menu */}
          <div>
            <h3 className="footer__title">Main Menu</h3>
            <ul className="footer__links">
              <li>
                <Link to="/about" className="footer__link">About Us</Link>
              </li>
              <li>
                <Link to="/manga" className="footer__link">Manga</Link>
              </li>
              <li>
                <a href="#" className="footer__link">Random</a>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="footer__title">Information</h3>
            <ul className="footer__links">
              <li>
                <Link to="/contact" className="footer__link">Contact</Link>
              </li>
              <li>
                <a href="#" className="footer__link">Videos</a>
              </li>
              <li>
                <a href="#" className="footer__link">Reservation</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="footer__title">Social Media</h3>
            <ul className="footer__social">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="footer__social-link">
                <i className="ri-facebook-circle-line"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="footer__social-link">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer__social-link">
                <i className="ri-twitter-line"></i>
              </a>
              <a href="https://discord.com/channels/" target="_blank" rel="noreferrer" className="footer__social-link">
                <i className="ri-discord-line"></i>
              </a>
            </ul>
          </div>
        </div>

        {/* Description */}
        <div className="col-12 col-md-6">
          
          <p className="footer__description">
            Website luôn cập nhật nhanh và sớm nhất các đầu truyện hot. <br />
            Đảm bảo tính bảo mật và trải nghiệm của bạn, <br />
            <Link to="/login">Đăng nhập ngay</Link> để lưu lại những bộ truyện ưa thích. <br />
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="footer__info container" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span className="footer__copy">
          &#169; 2024 MangaSmurf. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;

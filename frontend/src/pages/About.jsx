
function About() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3">Chào mừng bạn đọc đến với trang web của chúng tớ!</h1>
      <p className="text-center mb-5">
        Chào các bạn! Chào mừng bạn đến với thế giới Manga đa dạng của chúng tôi! Website của chúng tôi cung cấp một bộ sưu tập phong phú các loạt truyện Manga thuộc đủ thể loại. Hãy tận hưởng trải nghiệm đọc truyện mượt mà với những tính năng được thiết kế riêng cho người yêu Manga. Khám phá ngay những câu chuyện Manga yêu thích của bạn!
      </p>

      <h2 className="text-center mb-4">Team chúng tôi gồm:</h2>
      <div className="row text-center g-4">
        {/* Team Member 1 */}
        <div className="col-md-4">
          <img src="/images/aboutUs/phong.jpg" className="rounded-circle mb-3" alt="Nguyễn Thanh Phong" />
          <h3>Nguyễn Thanh Phong</h3>
          <p>Team Leader</p>
          <a href="https://www.facebook.com/" className="btn btn-primary" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>

        {/* Team Member 2 */}
        <div className="col-md-4">
          <img src="/images/aboutUs/khanh.jpg" className="rounded-circle mb-3" alt="Vũ Trung Khánh" />
          <h3>Vũ Trung Khánh</h3>
          <p>Team Member</p>
          <a href="https://www.facebook.com/" className="btn btn-primary" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>

        {/* Team Member 3 */}
        <div className="col-md-4">
          <img src="/images/aboutUs/dan.jpg" className="rounded-circle mb-3" alt="Phạm Linh Đan" />
          <h3>Phạm Linh Đan</h3>
          <p>Team Member</p>
          <a href="https://www.facebook.com/" className="btn btn-primary" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;

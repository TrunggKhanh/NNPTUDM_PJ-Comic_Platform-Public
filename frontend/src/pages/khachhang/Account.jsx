import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import yuru from "../../assets/img/log-in-yuzu.png";
const Account = () => {
    const [info, setInfo] = useState(null);
    const [user, setUser] = useState(null);
    const [inforUser, setInforUser] = useState(null);
    const [pays, setPays] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [KH, setKH] = useState(true);
    const [loadingPays, setLoadingPays] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const userDataFromStorage = localStorage.getItem("user");
        if (userDataFromStorage) {
            const parsedUser = JSON.parse(userDataFromStorage);
            // setIsAuthenticated(true);
            setUser(parsedUser);
    
            // Fetch user info từ API
            fetch(`http://localhost:5000/api/user/${parsedUser.id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return res.json();
                })
                .then((data) => {
                    setInforUser(data.data);
                    setLoadingUser(false);
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err);
                    setLoadingUser(false);
                });
    
            // Fetch thông tin khách hàng từ API
            fetch(`http://localhost:5000/api/khachhang/${parsedUser.id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch KhachHang data');
                    }
                    return res.json();
                })
                .then((datakh) => {
                    setKH(datakh); // Lưu toàn bộ thông tin khách hàng
                    setLoadingUser(false);
                })
                .catch((err) => {
                    console.error("Error fetching KhachHang data:", err);
                    setLoadingUser(false);
                });
        } else {
            setLoadingUser(false);
        }
    }, []);
    

    useEffect(() => {
        if (user && user.id) {
            // Lấy danh sách hóa đơn từ API mới
            fetch(`http://localhost:5000/api/payment/${user.id}/payments`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch payments');
                    }
                    return res.json();
                })
                .then((data) => {
                    setPays(data.payments);
                    setLoadingPays(false);
                })
                .catch((err) => {
                    console.error("Error fetching payments data:", err);
                    setLoadingPays(false);
                });
        }
    }, [user]);

    useEffect(() => {
        if (info) {
            Swal.fire({
                title: info.includes('thành công') ? 'SUCCESS!' : 'Oops...',
                text: info,
                icon: info.includes('thành công') ? 'success' : 'error',
                timer: 2500,
                showConfirmButton: false,
            });
        }
    }, [info]);

    const handleSaveChanges = (e) => {
        e.preventDefault();
        fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then(() => setInfo('Cập nhật thông tin thành công!'))
            .catch(() => setInfo('Cập nhật thông tin thất bại!'));
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const payload = Object.fromEntries(form.entries());

        fetch('/api/user/update-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then(() => setInfo('Cập nhật mật khẩu thành công!'))
            .catch(() => setInfo('Cập nhật mật khẩu thất bại!'));
    };

    return (
        <div className="containers sections flex-grow-1 container-py my-3 vh-100">
            <div className="card overflow-hidden h-100">
                <div className="row g-0">
                    {/* Sidebar */}
                    <div className="col-md-3">
                        <div className="list-group list-group-flush account-settings-links">
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'general' ? 'active' : ''}`}
                                onClick={() => setActiveTab('general')}
                            >
                                Thông Tin
                            </button>
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                                onClick={() => setActiveTab('password')}
                            >
                                Mật khẩu & Bảo mật
                            </button>
                            <button
                                className={`list-group-item list-group-item-action ${activeTab === 'invoice' ? 'active' : ''}`}
                                onClick={() => setActiveTab('invoice')}
                            >
                                Thanh toán & Hóa đơn
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9">
                        <div className="p-4">
                            <h4 className="fw-bold mb-4">Cài đặt tài khoản</h4>
                            <div className="tab-content">
                                {activeTab === 'general' && (
                                    <div id="account-general">
                                        {loadingUser ? (
                                            <p>Đang tải thông tin tài khoản...</p>
                                        ) : inforUser ? (
                                            <form onSubmit={handleSaveChanges}>
                                                 <div className="mb-2">
                                                    <h3 style={{color: 'red'}}>Ticket Coin: <span>{KH.TicketSalary}</span></h3>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Username</label>
                                                    <input type="text" className="form-control" value={inforUser.UserName || ''} readOnly />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>FullName</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={inforUser.FullName || ''}
                                                        onChange={(e) => setInforUser({ ...inforUser, FullName: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Email</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={inforUser.Email || ''}
                                                        onChange={(e) => setInforUser({ ...inforUser, Email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Trạng thái tài khoản</label>
                                                    <input type="text" className="form-control" value={KH.ActivePremium ? 'Thành viên Premium' : 'Thành viên thông thường'} readOnly />
                                                </div>
                                                <div className="mb-2">
                                                    <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Birthday</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={inforUser.Birth || ''}
                                                        onChange={(e) => setInforUser({ ...inforUser, Birth: e.target.value })}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-end mt-3">
                                                    <button type="submit" className="btn" style={{backgroundColor: "#8770F9", color: "#fff"}}>Save changes</button>
                                                    <button type="button" className="btn btn-outline-secondary ms-2">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <p>Không thể tải thông tin tài khoản.</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'password' && (
                                    <div id="account-change-password">
                                        <form onSubmit={handlePasswordUpdate}>
                                            <div className="mb-2">
                                                <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Email</label>
                                                <input name="email" type="email" className="form-control" required />
                                            </div>
                                            {!user?.googleAccount && (
                                                <div className="mb-2">
                                                    <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Current password</label>
                                                    <input name="currentPassword" type="password" className="form-control" required />
                                                </div>
                                            )}
                                            <div className="mb-2">
                                                <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>New password</label>
                                                <input name="newPassword" type="password" className="form-control" required />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label" style={{color: "#8770F9", fontWeight:600}}>Repeat new password</label>
                                                <input name="confirmNewPassword" type="password" className="form-control" required />
                                            </div>
                                            <div className="d-flex justify-content-end mt-3">
                                                <button type="submit" className="btn btn-primary">Save changes</button>
                                                <button type="button" className="btn btn-outline-secondary ms-2">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'invoice' && (
                                    <div id="account-invoice">
                                        {loadingPays ? (
                                            <p>Đang tải danh sách hóa đơn...</p>
                                        ) : pays.length > 0 ? (
                                            <table className="table table-bordered table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>ID Invoice</th>
                                                        <th>Giá trị</th>
                                                        <th>Ngày thanh toán</th>
                                                        <th>Phương thức thanh toán</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pays.map((pay) => (
                                                        <tr key={pay.id}>
                                                            <td>{pay.IdPayment}</td>
                                                            <td>{pay.PayAmount} USD</td>
                                                            <td>{pay.PayDate}</td>
                                                            <td>{pay.PayMethod}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="section-bottom container w-100" style={{ height: '50vh' }}>
                                                <img src={yuru} alt="cat" />
                                                <span>Opps!!! Có vẻ như bạn chưa có giao dịch nào</span>
                                                <a href="/premium">Xem ngay</a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;

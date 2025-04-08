import { useState, useEffect } from 'react';
import vnpay from '../../assets/vnpay.png';
import visaLogo from '../../assets/visa.png';
import paypalLogo from '../../assets/paypal.png';
const PaymentModal = ({ show, handleClose, selectedPackage }) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [inforUser, setInforUser] = useState(null);
    useEffect(() => {
        const userDataFromStorage = localStorage.getItem("user");
        if (userDataFromStorage) {
            const parsedUser = JSON.parse(userDataFromStorage);
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
                })
                .catch((err) => {
                    console.error("Error fetching user data:", err);
                });
        }
    }, []);


    useEffect(() => {
        if (inforUser?.Email && email === '') {
            setEmail(inforUser.Email);
        }
    }, [inforUser, email]);

    useEffect(() => {
        if (inforUser?.FullName && name === '') {
            setName(inforUser.FullName);
        }
    }, [inforUser, name]);

    const EXCHANGE_RATE = 25458;

    if (!show) return null;

    return (
        <div
            className="modal"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1050,
            }}
        >
            <div className="modal-dialog" style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '0', width: '500px' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thông tin thanh toán</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Hiển thị thông tin gói thanh toán */}
                        <div className="package-info" style={{ marginBottom: '20px' }}>
                            <h6>Gói thanh toán: {selectedPackage.name}</h6>
                            <p >Giá: <span style={{ color: "red", fontSize: '1.2rem', fontWeight: '600' }}>{selectedPackage.price} VND</span></p>
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Fullname</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập họ và tên"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                            />
                        </div>

                        {/* Chọn phương thức thanh toán */}
                        <div className="payment-methods" style={{ textAlign: 'center', marginTop: '20px' }}>
                            <h6 style={{ color: "#8770F9", fontSize: '1.1rem', fontWeight: '600' }}>Phương thức thanh toán</h6>
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                                <div
                                    onClick={() => setSelectedMethod('paypal')}
                                    style={{
                                        border: selectedMethod === 'paypal' ? '2px solid #8770F9' : '2px solid transparent',
                                        padding: '5px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'border 0.3s',
                                    }}
                                >
                                    <img
                                        src={paypalLogo}
                                        alt="PayPal"
                                        style={{
                                            width: '80px',
                                            height: '30px',
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => setSelectedMethod('mastercard')}
                                    style={{
                                        border: selectedMethod === 'mastercard' ? '2px solid #8770F9' : '2px solid transparent',
                                        padding: '5px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'border 0.3s',
                                    }}
                                >
                                    <img
                                        src={vnpay}
                                        alt="vnpay"
                                        style={{
                                            width: '80px',
                                            height: '20px',
                                        }}
                                    />
                                </div>

                                <div
                                    onClick={() => setSelectedMethod('visa')}
                                    style={{
                                        border: selectedMethod === 'visa' ? '2px solid #8770F9' : '2px solid transparent',
                                        padding: '5px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'border 0.3s',
                                    }}
                                >
                                    <img
                                        src={visaLogo}
                                        alt="Visa"
                                        style={{
                                            width: '80px',
                                            height: '20px',
                                        }}
                                    />
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="modal-footer" style={{ marginTop: '20px' }}>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                console.log(user.id);
                                console.log(selectedPackage.price);
                                console.log(selectedMethod);
                                console.log(name);
                                console.log(email);
                                console.log(selectedPackage.ticket);
                                if (!name.trim() || !email.trim() || !selectedMethod.trim()) {
                                    alert('Vui lòng nhập đầy đủ thông tin và chọn phương thức thanh toán!');
                                    return;
                                }
                                fetch('http://localhost:5000/paypal/pay', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        IdUser: user.id,
                                        PayAmount: parseFloat((parseFloat(selectedPackage.price.replace(',', '').replace('.', '')) / EXCHANGE_RATE).toFixed(2)),
                                        PayMethod: selectedMethod,
                                        TicketSalary: parseInt(selectedPackage.ticket)
                                    }),
                                })
                                    .then((response) => {
                                        if (response.ok) return response.json();
                                        throw new Error('Thanh toán thất bại.');
                                    })
                                    .then((data) => {
                                        window.location.href = data.approvalUrl;
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                        alert('Đã xảy ra lỗi khi thanh toán!');
                                    });
                            }}
                        >
                            Xác nhận
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

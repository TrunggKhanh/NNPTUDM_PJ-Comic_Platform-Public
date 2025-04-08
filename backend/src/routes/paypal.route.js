const express = require('express');
const paypal = require('../services/paypal'); // Đường dẫn tới paypal.js
const Payment = require('../model/Payments.model');
const KhachHang= require('../model/khachhang.model');
const User= require('../model/user.model');
const { sendEmail } = require('../services/emailService'); 
const router = express.Router();
const mongoose = require('mongoose');

router.post('/pay', async (req, res) => {
    try {
      const { IdUser, PayAmount, PayMethod, TicketSalary} = req.body;
  
      // Kiểm tra dữ liệu đầu vào
      if (!IdUser || !PayAmount || !PayMethod) {
        return res.status(400).json({ message: 'Thông tin thanh toán không đầy đủ.' });
      }
  
      // Kiểm tra PayMethod có hợp lệ không
      const validPayMethods = ['Cash', 'Card', 'Other', 'paypal'];
      if (!validPayMethods.includes(PayMethod)) {
        return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ.' });
      }
  
      // Tìm KhachHang bằng IdUser
      const khachHang = await KhachHang.findOne({ IdUser });
      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
      }

      const user = await User.findOne({ IdUser: IdUser });
        if (!user) {
            return res.status(404).json({  message: 'User not found' });
        }
  
      // Tạo Payment
      const newPayment = new Payment({
        IdPayment: `PAY-${Date.now()}`,
        IdUser,
        PayAmount,
        PayMethod,
        PayStats: 'Completed',
      });
  
      // Lưu Payment vào MongoDB
      await newPayment.save();
  
      // Cập nhật thông tin KhachHang
      khachHang.ActivePremium = true; // Kích hoạt trạng thái Premium
      khachHang.TicketSalary += TicketSalary
      khachHang.Payments.push(newPayment._id); // Liên kết Payment với KhachHang
      await khachHang.save();
  
      // Tạo đơn hàng trên PayPal
      const approvalUrl = await paypal.createOrder(PayAmount);

      const placeholders = {
        name: user.FullName || 'Khách hàng',
        subject: 'Thanh toán thành công',
        package: 'Gói Premium',
        price: `${PayAmount} VND`,
        link: 'http://localhost:5173/account',
      };

      await sendEmail(
        user.Email,
        'Xác nhận thanh toán', 
        placeholders, 
        'payment-success.html'
      );

      res.json({ approvalUrl }); // Gửi URL phê duyệt cho client
    } catch (error) {
      console.error('Error in /pay:', error.message);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý thanh toán.', error: error.message });
    }
  });
  
// Xử lý hoàn tất thanh toán
router.get('/complete-order', async (req, res) => {
    const orderId = req.query.token; // Lấy mã đơn hàng từ query
    try {
        const captureResponse = await paypal.capturePayment(orderId); // Xác nhận thanh toán

        console.log('Payment captured successfully:', captureResponse);

        // Chuyển hướng về trang chủ React với thông báo thành công
        res.redirect('http://localhost:5173/?paymentStatus=success');
    } catch (error) {
        console.error('Error in /complete-order:', error.response?.data || error.message);

        // Chuyển hướng về trang chủ React với thông báo lỗi
        res.redirect('http://localhost:5173/?paymentStatus=error');
    }
});


// Xử lý hủy đơn hàng
router.get('/cancel-order', (req, res) => {
    res.send('Payment was cancelled.'); // Phản hồi hủy thanh toán
});

module.exports = router;

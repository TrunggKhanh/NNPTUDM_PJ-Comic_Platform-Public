const express = require('express');
const router = express.Router();
const Payment = require('../model/Payments.model');

// Lấy danh sách thanh toán dựa trên IdUser
router.get('/:idUser/payments', async (req, res) => {
    const { idUser } = req.params;

    try {
        // Tìm danh sách thanh toán dựa trên IdUser
        const payments = await Payment.find({ IdUser: idUser });

        if (payments.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thanh toán nào cho người dùng này.' });
        }

        res.status(200).json({
            message: 'Danh sách thanh toán được lấy thành công.',
            payments,
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách thanh toán.', error: error.message });
    }
});

// Route: Lấy tất cả payments
router.get('/payments', async (req, res) => {
    try {
        // Lấy tất cả các bản ghi từ collection Payment
        const payments = await Payment.find();

        // Trả về danh sách payments
        res.status(200).json({
            message: 'Danh sách tất cả payments',
            data: payments,
        });
    } catch (error) {
        console.error('Error fetching payments:', error.message);
        res.status(500).json({
            message: 'Đã xảy ra lỗi khi lấy danh sách payments',
            error: error.message,
        });
    }
});

module.exports = router;

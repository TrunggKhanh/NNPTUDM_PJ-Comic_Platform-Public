const express = require('express');
const router = express.Router();
const KhachHang = require('../../model/khachhang.model');
const User = require('../../model/user.model');



// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
    try {
        // Join KhachHang and User using IdUser
        const customers = await KhachHang.find();
        const userIds = customers.map(customer => customer.IdUser);

        const users = await User.find({ IdUser: { $in: userIds } })
            .select('IdUser FullName Email Active'); // Lấy thông tin User dựa vào IdUser

        const userMap = users.reduce((acc, user) => {
            acc[user.IdUser] = user; // Map IdUser để truy cập nhanh
            return acc;
        }, {});

        const formattedCustomers = customers.map((customer) => ({
            IdUser: customer.IdUser,
            FullName: userMap[customer.IdUser]?.FullName || "Không rõ",
            Email: userMap[customer.IdUser]?.Email || "Không rõ",
            Active: userMap[customer.IdUser]?.Active ?? false,
            GoogleAccount: customer.GoogleAccount || "Chưa cập nhật",
            FacebookAccount: customer.FacebookAccount || "Chưa cập nhật",
            ActivePremium: customer.ActivePremium,
            ActiveStats: customer.ActiveStats,
        }));

        res.status(200).json(formattedCustomers);
    } catch (err) {
        console.error("Error fetching customer list:", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách khách hàng" });
    }
});

// Xóa khách hàng
router.delete('/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await KhachHang.findOneAndDelete({ IdUser: customerId });

        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        res.status(200).json({ message: "Xóa khách hàng thành công" });
    } catch (err) {
        console.error("Error deleting customer:", err);
        res.status(500).json({ message: "Lỗi khi xóa khách hàng" });
    }
});

// Thay đổi trạng thái Premium
router.put('/:id/toggle-premium', async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await KhachHang.findOne({ IdUser: customerId });

        if (!customer) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        customer.ActivePremium = !customer.ActivePremium;
        await customer.save();

        res.status(200).json({
            message: "Trạng thái Premium đã được thay đổi",
            ActivePremium: customer.ActivePremium,
        });
    } catch (err) {
        console.error("Error toggling Premium status:", err);
        res.status(500).json({ message: "Lỗi khi thay đổi trạng thái Premium" });
    }
});

module.exports = router;

const express = require('express');
const TacGia = require('../model/tacgia.model'); // Đường dẫn tới model TacGia
const router = express.Router();

// Tạo một tác giả mới
router.post('/create', async (req, res) => {
    try {
        const tacGia = new TacGia(req.body);
        await tacGia.save();
        res.status(201).send({
            message: "Tác giả được tạo thành công",
            tacGia
        });
    } catch (error) {
        console.error('Error creating TacGia:', error);
        res.status(500).send({ message: "Lỗi khi tạo tác giả" });
    }
});

// Lấy danh sách tất cả tác giả
router.get('/', async (req, res) => {
    try {
        const tacGias = await TacGia.find({ active: true }); // Chỉ lấy các tác giả đang hoạt động
        res.status(200).send(tacGias);
    } catch (error) {
        console.error('Error fetching TacGias:', error);
        res.status(500).send({ message: 'Failed to fetch TacGias' });
    }
});

// Lấy chi tiết một tác giả
router.get('/:id', async (req, res) => {
    try {
        const tacGia = await TacGia.findById(req.params.id);
        if (!tacGia) {
            return res.status(404).send({ message: 'Tác giả không tìm thấy' });
        }
        res.status(200).send(tacGia);
    } catch (error) {
        console.error('Error fetching TacGia:', error);
        res.status(500).send({ message: 'Failed to fetch TacGia' });
    }
});

// Cập nhật thông tin tác giả
router.patch('/update/:id', async (req, res) => {
    try {
        const updatedTacGia = await TacGia.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTacGia) {
            return res.status(404).send({ message: 'Tác giả không tìm thấy' });
        }
        res.status(200).send({ message: 'Cập nhật tác giả thành công', tacGia: updatedTacGia });
    } catch (error) {
        console.error('Error updating TacGia:', error);
        res.status(500).send({ message: 'Failed to update TacGia' });
    }
});

// Xóa một tác giả
router.delete('/:id', async (req, res) => {
    try {
        const deletedTacGia = await TacGia.findByIdAndDelete(req.params.id);
        if (!deletedTacGia) {
            return res.status(404).send({ message: 'Tác giả không tìm thấy' });
        }
        res.status(200).send({ message: 'Xóa tác giả thành công' });
    } catch (error) {
        console.error('Error deleting TacGia:', error);
        res.status(500).send({ message: 'Failed to delete TacGia' });
    }
});

module.exports = router;

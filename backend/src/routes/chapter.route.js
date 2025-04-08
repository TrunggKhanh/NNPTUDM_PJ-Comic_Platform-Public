const express = require('express');
const Chapter = require('../model/chapter.model'); 
const BoTruyen = require('../model/botruyen.model'); 
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment'); 
// Tạo mới một chương
router.post('/create', async (req, res) => {
    const { id_bo, stt_chap, ten_chap, content, premium, ticket_cost } = req.body;

    try {
        // Kiểm tra bộ truyện có tồn tại
        const boTruyen = await BoTruyen.findById(id_bo);
        if (!boTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy bộ truyện' });
        }

        // Tạo chương mới
        const chapter = new Chapter({
            id_bo,
            stt_chap,
            ten_chap,
            content,
            premium,
            ticket_cost,
        });

        await chapter.save();
        res.status(201).json({ message: 'Tạo chương thành công', chapter });
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ message: 'Lỗi khi tạo chương' });
    }
});

// Lấy chi tiết một chương
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const chapter = await Chapter.findById(id).populate('id_bo', 'tenbo');
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chương' });
        }
        res.status(200).json(chapter);
    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin chương' });
    }
});

// Lấy danh sách chương theo bộ truyện
router.get('/by-book/:id_bo', async (req, res) => {
    const { id_bo } = req.params;

    try {
        const chapters = await Chapter.find({ id_bo, active: true }) // Lọc theo ID bộ truyện và chương đang hoạt động
            .sort({ stt_chap: 1 }); // Sắp xếp theo số thứ tự chương tăng dần
        res.status(200).json(chapters);
    } catch (error) {
        console.error('Error fetching chapters by book:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chương' });
    }
});

//Lấy danh sách ctchapter dựa vào Id_bo và stt chapchap
router.get('/:id_bo/:stt_chap/pages', async (req, res) => {
    const { id_bo, stt_chap } = req.params;

    try {
        // Tìm chương và populate tên bộ truyện
        const chapterInfo = await Chapter.findOne({ id_bo, stt_chap }).populate('id_bo', 'tenbo');
        if (!chapterInfo) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin chương' });
        }

        // Tăng số lượt xem của chương
        chapterInfo.luotxem += 1;
        await chapterInfo.save();

        // Tăng số lượt xem tổng của bộ truyện
        const boTruyen = await BoTruyen.findById(id_bo);
        if (boTruyen) {
            boTruyen.TongLuotXem += 1;
            await boTruyen.save();
        }

        // Định dạng thời gian
        const formattedTime = moment(chapterInfo.thoi_gian).format('HH:mm DD/MM/YYYY');

        // Chuẩn bị dữ liệu trả về
        const response = {
            ten_bo: chapterInfo.id_bo.tenbo, // Tên bộ truyện
            ten_chap: chapterInfo.ten_chap, // Tên chương
            thoi_gian: formattedTime, // Thời gian định dạng
            luot_xem: chapterInfo.luotxem, // Lượt xem
            chi_tiet: chapterInfo.list_pages, // Danh sách các trang
        };

        // Trả về dữ liệu
        res.status(200).json({
            message: 'Lấy thông tin chương thành công',
            data: response,
        });
    } catch (error) {
        console.error('Error fetching chapter info:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin chương' });
    }
});


// Cập nhật chương
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ten_chap, content, premium, ticket_cost, trangthai } = req.body;

    try {
        const chapter = await Chapter.findByIdAndUpdate(
            id,
            { ten_chap, content, premium, ticket_cost, trangthai },
            { new: true }
        );

        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chương' });
        }

        res.status(200).json({ message: 'Cập nhật chương thành công', chapter });
    } catch (error) {
        console.error('Error updating chapter:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật chương' });
    }
});

// Xóa chương
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const chapter = await Chapter.findByIdAndDelete(id);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chương' });
        }
        res.status(200).json({ message: 'Xóa chương thành công' });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ message: 'Lỗi khi xóa chương' });
    }
});

// Tăng lượt xem cho chương
router.post('/:id/increase-view', async (req, res) => {
    const { id } = req.params;

    try {
        const chapter = await Chapter.findByIdAndUpdate(
            id,
            { $inc: { luotxem: 1 } }, // Tăng lượt xem lên 1
            { new: true }
        );

        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chương' });
        }

        res.status(200).json({ message: 'Tăng lượt xem thành công', luotxem: chapter.luotxem });
    } catch (error) {
        console.error('Error increasing chapter views:', error);
        res.status(500).json({ message: 'Lỗi khi tăng lượt xem' });
    }
});

module.exports = router;

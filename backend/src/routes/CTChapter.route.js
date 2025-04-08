const express = require('express');
const mongoose = require('mongoose');
const CT_Chapter = require('../model/CT_Chapter.model'); 
const BoTruyen = require('../model/botruyen.model'); 
const Chapter = require('../model/chapter.model'); 
const router = express.Router();
const moment = require('moment');
// Tạo mới chi tiết chương
router.post('/create', async (req, res) => {
    const { id_bo, stt_chap, so_trang, anh_trang } = req.body;

    try {
        const boTruyen = await BoTruyen.findById(id_bo);
        if (!boTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy bộ truyện' });
        }
        const ctChapter = new CT_Chapter({
            id_bo,
            stt_chap,
            so_trang,
            anh_trang,
        });

        await ctChapter.save();
        res.status(201).json({ message: 'Tạo chi tiết chương thành công', ctChapter });
    } catch (error) {
        console.error('Error creating CT_Chapter:', error);
        res.status(500).json({ message: 'Lỗi khi tạo chi tiết chương' });
    }
});

router.get('/by-chapter/:id_bo/:stt_chap', async (req, res) => {
    const { id_bo, stt_chap } = req.params;

    try {
        const ctChapters = await CT_Chapter.find({ id_bo, stt_chap, active: true })
            .sort({ so_trang: 1 }) 
            .select("so_trang anh_trang") 
            .lean();

        if (ctChapters.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết chương' });
        }
        // Lấy thông tin bộ truyện và chương
        const chapterInfo = await Chapter.findOne({ id_bo, stt_chap }).populate('id_bo', 'tenbo');
        if (!chapterInfo) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin chương' });
        }
        // Định dạng thời gian
        const formattedTime = moment(chapterInfo.thoi_gian).format('hh:mm DD/MM/YYYY');
        // Chuẩn bị dữ liệu trả về
        const response = {
            ten_bo: chapterInfo.id_bo.tenbo, 
            ten_chap: chapterInfo.ten_chap, 
            thoi_gian: formattedTime, 
            luot_xem: chapterInfo.luotxem || 0, 
            chi_tiet: ctChapters, 
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching CT_Chapters by chapter:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chi tiết chương' });
    }
});
// Lấy chi tiết một trang
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    try {
        const ctChapter = await CT_Chapter.findById(id);

        if (!ctChapter) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết chương' });
        }

        res.status(200).json(ctChapter);
    } catch (error) {
        console.error('Error fetching CT_Chapter by ID:', error);
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết chương' });
    }
});

// Cập nhật chi tiết chương
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { so_trang, anh_trang, active } = req.body;

    try {
        const ctChapter = await CT_Chapter.findByIdAndUpdate(
            id,
            { so_trang, anh_trang, active },
            { new: true }
        );

        if (!ctChapter) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết chương' });
        }

        res.status(200).json({ message: 'Cập nhật chi tiết chương thành công', ctChapter });
    } catch (error) {
        console.error('Error updating CT_Chapter:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết chương' });
    }
});

// Xóa chi tiết chương
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ctChapter = await CT_Chapter.findByIdAndDelete(id);

        if (!ctChapter) {
            return res.status(404).json({ message: 'Không tìm thấy chi tiết chương' });
        }

        res.status(200).json({ message: 'Xóa chi tiết chương thành công' });
    } catch (error) {
        console.error('Error deleting CT_Chapter:', error);
        res.status(500).json({ message: 'Lỗi khi xóa chi tiết chương' });
    }
});

// Lấy tất cả trang của một bộ truyện (phục vụ tính năng quản lý hoặc debug)
router.get('/by-book/:id_bo', async (req, res) => {
    const { id_bo } = req.params;

    try {
        const ctChapters = await CT_Chapter.find({ id_bo, active: true }).sort({
            stt_chap: 1,
            so_trang: 1,
        });

        if (ctChapters.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy trang nào' });
        }

        res.status(200).json(ctChapters);
    } catch (error) {
        console.error('Error fetching CT_Chapters by book:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách chi tiết chương' });
    }
});

module.exports = router;

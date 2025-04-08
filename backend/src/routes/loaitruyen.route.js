const express = require('express');
const LoaiTruyen = require('../model/loaitruyen.model'); // Import model LoaiTruyen
const BoTruyen = require('../model/botruyen.model'); // Import model BoTruyen
const router = express.Router();

// Tạo mới một thể loại truyện
router.post('/create', async (req, res) => {
    const { ten_loai, active } = req.body;

    try {
        // Kiểm tra nếu thể loại đã tồn tại
        const existingLoaiTruyen = await LoaiTruyen.findOne({ ten_loai: ten_loai.trim() });
        
        if (existingLoaiTruyen) {
            return res.status(400).json({ message: 'Thể loại đã tồn tại' });
        }

        // Tạo thể loại mới
        const loaiTruyen = new LoaiTruyen({ ten_loai, active });
        await loaiTruyen.save();
        res.status(201).json({ message: 'Tạo thể loại thành công', loaiTruyen });
    } catch (error) {
        console.error('Error creating Loai Truyen:', error);
        res.status(500).json({ message: 'Lỗi khi tạo thể loại' });
    }
});

// Tạo nhiều thể loại truyện
router.post('/create-many', async (req, res) => {
    const loaiTruyens = req.body; 

    if (!Array.isArray(loaiTruyens) || loaiTruyens.length === 0) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ hoặc bị trống' });
    }

    try {
        const createdLoaiTruyens = [];

        for (const loaiTruyen of loaiTruyens) {
            const { ten_loai, active } = loaiTruyen;
            const existingLoaiTruyen = await LoaiTruyen.findOne({ ten_loai: ten_loai.trim() });
            if (existingLoaiTruyen) {
                console.log(`Thể loại "${ten_loai}" đã tồn tại. Bỏ qua.`);
                continue;
            }
            const newLoaiTruyen = new LoaiTruyen({ ten_loai, active });
            await newLoaiTruyen.save();
            createdLoaiTruyens.push(newLoaiTruyen);
        }

        res.status(201).json({
            message: 'Tạo nhiều thể loại thành công',
            createdLoaiTruyens,
        });
    } catch (error) {
        console.error('Error creating multiple Loai Truyen:', error);
        res.status(500).json({ message: 'Lỗi khi tạo nhiều thể loại' });
    }
});



// Lấy tất cả các thể loại truyện
router.get('/', async (req, res) => {
    try {
        const loaiTruyen = await LoaiTruyen.find({ active: true }); // Chỉ lấy thể loại đang hoạt động
        res.status(200).json(loaiTruyen);
    } catch (error) {
        console.error('Error fetching Loai Truyen:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thể loại' });
    }
});

// Thêm bộ truyện vào loại truyện và đồng bộ bộ truyện
router.post('/:id/add-bo-truyen', async (req, res) => {
    const { id } = req.params; // ID của LoaiTruyen
    const { boTruyenId } = req.body; // ID của BoTruyen

    try {
        // Cập nhật danh sách bộ trong LoaiTruyen
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            id,
            { $addToSet: { listTruyen: boTruyenId } }, // Tránh thêm trùng lặp
            { new: true }
        );

        if (!loaiTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy loại truyện' });
        }

        // Cập nhật danh sách loại trong BoTruyen
        const boTruyen = await BoTruyen.findByIdAndUpdate(
            boTruyenId,
            { $addToSet: { listloai: id } }, // Tránh thêm trùng lặp
            { new: true }
        );

        if (!boTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy bộ truyện' });
        }

        res.status(200).json({
            message: 'Thêm bộ truyện vào loại truyện thành công',
            loaiTruyen,
            boTruyen,
        });
    } catch (error) {
        console.error('Error adding BoTruyen to LoaiTruyen:', error);
        res.status(500).json({ message: 'Lỗi khi thêm bộ truyện vào loại truyện' });
    }
});


router.post('/:id/remove-bo-truyen', async (req, res) => {
    const { id } = req.params;
    const { boTruyenId } = req.body; 

    try {
        // Xóa bộ truyện khỏi loại
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            id,
            { $pull: { listTruyen: boTruyenId } },
            { new: true }
        );

        if (!loaiTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy loại truyện' });
        }

        // Xóa loại khỏi bộ truyện
        const boTruyen = await BoTruyen.findByIdAndUpdate(
            boTruyenId,
            { $pull: { listloai: id } },
            { new: true }
        );

        if (!boTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy bộ truyện' });
        }

        res.status(200).json({
            message: 'Xóa bộ truyện khỏi loại truyện thành công',
            loaiTruyen,
            boTruyen,
        });
    } catch (error) {
        console.error('Error removing BoTruyen from LoaiTruyen:', error);
        res.status(500).json({ message: 'Lỗi khi xóa bộ truyện khỏi loại truyện' });
    }
});



// // Lấy tất cả bộ truyện theo thể loại
// router.get('/:id/truyen', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const boTruyen = await BoTruyen.find({ listloai: id, active: true }) // Lọc bộ truyện theo thể loại và trạng thái
//             .populate('id_tg', 'ten') // Lấy thông tin tác giả
//             .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

//         res.status(200).json(boTruyen);
//     } catch (error) {
//         console.error('Error fetching Bo Truyen by Loai:', error);
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách bộ truyện theo thể loại' });
//     }
// });


// Lấy danh sách truyện theo idloaitruyen
router.get('/:id', async (req, res) => {
    const { id } = req.params; // ID thể loại
    const { page = 1, limit = 12, trangthai } = req.query; // Lấy tham số từ query

    try {
        const query = { listloai: id, active: true };

        // Lọc theo trạng thái nếu có
        if (trangthai) {
            query.trangthai = trangthai;
        }

        // Tính toán phân trang
        const skip = (page - 1) * limit;

        // Lấy danh sách bộ truyện
        const boTruyen = await BoTruyen.find(query)
            .populate('id_tg', 'ten') // Lấy tên tác giả
            .select('tenbo poster TongLuotXem id_tg') // Lựa chọn các trường cần lấy
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo
            .skip(skip)
            .limit(parseInt(limit));

        // Tính tổng số truyện thuộc thể loại
        const total = await BoTruyen.countDocuments(query);

        // Trả về danh sách bộ truyện cùng thông tin phân trang
        res.status(200).json({
            comics: boTruyen,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching Bo Truyen by idloaitruyen:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách bộ truyện theo thể loại' });
    }
});


// Cập nhật thông tin thể loại
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ten_loai, active } = req.body;

    try {
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            id,
            { ten_loai, active },
            { new: true }
        );

        if (!loaiTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        }

        res.status(200).json({ message: 'Cập nhật thể loại thành công', loaiTruyen });
    } catch (error) {
        console.error('Error updating Loai Truyen:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thể loại' });
    }
});

// Xóa thể loại
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const loaiTruyen = await LoaiTruyen.findByIdAndDelete(id);

        if (!loaiTruyen) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        }

        res.status(200).json({ message: 'Xóa thể loại thành công' });
    } catch (error) {
        console.error('Error deleting Loai Truyen:', error);
        res.status(500).json({ message: 'Lỗi khi xóa thể loại' });
    }
});

module.exports = router;

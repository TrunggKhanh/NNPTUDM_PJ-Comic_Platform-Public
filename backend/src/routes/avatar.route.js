const express = require('express');
const Avatar = require('../model/Avatar.model'); 
const router = express.Router();

// Tạo mới một avatar
router.post('/create', async (req, res) => {
    const { AvatarContent, Active } = req.body;

    try {
        const avatar = new Avatar({
            AvatarContent,
            Active,
        });

        await avatar.save();
        res.status(201).json({ message: 'Tạo avatar thành công', avatar });
    } catch (error) {
        console.error('Error creating avatar:', error);
        res.status(500).json({ message: 'Lỗi khi tạo avatar' });
    }
});

// Lấy chi tiết một avatar
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const avatar = await Avatar.findById(id);
        if (!avatar) {
            return res.status(404).json({ message: 'Không tìm thấy avatar' });
        }
        res.status(200).json(avatar);
    } catch (error) {
        console.error('Error fetching avatar:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin avatar' });
    }
});

// Lấy danh sách tất cả avatar
router.get('/', async (req, res) => {
    try {
        const avatars = await Avatar.find({ Active: true }).sort({ createdAt: -1 });
        res.status(200).json(avatars);
    } catch (error) {
        console.error('Error fetching avatars:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách avatar' });
    }
});

// Cập nhật avatar
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { AvatarContent, Active } = req.body;

    try {
        const avatar = await Avatar.findByIdAndUpdate(
            id,
            { AvatarContent, Active },
            { new: true }
        );

        if (!avatar) {
            return res.status(404).json({ message: 'Không tìm thấy avatar' });
        }

        res.status(200).json({ message: 'Cập nhật avatar thành công', avatar });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật avatar' });
    }
});

// Xóa avatar
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const avatar = await Avatar.findByIdAndDelete(id);
        if (!avatar) {
            return res.status(404).json({ message: 'Không tìm thấy avatar' });
        }
        res.status(200).json({ message: 'Xóa avatar thành công' });
    } catch (error) {
        console.error('Error deleting avatar:', error);
        res.status(500).json({ message: 'Lỗi khi xóa avatar' });
    }
});

module.exports = router;

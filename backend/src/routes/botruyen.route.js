const express = require('express');
const upload = require('../middleware/upload.middleware');
const BoTruyen = require('../model/botruyen.model');
const TacGia = require('../model/tacgia.model');
const LoaiTruyen = require('../model/loaitruyen.model');
const CTBoTruyen = require('../model/CTBoTruyen.model');
const Chapter = require('../model/chapter.model');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

// Taọ mới bộ truyện
router.post('/create-post', async (req, res) => {
    const {
        id_tg,
        ...boTruyenData
    } = req.body;

    // Kiểm tra ID tác giả có tồn tại không
    try {
        const tacGia = await TacGia.findById(id_tg);
        if (!tacGia) {
            return res.status(404).send({
                message: "Tác giả không tìm thấy"
            });
        }
        // Nếu tác giả tồn tại, tạo bộ truyện mới với dữ liệu nhận được
        const newPost = new BoTruyen({
            ...boTruyenData,
            id_tg
        });
        await newPost.save();
        res.status(201).send({
            message: "Bộ truyện được tạo thành công",
            post: newPost
        });
    } catch (error) {
        console.log("Error : ", error);
        res.status(500).send({
            message: "Lỗi khi tạo bộ truyện"
        });
    }
});


// Tạo danh sách bộ truyện và liên kết loại truyện
router.post('/create-many-and-sync', async (req, res) => {
    const boTruyens = req.body; // Mảng các bộ truyện từ request body

    if (!Array.isArray(boTruyens) || boTruyens.length === 0) {
        return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ hoặc bị trống' });
    }

    try {
        const createdBoTruyens = [];
        const updatedLoaiTruyens = new Map(); // Để theo dõi loại truyện đã cập nhật

        for (const boTruyen of boTruyens) {
            const { id_tg, listloai, ...boTruyenData } = boTruyen;
            const tacGia = await TacGia.findById(id_tg);
            if (!tacGia) {
                console.log(`Tác giả với ID "${id_tg}" không tồn tại. Bỏ qua.`);
                continue;
            }
            const newBoTruyen = new BoTruyen({
                ...boTruyenData,
                id_tg,
            });
            await newBoTruyen.save();
            createdBoTruyens.push(newBoTruyen);
            if (Array.isArray(listloai) && listloai.length > 0) {
                for (const loaiId of listloai) {
                    const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
                        loaiId,
                        { $addToSet: { listTruyen: newBoTruyen._id } },
                        { new: true }
                    );

                    if (!loaiTruyen) {
                        console.log(`Loại truyện với ID "${loaiId}" không tồn tại. Bỏ qua.`);
                        continue;
                    }
                    if (!updatedLoaiTruyens.has(loaiId)) {
                        updatedLoaiTruyens.set(loaiId, loaiTruyen);
                    }
                    await BoTruyen.findByIdAndUpdate(
                        newBoTruyen._id,
                        { $addToSet: { listloai: loaiId } },
                        { new: true }
                    );
                }
            }
        }

        res.status(201).json({
            message: 'Tạo danh sách bộ truyện và đồng bộ loại truyện thành công',
            createdBoTruyens,
            updatedLoaiTruyens: Array.from(updatedLoaiTruyens.values()),
        });
    } catch (error) {
        console.error('Error creating BoTruyen and syncing LoaiTruyen:', error);
        res.status(500).json({ message: 'Lỗi khi tạo bộ truyện và đồng bộ loại truyện' });
    }
});


router.post('/create', upload.single('image'), async (req, res) => {
    const {
        id_tg,
        tenbo,
        mota,
        dotuoi
    } = req.body;

    try {
        const tacGia = await TacGia.findById(id_tg);
        if (!tacGia) {
            return res.status(404).send({
                message: "Tác giả không tìm thấy"
            });
        }
        if (!req.file) {
            return res.status(400).send({
                message: "Vui lòng upload ảnh"
            });
        }
        const filePath = `/uploads/${req.file.filename}`;
        const newPost = new BoTruyen({
            tenbo,
            mota,
            dotuoi,
            poster: filePath,
            id_tg,
        });

        await newPost.save();

        res.status(201).send({
            message: "Bộ truyện được tạo thành công",
            post: newPost,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Lỗi khi tạo bộ truyện"
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const Botruyen = await BoTruyen.find({ active: true });
        res.status(200).json(Botruyen);
    } catch (error) {
        console.error('Error fetching botruyen Truyen:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách truyện' });
    }
});

// Lấy tất cả các truyện theo gợi ýý
router.post('/get-recommended-books', async (req, res) => {
    const { bookId } = req.body;

    if (!bookId) {
        return res.status(400).json({ message: "Missing 'bookId' in request body" });
    }

    try {
        // Gọi API Python để lấy recommended_books_id
        const pythonResponse = await axios.post('http://127.0.0.1:5000/goi-y-sach', { "Book-Id": bookId });

        if (pythonResponse.status !== 200 || !pythonResponse.data.recommended_books_id) {
            return res.status(500).json({ message: "Failed to fetch recommendations from Python API" });
        }
        const recommendedIds = pythonResponse.data.recommended_books_id;
        const objectIds = recommendedIds.map(id => {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return new mongoose.Types.ObjectId(id);
            } else {
                console.warn(`Invalid ObjectId: ${id}`);
                return null;
            }
        }).filter(id => id !== null);
        const recommendedBooks = await BoTruyen.find({ _id: { $in: objectIds } });
        return res.status(200).json({
            status: 200,
            recommendedBooks: recommendedBooks
        });
    } catch (error) {
        console.error('Error fetching Bo Truyen by ID:', error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
});



// Thêm loại truyện vào bộ truyện 
router.post('/:id/add-loai', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        loaiTruyenId
    } = req.body;

    try {
        // Cập nhật danh sách loại trong BoTruyen
        const boTruyen = await BoTruyen.findByIdAndUpdate(
            id, {
            $addToSet: {
                listloai: loaiTruyenId
            }
        }, {
            new: true
        }
        );

        if (!boTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy bộ truyện'
            });
        }

        // Cập nhật danh sách bộ truyện trong LoaiTruyen
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            loaiTruyenId, {
            $addToSet: {
                listTruyen: id
            }
        }, // Tránh thêm trùng lặp
            {
                new: true
            }
        );

        if (!loaiTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy loại truyện'
            });
        }

        res.status(200).json({
            message: 'Thêm loại truyện vào bộ truyện thành công',
            boTruyen,
            loaiTruyen,
        });
    } catch (error) {
        console.error('Error adding LoaiTruyen to BoTruyen:', error);
        res.status(500).json({
            message: 'Lỗi khi thêm loại truyện vào bộ truyện'
        });
    }
});


// Xóa loại truyện vào bộ truyện 
router.post('/:id/remove-loai', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        loaiTruyenId
    } = req.body;

    try {
        // Xóa loại khỏi bộ truyện
        const boTruyen = await BoTruyen.findByIdAndUpdate(
            id, {
            $pull: {
                listloai: loaiTruyenId
            }
        }, {
            new: true
        }
        );

        if (!boTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy bộ truyện'
            });
        }

        // Xóa bộ truyện khỏi loại
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            loaiTruyenId, {
            $pull: {
                listTruyen: id
            }
        }, {
            new: true
        }
        );

        if (!loaiTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy loại truyện'
            });
        }

        res.status(200).json({
            message: 'Xóa loại truyện khỏi bộ truyện thành công',
            boTruyen,
            loaiTruyen,
        });
    } catch (error) {
        console.error('Error removing LoaiTruyen from BoTruyen:', error);
        res.status(500).json({
            message: 'Lỗi khi xóa loại truyện khỏi bộ truyện'
        });
    }
});

// sắp xếp truyen có lượt đọc cao nhất
router.get('/top-read', async (req, res) => {
    try {
        const topReadComics = await BoTruyen.find({
            active: true
        })
            .sort({
                TongLuotXem: -1
            })
            .limit(10)
            .populate('id_tg', 'ten');
        res.status(200).json(topReadComics);
        // console.log("luot xem ", topReadComics);
    } catch (error) {
        console.error('Error fetching top-read comics:', error);
        res.status(500).send({
            message: 'Lỗi khi lấy danh sách top truyện'
        });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await LoaiTruyen.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send({
            message: 'Lỗi khi lấy danh sách loại truyện'
        });
    }
});


function calculateTimeAgo(releaseDate) {
    if (!releaseDate) return "Không có thông tin thời gian";

    const now = new Date();
    const timeSinceRelease = now - new Date(releaseDate);

    const minutes = Math.floor(timeSinceRelease / (1000 * 60));
    const hours = Math.floor(timeSinceRelease / (1000 * 60 * 60));
    const days = Math.floor(timeSinceRelease / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (minutes < 60) {
        return `${minutes} phút trước`;
    } else if (hours < 24) {
        return `${hours} giờ trước`;
    } else if (days < 7) {
        return `${days} ngày trước`;
    } else if (weeks < 4) {
        return `${weeks} tuần trước`;
    } else {
        return `${months} tháng trước`;
    }
}



// Lấy danh sách truyện mới cập nhật
router.get('/latest', async (req, res) => {
    try {
        // Lấy danh sách truyện mới nhất
        const latestComics = await BoTruyen.find({
            active: true
        })
            .sort({
                updatedAt: -1
            })
            .limit(12)
            .select('tenbo poster premium updatedAt')
            .lean();

        // Lấy chương mới nhất cho từng truyện
        const comicIds = latestComics.map((comic) => comic._id);
        const latestChapters = await Chapter.aggregate([{
            $match: {
                id_bo: {
                    $in: comicIds
                },
                active: true
            }
        },
        {
            $sort: {
                thoi_gian: -1
            }
        },
        {
            $group: {
                _id: '$id_bo',
                latestChapter: {
                    $first: '$$ROOT'
                }
            }
        },
        ]);

        // Ghép chương mới nhất vào danh sách truyện
        const chapterMap = latestChapters.reduce((map, chap) => {
            map[chap._id] = chap.latestChapter;
            return map;
        }, {});

        const formattedComics = latestComics.map((comic) => {
            const latestChapter = chapterMap[comic._id] || null;

            return {
                _id: comic._id,
                TenBo: comic.tenbo,
                AnhBia: comic.poster,
                TtPemium: comic.premium,
                latestChapter: latestChapter ?
                    {
                        SttChap: latestChapter.stt_chap,
                        TenChap: latestChapter.ten_chap,
                        ThoiGian: calculateTimeAgo(latestChapter.thoi_gian),
                    } :
                    null, // Nếu không có chương mới nhất, trả về null
            };
        });

        res.status(200).json(formattedComics);
    } catch (error) {
        console.error('Error fetching latest comics:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách truyện mới cập nhật'
        });
    }
});



// Lấy danh sách truyện mới cập nhật
router.get('/listlatest', async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        // Lấy danh sách truyện mới nhất theo phân trang
        const latestComics = await BoTruyen.find({
            active: true
        })
            .sort({
                updatedAt: -1
            })
            .skip(skip)
            .limit(parseInt(limit))
            .select('tenbo poster premium updatedAt')
            .lean();

        // Tổng số lượng truyện
        const totalCount = await BoTruyen.countDocuments({
            active: true
        });

        // Lấy chương mới nhất cho từng truyện
        const comicIds = latestComics.map((comic) => comic._id);
        const latestChapters = await Chapter.aggregate([
            {
                $match: {
                    id_bo: { $in: comicIds },
                    active: true
                }
            },
            {
                $sort: { thoi_gian: -1 }
            },
            {
                $group: {
                    _id: '$id_bo',
                    latestChapter: { $first: '$$ROOT' }
                }
            }
        ]);

        // Ghép chương mới nhất vào danh sách truyện
        const chapterMap = latestChapters.reduce((map, chap) => {
            map[chap._id] = chap.latestChapter;
            return map;
        }, {});

        const formattedComics = latestComics.map((comic) => {
            const latestChapter = chapterMap[comic._id] || null;

            return {
                _id: comic._id,
                TenBo: comic.tenbo,
                AnhBia: comic.poster,
                TtPemium: comic.premium,
                latestChapter: latestChapter
                    ? {
                        SttChap: latestChapter.stt_chap,
                        TenChap: latestChapter.ten_chap,
                        ThoiGian: calculateTimeAgo(latestChapter.thoi_gian),
                    }
                    : null, // Nếu không có chương mới nhất, trả về null
            };
        });

        res.status(200).json({
            comics: formattedComics,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching latest comics:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách truyện mới cập nhật',
        });
    }
});


// Lấy danh sách truyện Trending
router.get('/trending', async (req, res) => {
    try {
        const {
            page = 1, limit = 12
        } = req.query;
        const skip = (page - 1) * limit;

        // Lấy danh sách truyện theo phân trang
        const trendingComics = await BoTruyen.find({
            active: true
        })
            .sort({
                TongLuotXem: -1
            })
            .skip(skip)
            .limit(parseInt(limit))
            .select('tenbo poster TongLuotXem TtPemium')
            .lean();

        // Tổng số lượng truyện
        const totalCount = await BoTruyen.countDocuments({
            active: true
        });

        const comicIds = trendingComics.map((comic) => comic._id);

        const latestChapters = await Chapter.aggregate([{
            $match: {
                id_bo: {
                    $in: comicIds
                },
                active: true
            }
        },
        {
            $sort: {
                thoi_gian: -1
            }
        },
        {
            $group: {
                _id: '$id_bo',
                latestChapter: {
                    $first: '$$ROOT'
                }
            }
        },
        ]);

        const chapterMap = latestChapters.reduce((map, chap) => {
            map[chap._id] = chap.latestChapter;
            return map;
        }, {});

        const formattedComics = trendingComics.map((comic) => ({
            _id: comic._id,
            TenBo: comic.tenbo,
            AnhBia: comic.poster,
            TongLuotXem: comic.TongLuotXem,
            TtPemium: comic.TtPemium,
            latestChapter: chapterMap[comic._id] ?
                {
                    SttChap: chapterMap[comic._id].stt_chap,
                    ThoiGian: chapterMap[comic._id].thoi_gian,
                } :
                null,
        }));

        res.status(200).json({
            comics: formattedComics,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching trending comics:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách truyện Trending'
        });
    }
});
router.get('/random', async (req, res) => {
    try {
        const randomComic = await BoTruyen.aggregate([
            { $match: { active: true } },
            { $sample: { size: 1 } }
        ]);

        if (randomComic.length > 0) {
            const comicId = randomComic[0]._id;
            res.status(200).json({ _id: comicId });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bộ truyện nào' });
        }
    } catch (error) {
        console.error('Error fetching random comic:', error);
        res.status(500).json({ message: 'Lỗi khi lấy bộ truyện ngẫu nhiên' });
    }
});



// lấy tất cả bộ truyện còn active 
router.get('/active', async (req, res) => {
    try {
        const activeBoTruyen = await BoTruyen.find({
            active: true
        })
            .populate('id_tg', 'ten')
            .sort({
                createdAt: -1
            });

        // console.log('Active BoTruyen:', activeBoTruyen);
        res.status(200).send(activeBoTruyen);
    } catch (error) {
        console.error('Error fetching active Bo Truyen:', error);
        res.status(500).send({
            message: 'Failed to fetch active Bo Truyen'
        });
    }
});

// API: Lấy danh sách truyện xếp hạng theo tiêu chí
router.get('/rankings', async (req, res) => {
    const { type } = req.query;

    try {
        let sortCriteria = {};
        let filterCriteria = { active: true };

        // Xác định tiêu chí sắp xếp và lọc
        switch (type) {
            case "1": // Lượt đọc cao nhất
                sortCriteria = { TongLuotXem: -1 };
                break;

            case "2": // Lượt theo dõi cao nhất
                sortCriteria = { theodoi: -1 };
                break;

            case "3": // Đánh giá cao nhất
                sortCriteria = { danhgia: -1 };
                break;

            case "4": // Cập nhật hôm nay
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                filterCriteria.updatedAt = { $gte: today };
                sortCriteria = { updatedAt: -1 };
                break;

            case "5": // Cập nhật trong tháng này
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                filterCriteria.updatedAt = { $gte: oneMonthAgo };
                sortCriteria = { TongLuotXem: -1 };
                break;

            default:
                return res.status(400).json({ message: 'Invalid type parameter. Accepted values: 1, 2, 3, 4, 5' });
        }

        // Tìm danh sách bộ truyện theo tiêu chí
        const rankings = await BoTruyen.find(filterCriteria)
            .sort(sortCriteria)
            .limit(10)
            .populate('listloai', 'ten_loai') // Populate danh sách loại truyện
            .select('tenbo TongLuotXem theodoi danhgia poster banner updatedAt listloai')
            .lean();

        // Kiểm tra nếu không có truyện nào
        if (!rankings || rankings.length === 0) {
            return res.status(200).json([]); // Trả về mảng rỗng
        }

        // Lấy danh sách ID của các truyện
        const comicIds = rankings.map((comic) => comic._id);

        // Lấy chương mới nhất cho từng truyện
        const latestChapters = await Chapter.aggregate([
            {
                $match: {
                    id_bo: { $in: comicIds },
                    active: true,
                },
            },
            {
                $sort: { thoi_gian: -1 },
            },
            {
                $group: {
                    _id: '$id_bo',
                    latestChapter: { $first: '$$ROOT' },
                },
            },
        ]);

        // Kiểm tra nếu không có chương nào
        const chapterMap = latestChapters.reduce((map, chap) => {
            map[chap._id] = chap.latestChapter;
            return map;
        }, {});

        // Ghép chương mới nhất vào danh sách truyện
        const formattedRankings = rankings.map((comic) => {
            const latestChapter = chapterMap[comic._id] || null;

            return {
                _id: comic._id,
                TenBo: comic.tenbo,
                TongLuotXem: comic.TongLuotXem,
                theodoi: comic.theodoi,
                danhgia: comic.danhgia,
                poster: comic.poster,
                banner: comic.banner,
                updatedAt: comic.updatedAt,
                listLoai: Array.isArray(comic.listloai)
                    ? comic.listloai.map((loai) => loai.ten_loai)
                    : [],
                latestChapter: latestChapter
                    ? {
                        SttChap: latestChapter.stt_chap,
                        TenChap: latestChapter.ten_chap,
                        ThoiGian: calculateTimeAgo(latestChapter.thoi_gian),
                    }
                    : null,
            };
        });

        res.status(200).json(formattedRankings);
    } catch (error) {
        console.error('Error fetching rankings:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách xếp hạng',
        });
    }
});

router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    try {
        const results = await BoTruyen.find({
            tenbo: { $regex: new RegExp(query, 'i') },
            active: true
        }).select('tenbo TongLuotXem poster _id').limit(10);

        const formattedResults = results.map(boTruyen => ({
            id: boTruyen._id,
            img: boTruyen.poster,
            tenBo: boTruyen.tenbo,
            view: boTruyen.TongLuotXem
        }));

        res.json(formattedResults);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error fetching search results' });
    }
});

router.get("/search-advanced", async (req, res) => {
    try {
        const { query, trangthai, loaiTruyenId } = req.query;

        let filter = { active: true };

        if (query) {
            filter.tenbo = { $regex: new RegExp(query, "i") };
        }
        if (trangthai) {
            filter.trangthai = trangthai;
        }
        if (loaiTruyenId) {
            filter.listloai = loaiTruyenId;
        }

        const results = await BoTruyen.find(filter)
            .select("tenbo poster TongLuotXem")
            .limit(20);

        res.status(200).json(results);
    } catch (error) {
        console.error("Advanced search error:", error);
        res.status(500).json({ message: "Lỗi khi tìm kiếm nâng cao" });
    }
});

router.post("/check-premium-access", async (req, res) => {
    try {
        const { userId, chapterId, isPremium, tickets, ticketCost } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
        }

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: "Không tìm thấy chương truyện" });
        }

        if (isPremium || tickets >= ticketCost) {
            if (!isPremium) {
                // Trừ vé của người dùng
                await User.findByIdAndUpdate(userId, {
                    $inc: { tickets: -ticketCost },
                });
            }
            return res.status(200).json({ message: "Quyền truy cập được cấp" });
        }

        res.status(403).json({
            message: "Không đủ điều kiện để truy cập chương truyện. Mua thêm vé hoặc nâng cấp Premium.",
        });
    } catch (error) {
        console.error("Error checking premium access:", error);
        res.status(500).json({ message: "Lỗi khi kiểm tra quyền truy cập" });
    }
});

router.post("/:id/increase-view", async (req, res) => {
    const { id } = req.params;

    try {
        const chapter = await Chapter.findByIdAndUpdate(
            id,
            { $inc: { luotxem: 1 } }, // Tăng lượt xem chương
            { new: true }
        );

        if (!chapter) {
            return res.status(404).json({ message: "Không tìm thấy chương" });
        }

        // Tăng tổng lượt xem cho bộ truyện
        await BoTruyen.findByIdAndUpdate(chapter.id_bo, {
            $inc: { TongLuotXem: 1 },
        });

        res.status(200).json({
            message: "Tăng lượt xem thành công",
            luotxem: chapter.luotxem,
        });
    } catch (error) {
        console.error("Error increasing chapter views:", error);
        res.status(500).json({ message: "Lỗi khi tăng lượt xem" });
    }
});


// Lấy chi tiết bộ truyện
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const boTruyen = await BoTruyen.findById(id)
            .populate("id_tg", "ten_tg")
            .populate("listloai", "ten_loai");

        if (!boTruyen) {
            return res.status(404).json({ message: "Không tìm thấy bộ truyện" });
        }
        // Lấy danh sách chương liên quan
        const chapters = await Chapter.find({ id_bo: id, active: true })
            .sort({ stt_chap: 1 }) // Sắp xếp theo thứ tự chương
            .select("stt_chap ten_chap thoi_gian ticket_cost premium");

        // Lấy chương mới nhất
        const latestChapter = await Chapter.findOne({ id_bo: id, active: true })
            .sort({ thoi_gian: -1 }) // Lấy chương mới nhất
            .select("stt_chap ten_chap thoi_gian");

        // Định dạng thông tin chương mới nhất
        const latestChapterInfo = latestChapter
            ? {
                SttChap: latestChapter.stt_chap,
                TenChap: latestChapter.ten_chap,
                ThoiGian: calculateTimeAgo(latestChapter.thoi_gian),
            }
            : null;

        // Lấy các bộ truyện tương tự
        const similarComics = await BoTruyen.find({
            listloai: { $in: boTruyen.listloai },
            _id: { $ne: id },
            active: true,
        })
            .limit(6)
            .select("tenbo poster");

        res.status(200).json({
            ...boTruyen.toObject(),
            tacgia: boTruyen.id_tg ? boTruyen.id_tg.ten_tg : null,
            chapters,
            similarComics,
            latestChapter: latestChapterInfo,
        });
    } catch (error) {
        console.error("Error fetching Bo Truyen by ID:", error);
        res.status(500).json({ message: "Lỗi khi lấy thông tin bộ truyện" });
    }
});
router.post("/save-history/:comicId", async (req, res) => {
    try {
        const { comicId } = req.params; // Lấy ID bộ truyện từ params
        const { userId, latestChapter } = req.body; // Lấy thông tin user và lịch sử đọc mới nhất từ body

        // Kiểm tra dữ liệu
        if (!userId || !comicId) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        // Tìm hoặc tạo mới CTBoTruyen
        let ctBoTruyen = await CTBoTruyen.findOne({ user: userId, bo_truyen: comicId });

        if (!ctBoTruyen) {
            ctBoTruyen = new CTBoTruyen({
                user: userId, // Lưu IdUser của KhachHang
                bo_truyen: comicId,
                ls_moi: latestChapter || null,
            });
        } else {
            ctBoTruyen.ls_moi = latestChapter || ctBoTruyen.ls_moi;
        }

        await ctBoTruyen.save();

        res.status(200).json({ message: "Lịch sử đọc đã được lưu thành công", ctBoTruyen });
    } catch (error) {
        console.error("Error saving history:", error);
        res.status(500).json({ message: "Lỗi khi lưu lịch sử đọc" });
    }
});


// API: Theo dõi bộ truyện
router.post("/follow/:comicId", async (req, res) => {
    try {
        const { comicId } = req.params;
        const { userId } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !comicId) {
            return res.status(400).json({ message: "Thiếu thông tin userId hoặc comicId" });
        }
        // Tìm hoặc tạo mới CTBoTruyen
        let ctBoTruyen = await CTBoTruyen.findOne({ user: userId, bo_truyen: comicId });

        if (!ctBoTruyen) {
            ctBoTruyen = new CTBoTruyen({
                user: userId,
                bo_truyen: comicId,
                theodoi: true,
            });
            await BoTruyen.findByIdAndUpdate(
                comicId,
                { $inc: { theodoi: 1 } },
                { new: true }
            );
        } else {
            ctBoTruyen.theodoi = true;
            await ctBoTruyen.save();
            await BoTruyen.findByIdAndUpdate(
                comicId,
                { $inc: { theodoi: 1 } },
                { new: true }
            );

        }

        // Lưu thông tin vào database
        await ctBoTruyen.save();

        res.status(200).json({ success: true, message: "Đã theo dõi bộ truyện thành công", data: ctBoTruyen });
    } catch (error) {
        console.error("Error following BoTruyen:", error);
        res.status(500).json({ success: false, message: "Lỗi khi theo dõi bộ truyện" });
    }
});
// API: Hủy theo dõi bộ truyện
router.post("/unfollow/:comicId", async (req, res) => {
    try {
        const { comicId } = req.params; // Lấy comicId từ params
        const { userId } = req.body;   // Lấy userId từ body

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !comicId) {
            return res.status(400).json({ message: "Thiếu thông tin userId hoặc comicId" });
        }

        // Tìm CTBoTruyen dựa trên userId và comicId
        let ctBoTruyen = await CTBoTruyen.findOne({ user: userId, bo_truyen: comicId });

        if (!ctBoTruyen || !ctBoTruyen.theodoi) {
            // Nếu không tìm thấy bản ghi hoặc theodoi đã là false
            return res.status(404).json({ message: "Không tìm thấy bản ghi đang theo dõi" });
        }

        // Cập nhật theodoi = false trong CTBoTruyen
        ctBoTruyen.theodoi = false;
        await ctBoTruyen.save();

        // Giảm lượt theo dõi trong BoTruyen
        await BoTruyen.findByIdAndUpdate(
            comicId,
            { $inc: { theodoi: -1 } }, // Giảm theodoi đi 1
            { new: true }
        );

        res.status(200).json({ success: true, message: "Đã hủy theo dõi bộ truyện thành công", data: ctBoTruyen });
    } catch (error) {
        console.error("Error unfollowing BoTruyen:", error);
        res.status(500).json({ success: false, message: "Lỗi khi hủy theo dõi bộ truyện" });
    }
});

// API: Tìm CTBoTruyen dựa vào comicId và userId
router.get("/find/:comicId", async (req, res) => {
    try {
        const { comicId } = req.params;
        const { userId } = req.query;

        // Kiểm tra dữ liệu đầu vào
        if (!userId || !comicId) {
            return res.status(400).json({ message: "Thiếu thông tin userId hoặc comicId" });
        }

        // Tìm CTBoTruyen dựa vào userId và comicId
        const ctBoTruyen = await CTBoTruyen.findOne({ user: userId, bo_truyen: comicId });

        if (!ctBoTruyen) {
            // Nếu không tìm thấy bản ghi, trả về lỗi
            return res.status(404).json({ message: "Không tìm thấy CTBoTruyen cho bộ truyện và người dùng này" });
        }

        // Trả về kết quả nếu tìm thấy
        res.status(200).json({ success: true, data: ctBoTruyen });
    } catch (error) {
        console.error("Error fetching CTBoTruyen:", error);
        res.status(500).json({ success: false, message: "Lỗi khi tìm kiếm CTBoTruyen" });
    }
});

// API: Kiểm tra quyền truy cập chương Premium
router.post("/check-access", async (req, res) => {
    try {
        const { chapterId, userId, isPremium, tickets, ticketCost } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
        }

        if (!isPremium && tickets < ticketCost) {
            return res.status(403).json({
                message: "Bạn cần đăng ký Premium hoặc mua thêm vé để truy cập nội dung này",
            });
        }

        const chapter = await Chapter.findById(chapterId);

        if (!chapter) {
            return res.status(404).json({ message: "Không tìm thấy chương truyện" });
        }

        res.status(200).json({ message: "Truy cập thành công", chapter });
    } catch (error) {
        console.error("Error checking access:", error);
        res.status(500).json({ message: "Lỗi khi kiểm tra quyền truy cập" });
    }
});

//Tìm kiếm bộ truyện theo tên
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" });
        }

        const results = await BoTruyen.find({
            tenbo: { $regex: new RegExp(query, "i") },
            active: true,
        })
            .limit(10)
            .select("tenbo poster TongLuotXem");

        res.status(200).json(results);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Lỗi khi tìm kiếm bộ truyện" });
    }
});


//Lọc bộ truyện theo trạng thái
router.get("/filter", async (req, res) => {
    try {
        const { trangthai } = req.query;

        const results = await BoTruyen.find({
            trangthai,
            active: true,
        }).select("tenbo poster TongLuotXem");

        res.status(200).json(results);
    } catch (error) {
        console.error("Filter error:", error);
        res.status(500).json({ message: "Lỗi khi lọc bộ truyện" });
    }
});
// Danh sách chương của một bộ truyện
router.get("/:id/chapters", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const chapters = await Chapter.find({ id_bo: id, active: true })
            .sort({ stt_chap: 1 })
            .select("stt_chap ten_chap thoi_gian ticket_cost luotxem premium");

        if (!chapters || chapters.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(chapters);
    } catch (error) {
        console.error("Error fetching chapters:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách chương" });
    }
});
module.exports = router;


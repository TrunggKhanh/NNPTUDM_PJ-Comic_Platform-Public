const LoaiTruyen = require("../../model/loaitruyen.model");
const BoTruyen = require("../../model/botruyen.model");


exports.getAllLoaiTruyen = async (req, res) => {
  try {
    const { active, name } = req.query;
    const filter = {};
    if (active !== undefined) filter.active = active === 'true';
    if (name) filter.ten_loai = { $regex: name, $options: 'i' };

    const loaiTruyenList = await LoaiTruyen.aggregate([
      { $match: filter }, // Áp dụng bộ lọc
      {
        $lookup: {
          from: "botruyens", // Tên collection trong MongoDB (phải khớp với tên trong database)
          localField: "_id",
          foreignField: "listloai", // Liên kết với trường listloai trong BoTruyen
          as: "truyenList", // Đặt tên cho mảng chứa dữ liệu liên kết
        },
      },
      {
        $addFields: {
          soLuongTruyen: { $size: "$truyenList" }, // Tính tổng số bộ truyện liên quan
        },
      },
      {
        $project: {
          ten_loai: 1,
          active: 1,
          soLuongTruyen: 1, // Chỉ giữ lại các trường cần thiết
        },
      },
    ]);

    res.status(200).json(loaiTruyenList);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Error fetching genres" });
  }
};

// Thêm mới thể loại
exports.addLoaiTruyen = async (req, res) => {
  try {
    const { ten_loai } = req.body;
    if (!ten_loai) {
      return res.status(400).json({ message: "Tên thể loại không được để trống" });
    }

    const newGenre = new LoaiTruyen({ ten_loai });
    await newGenre.save();
    res.status(201).json({ message: "Thể loại được thêm thành công", genre: newGenre });
  } catch (error) {
    console.error('Error adding genre:', error);
    res.status(500).json({ message: 'Error adding genre' });
  }
};

// Cập nhật thể loại
exports.updateLoaiTruyen = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedGenre = await LoaiTruyen.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedGenre) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }

    res.status(200).json({ message: "Cập nhật thể loại thành công", genre: updatedGenre });
  } catch (error) {
    console.error('Error updating genre:', error);
    res.status(500).json({ message: 'Error updating genre' });
  }
};

exports.deleteGenre = async (req, res) => {
  const { genreId } = req.params;

  try {
    // Tìm thể loại với thông tin liên kết bộ truyện
    const genres = await LoaiTruyen.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(genreId) } }, // Tìm thể loại theo ID
      {
        $lookup: {
          from: "botruyens", // Tên collection bộ truyện
          localField: "_id",
          foreignField: "listloai", // Liên kết với trường listloai trong BoTruyen
          as: "relatedComics", // Đặt tên cho mảng liên kết
        },
      },
      {
        $addFields: {
          totalComics: { $size: "$relatedComics" }, // Tính số lượng bộ truyện liên quan
        },
      },
      {
        $project: {
          ten_loai: 1,
          totalComics: 1, // Chỉ giữ các trường cần thiết
        },
      },
    ]);

    // Kiểm tra nếu thể loại không tồn tại
    if (!genres.length) {
      return res.status(404).json({ message: "Thể loại không tồn tại." });
    }

    const genre = genres[0];

    // Nếu thể loại có liên kết với bộ truyện, trả về lỗi
    if (genre.totalComics > 0) {
      return res.status(400).json({
        message: "Không thể xóa thể loại vì vẫn còn truyện liên quan.",
        totalComics: genre.totalComics,
        genreDetailUrl: `/manager/comic/gerne-index/genre-detail/${genreId}`,
      });
    }

    // Xóa thể loại nếu không có liên kết
    await LoaiTruyen.findByIdAndDelete(genreId);
    res.status(200).json({ message: "Xóa thể loại thành công." });
  } catch (error) {
    console.error("Error deleting genre:", error);
    res.status(500).json({ message: "Lỗi khi xóa thể loại." });
  }
};



// Thay đổi trạng thái active của thể loại
exports.toggleActiveLoaiTruyen = async (req, res) => {
  try {
    const { id } = req.params;

    const genre = await LoaiTruyen.findById(id);
    if (!genre) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }

    genre.active = !genre.active;
    await genre.save();
    res.status(200).json({ message: "Cập nhật trạng thái thành công", genre });
  } catch (error) {
    console.error('Error toggling genre status:', error);
    res.status(500).json({ message: 'Error toggling genre status' });
  }
};

exports.getTopComicsByGenre = async (req, res) => {
  try {
    const { genreId } = req.params; // ID của thể loại

    // Kiểm tra thể loại có tồn tại hay không
    const genre = await LoaiTruyen.findById(genreId);
    if (!genre) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }

    // Lấy top 5 bộ truyện hot nhất theo thể loại
    const topComics = await BoTruyen.find({ listloai: genreId, active: true })
      .sort({ theodoi: -1, TongLuotXem: -1 }) // Ưu tiên theo lượt theo dõi, sau đó lượt xem
      .limit(5)
      .select("tenbo poster TongLuotXem theodoi"); // Chỉ chọn các trường cần thiết

    res.status(200).json({
      message: `Top 5 bộ truyện hot nhất của thể loại: ${genre.ten_loai}`,
      data: topComics,
    });
  } catch (error) {
    console.error("Error fetching top comics by genre:", error);
    res.status(500).json({ message: "Error fetching top comics by genre" });
  }
};
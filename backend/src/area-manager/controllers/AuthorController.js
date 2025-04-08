const TacGia = require("../../model/tacgia.model");
const BoTruyen = require('../../model/botruyen.model'); 

// Lấy danh sách tác giả
exports.getAllTacGia = async (req, res) => {
  try {
    const { active, name } = req.query;
    const filter = {};
    if (active !== undefined) filter.active = active === "true";
    if (name) filter.ten_tg = { $regex: name, $options: "i" };

    // Lấy danh sách tác giả
    const tacGiaList = await TacGia.find(filter).lean(); // Lấy dữ liệu tác giả

    // Lấy danh sách bộ truyện cho từng tác giả
    const tacGiaWithTruyen = await Promise.all(
      tacGiaList.map(async (tacGia) => {
        // Lấy danh sách bộ truyện liên quan đến tác giả
        const truyenList = await BoTruyen.find({ id_tg: tacGia._id });

        // Tính toán số lượng truyện
        const soLuongTruyen = truyenList.length;
        const soTruyenHoatDong = truyenList.filter((truyen) => truyen.active).length;
        const soTruyenTamNgung = soLuongTruyen - soTruyenHoatDong;

        // Trả về dữ liệu đã tính toán
        return {
          ...tacGia,
          soLuongTruyen,
          soTruyenHoatDong,
          soTruyenTamNgung,
        };
      })
    );

    res.status(200).json(tacGiaWithTruyen);
  } catch (error) {
    console.error("Error fetching authors with comics:", error);
    res.status(500).json({ message: "Error fetching authors with comics" });
  }
};



// Thêm mới tác giả
exports.addTacGia = async (req, res) => {
  try {
    const { ten_tg } = req.body;
    if (!ten_tg) return res.status(400).json({ message: "Tên tác giả không được để trống" });

    const newTacGia = new TacGia({ ten_tg });
    await newTacGia.save();
    res.status(201).json({ message: "Tác giả được thêm thành công", tacGia: newTacGia });
  } catch (error) {
    console.error("Error adding author:", error);
    res.status(500).json({ message: "Error adding author" });
  }
};

// Cập nhật tác giả
exports.updateTacGia = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTacGia = await TacGia.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedTacGia) return res.status(404).json({ message: "Tác giả không tồn tại" });

    res.status(200).json({ message: "Cập nhật tác giả thành công", tacGia: updatedTacGia });
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ message: "Error updating author" });
  }
};

// Xóa tác giả
exports.deleteTacGia = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTacGia = await TacGia.findByIdAndDelete(id);
    if (!deletedTacGia) return res.status(404).json({ message: "Tác giả không tồn tại" });

    res.status(200).json({ message: "Xóa tác giả thành công" });
  } catch (error) {
    console.error("Error deleting author:", error);
    res.status(500).json({ message: "Error deleting author" });
  }
};

// Kích hoạt / Vô hiệu hóa tác giả
exports.toggleActiveTacGia = async (req, res) => {
  try {
    const { id } = req.params;
    const tacGia = await TacGia.findById(id);
    if (!tacGia) return res.status(404).json({ message: "Tác giả không tồn tại" });

    tacGia.active = !tacGia.active;
    await tacGia.save();
    res.status(200).json({ message: "Cập nhật trạng thái thành công", tacGia });
  } catch (error) {
    console.error("Error toggling author status:", error);
    res.status(500).json({ message: "Error toggling author status" });
  }
};

exports.getTopComicsByAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const topComics = await BoTruyen.find({ id_tg: id })
      .sort({ danhgia: -1 }) // Sắp xếp theo đánh giá cao nhất
      .limit(5); // Giới hạn số lượng truyện
    res.status(200).json(topComics);
  } catch (error) {
    console.error("Error fetching top comics:", error);
    res.status(500).json({ message: "Không thể tải danh sách truyện hot" });
  }
};


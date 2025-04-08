const express = require('express');
const router = express.Router();
const Payment = require('../../model/Payments.model');

// Lấy danh sách thanh toán
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thanh toán." });
  }
});

router.get("/customer/:IdUser", async (req, res) => {
    const { IdUser } = req.params;
  
    try {
      console.log(`Fetching payments for customer: ${IdUser}`);
      const payments = await Payment.find({ IdUser }); // Truy vấn theo IdUser (String)
  
      if (!payments || payments.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy thanh toán nào" });
      }
  
      res.status(200).json(payments);
    } catch (error) {
      console.error(`Error fetching payments for customer ${IdUser}:`, error);
      res.status(500).json({ message: "Lỗi khi lấy danh sách thanh toán" });
    }
  });
  
  
  router.get('/group-by-method', async (req, res) => {
    try {
      const payments = await Payment.aggregate([
        { $group: { _id: '$PayMethod', total: { $sum: '$PayAmount' } } },
      ]);
      res.json(payments.map((item) => ({ method: item._id, total: item.total })));
    } catch (error) {
      console.error('Error grouping payments by method:', error);
      res.status(500).send('Error grouping payments by method');
    }
  });
  
  router.get('/group-by-date', async (req, res) => {
    try {
      const payments = await Payment.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$PayDate' } },
            total: { $sum: '$PayAmount' },
          },
        },
      ]);
      res.json(payments.map((item) => ({ date: item._id, total: item.total })));
    } catch (error) {
      console.error('Error grouping payments by date:', error);
      res.status(500).send('Error grouping payments by date');
    }
  });
  
  



module.exports = router;

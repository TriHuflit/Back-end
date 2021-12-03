const express=require('express');
const router =express.Router();
const voucher=require('../controllers/VoucherController');


router.post('/add',voucher.addVoucher);

router.put('/update/:id',voucher.UpdateVoucher);


module.exports=router;
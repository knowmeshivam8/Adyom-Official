const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllGallery, getGalleryById, createGallery, updateGallery, deleteGallery, uploadGalleryImage } = require('../controllers/galleryController');
const { upload } = require('../config/cloudinary');

router.get('/', getAllGallery);
router.get('/:id', getGalleryById);
router.post('/', protect, authorize('admin'), createGallery);
router.put('/:id', protect, authorize('admin'), updateGallery);
router.delete('/:id', protect, authorize('admin'), deleteGallery);
router.post('/upload', protect, authorize('admin'), upload.single('file'), uploadGalleryImage);

module.exports = router;
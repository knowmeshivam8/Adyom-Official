const Gallery = require('../models/Gallery');
const { upload } = require('../config/cloudinary');

exports.getAllGallery = async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const query = { isPublished: true };
        if (category) query.category = category;

        const total = await Gallery.countDocuments(query);
        const gallery = await Gallery.find(query)
            .populate('uploadedBy', 'name avatar')
            .sort({ featured: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: gallery,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getGalleryById = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id).populate('uploadedBy', 'name avatar');
        if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found' });
        res.json({ success: true, data: gallery });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createGallery = async (req, res) => {
    try {
        req.body.uploadedBy = req.user._id;
        const gallery = await Gallery.create(req.body);
        res.status(201).json({ success: true, data: gallery });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found' });
        res.json({ success: true, data: gallery });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteGallery = async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndDelete(req.params.id);
        if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found' });
        res.json({ success: true, message: 'Gallery deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadGalleryImage = async (req, res) => {
    try {
        const result = req.file;
        res.json({ success: true, data: { url: result.path, publicId: result.filename } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
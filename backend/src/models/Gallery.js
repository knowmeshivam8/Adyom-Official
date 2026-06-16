const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    images: [{
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        alt: { type: String, default: '' }
    }],
    category: {
        type: String,
        enum: ['student-artwork', 'folk-art', 'community-projects', 'workshops', 'events', 'artisan-work'],
        default: 'student-artwork'
    },
    tags: [{
        type: String
    }],
    featured: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', GallerySchema);
import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    withCredentials: false,
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('adyom_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses - clear token and redirect to login
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adyom_token');
            localStorage.removeItem('adyom_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    getMe: () => API.get('/auth/me'),
    updateProfile: (data) => API.put('/auth/profile', data),
    changePassword: (data) => API.put('/auth/change-password', data),
};

// Users API
export const userAPI = {
    getAll: (params) => API.get('/users', { params }),
    getById: (id) => API.get(`/users/${id}`),
    updateRole: (id, data) => API.put(`/users/${id}/role`, data),
    toggleStatus: (id) => API.put(`/users/${id}/toggle-status`),
    delete: (id) => API.delete(`/users/${id}`),
    enrollProgram: (data) => API.post(`/users/enroll`, data),
    getMyPrograms: () => API.get('/users/my-programs'),
    getStats: () => API.get('/users/stats'),
};

// Programs API
export const programAPI = {
    getAll: (params) => API.get('/programs', { params }),
    getBySlug: (slug) => API.get(`/programs/slug/${slug}`),
    getById: (id) => API.get(`/programs/id/${id}`),
    create: (data) => API.post('/programs', data),
    update: (id, data) => API.put(`/programs/${id}`, data),
    delete: (id) => API.delete(`/programs/${id}`),
    getFeatured: () => API.get('/programs/featured'),
    // Module management
    getActiveModules: (id) => API.get(`/programs/${id}/modules/active`),
    getModuleDetail: (id, moduleId) => API.get(`/programs/${id}/modules/${moduleId}`),
    addModule: (id, data) => API.post(`/programs/${id}/modules`, data),
    updateModule: (id, moduleId, data) => API.put(`/programs/${id}/modules/${moduleId}`, data),
    deleteModule: (id, moduleId) => API.delete(`/programs/${id}/modules/${moduleId}`),
    toggleModuleActive: (id, moduleId) => API.put(`/programs/${id}/modules/${moduleId}/toggle-active`),
    toggleModuleLock: (id, moduleId) => API.put(`/programs/${id}/modules/${moduleId}/toggle-lock`),
    addLiveRecording: (id, moduleId, data) => API.post(`/programs/${id}/modules/${moduleId}/live-recordings`, data),
    addSession: (id, moduleId, data) => API.post(`/programs/${id}/modules/${moduleId}/sessions`, data),
};

// Blog API
export const blogAPI = {
    getAll: (params) => API.get('/blog', { params }),
    getBySlug: (slug) => API.get(`/blog/${slug}`),
    create: (data) => API.post('/blog', data),
    createWithImage: (formData) =>
        API.post('/blog', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, data) => API.put(`/blog/${id}`, data),
    updateWithImage: (id, formData) =>
        API.put(`/blog/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => API.delete(`/blog/${id}`),
    like: (id) => API.post(`/blog/${id}/like`),
    comment: (id, data) => API.post(`/blog/${id}/comment`, data),
};

// Gallery API
export const galleryAPI = {
    getAll: (params) => API.get('/gallery', { params }),
    getAllAdmin: () => API.get('/gallery/admin/all'),
    getById: (id) => API.get(`/gallery/${id}`),
    create: (data) => API.post('/gallery', data),
    update: (id, data) => API.put(`/gallery/${id}`, data),
    delete: (id) => API.delete(`/gallery/${id}`),
    uploadImage: (data) => API.post('/gallery/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Artwork API
export const artworkAPI = {
    submit: (data) => API.post('/artworks', data),
    adminCreate: (formData) =>
        API.post('/artworks/admin', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getMine: () => API.get('/artworks/my'),
    getPublic: (params) => API.get('/artworks/public', { params }),
    getAllAdmin: (params) => API.get('/artworks/admin', { params }),
    approve: (id) => API.put(`/artworks/${id}/approve`),
    reject: (id, data) => API.put(`/artworks/${id}/reject`, data),
    delete: (id) => API.delete(`/artworks/${id}`),
    like: (id) => API.post(`/artworks/${id}/like`),
    toggleInnovative: (id) => API.put(`/artworks/${id}/innovative`),
};

// Video API
export const videoAPI = {
    submit: (data) => API.post('/videos', data),
    getMine: () => API.get('/videos/my'),
    getPublic: (params) => API.get('/videos/public', { params }),
    getById: (id) => API.get(`/videos/${id}`),
    getAllAdmin: (params) => API.get('/videos/admin', { params }),
    approve: (id) => API.put(`/videos/${id}/approve`),
    reject: (id, data) => API.put(`/videos/${id}/reject`, data),
    delete: (id) => API.delete(`/videos/${id}`),
};

// Testimonials API
export const testimonialAPI = {
    getPublic: (params) => API.get('/testimonials', { params }),
    getAllAdmin: (params) => API.get('/testimonials/admin', { params }),
    create: (data) => API.post('/testimonials', data),
    update: (id, data) => API.put(`/testimonials/${id}`, data),
    delete: (id) => API.delete(`/testimonials/${id}`),
};

// Contact API
export const contactAPI = {
    submit: (data) => API.post('/contact', data),
    getAllAdmin: (params) => API.get('/contact', { params }),
    updateStatus: (id, data) => API.put(`/contact/${id}`, data),
    delete: (id) => API.delete(`/contact/${id}`),
};

// Corporate API
export const corporateAPI = {
    submit: (data) => API.post('/corporate', data),
    getAllAdmin: (params) => API.get('/corporate', { params }),
    getById: (id) => API.get(`/corporate/${id}`),
    updateStatus: (id, data) => API.put(`/corporate/${id}`, data),
    delete: (id) => API.delete(`/corporate/${id}`),
};

// Events API
export const eventAPI = {
    getPublic: (params) => API.get('/events', { params }),
    getAllAdmin: (params) => API.get('/events/admin', { params }),
    getById: (id) => API.get(`/events/${id}`),
    create: (data) => API.post('/events', data),
    update: (id, data) => API.put(`/events/${id}`, data),
    delete: (id) => API.delete(`/events/${id}`),
    register: (id) => API.post(`/events/${id}/register`),
};

// Certificates API
export const certificateAPI = {
    getMine: () => API.get('/certificates/my'),
    getAllAdmin: (params) => API.get('/certificates/admin', { params }),
    issue: (data) => API.post('/certificates', data),
    issueCompletion: (data) => API.post('/certificates/completion', data),
    issueExcellence: (data) => API.post('/certificates/excellence', data),
    issueAward: (data) => API.post('/certificates/award', data),
    getEligibility: (programId) => API.get(`/certificates/eligibility/${programId}`),
    verify: (number) => API.get(`/certificates/verify/${number}`),
    delete: (id) => API.delete(`/certificates/${id}`),
};

// Community API
export const communityAPI = {
    getPublic: (params) => API.get('/community', { params }),
    create: (data) => API.post('/community', data),
    getMine: () => API.get('/community/my'),
    getAllAdmin: (params) => API.get('/community/admin', { params }),
    approve: (id) => API.put(`/community/${id}/approve`),
    reject: (id, data) => API.put(`/community/${id}/reject`, data),
    delete: (id) => API.delete(`/community/${id}`),
    like: (id) => API.post(`/community/${id}/like`),
    comment: (id, data) => API.post(`/community/${id}/comment`, data),
    meetJoin: (data) => API.post('/community/meet-join', data),
    meetLeave: (data) => API.post('/community/meet-leave', data),
    getMeetAttendees: (meetId) => API.get(`/community/meet-attendees/${meetId}`),
    getMeetStats: (params) => API.get('/community/meet-stats', { params }),
};

// Learning API
export const learningAPI = {
    getAll: (params) => API.get('/learning', { params }),
    getById: (id) => API.get(`/learning/${id}`),
    getAllAdmin: (params) => API.get('/learning/admin', { params }),
    create: (data) => API.post('/learning', data),
    update: (id, data) => API.put(`/learning/${id}`, data),
    delete: (id) => API.delete(`/learning/${id}`),
    like: (id) => API.post(`/learning/${id}/like`),
    markVideoProgress: (data) => API.post('/learning/video-progress', data),
    getVideoProgress: (programId) => API.get(`/learning/video-progress/${programId}`),
    // Module assignment submissions
    submitModuleAssignment: (data) => API.post('/learning/module-submission', data),
    getModuleSubmissions: (programId) => API.get(`/learning/module-submissions/${programId}`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => API.get('/dashboard/stats'),
    markAttendance: (data) => API.post('/dashboard/attendance', data),
    getAttendance: (programId) => API.get(`/dashboard/attendance/${programId}`),
    getLeaderboard: (params) => API.get('/dashboard/leaderboard', { params }),
    getTopSubmitters: (params) => API.get('/dashboard/top-submitters', { params }),
    getMostInnovative: (params) => API.get('/dashboard/most-innovative', { params }),
};

// Sponsor Code API
export const sponsorAPI = {
    getAll: (params) => API.get('/sponsors', { params }),
    create: (data) => API.post('/sponsors', data),
    toggle: (id) => API.put(`/sponsors/${id}/toggle`),
    delete: (id) => API.delete(`/sponsors/${id}`),
    validate: (data) => API.post('/sponsors/validate', data),
    enroll: (data) => API.post('/sponsors/enroll', data),
};

// Product / KalaVritti Marketplace API
export const productAPI = {
    getAll: (params) => API.get('/products', { params }),
    getFeatured: () => API.get('/products/featured'),
    getBySlug: (slug) => API.get(`/products/slug/${slug}`),
    getAllAdmin: (params) => API.get('/products/admin', { params }),
    create: (data) => API.post('/products', data),
    update: (id, data) => API.put(`/products/${id}`, data),
    markAsSold: (id) => API.put(`/products/${id}/sold`),
    delete: (id) => API.delete(`/products/${id}`),
};

export default API;
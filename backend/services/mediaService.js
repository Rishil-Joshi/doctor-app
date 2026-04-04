const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');

const isDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

// ─── LOCAL STORAGE (dev) ──────────────────────────────────────────────────────

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const saveLocally = async (patientId, file, phase) => {
  const dir = path.join(UPLOADS_DIR, 'patients', String(patientId), phase || 'general');
  fs.mkdirSync(dir, { recursive: true });

  const ext = path.extname(file.originalname) || (file.mimetype.startsWith('video/') ? '.mp4' : '.jpg');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filepath = path.join(dir, filename);

  fs.writeFileSync(filepath, file.buffer);

  const url = `/uploads/patients/${patientId}/${phase || 'general'}/${filename}`;
  const publicId = `local:${filepath}`; // store full path so we can delete later
  return { url, publicId };
};

const deleteLocally = (publicId) => {
  const filepath = publicId.replace('local:', '');
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
};

// ─── CLOUDINARY STORAGE (production) ─────────────────────────────────────────

const uploadToCloudinary = (patientId, file, phase) => {
  const { cloudinary } = require('../config/cloudinary');
  const isVideo = file.mimetype.startsWith('video/');
  const folder = `surgiflow/patients/${patientId}/${phase || 'general'}`;

  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      ...(isVideo && {
        eager: [{ format: 'jpg', transformation: [{ width: 400, crop: 'scale' }] }],
        eager_async: false,
      }),
    };

    const stream = require('../config/cloudinary').cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      const thumbnailUrl = isVideo && result.eager?.[0]?.secure_url ? result.eager[0].secure_url : null;
      resolve({ url: result.secure_url, publicId: result.public_id, thumbnailUrl });
    });
    stream.end(file.buffer);
  });
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

const uploadMedia = async (patientId, file, imageType, phase) => {
  const isVideo = file.mimetype.startsWith('video/');
  let url, publicId, thumbnailUrl = null;

  if (isDev) {
    ({ url, publicId } = await saveLocally(patientId, file, phase));
    // For local video thumbnail: use same URL (browser can handle it)
    thumbnailUrl = isVideo ? url : null;
  } else {
    ({ url, publicId, thumbnailUrl } = await uploadToCloudinary(patientId, file, phase));
  }

  const { rows } = await pool.query(
    `INSERT INTO patient_media (patient_id, url, public_id, media_type, image_type, phase, thumbnail_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [patientId, url, publicId, isVideo ? 'video' : 'image', imageType || null, phase || null, thumbnailUrl]
  );
  return rows[0];
};

const getPatientMedia = async (patientId, { mediaType, phase } = {}) => {
  let query = `SELECT * FROM patient_media WHERE patient_id = $1`;
  const params = [patientId];

  if (mediaType) { params.push(mediaType); query += ` AND media_type = $${params.length}`; }
  if (phase) { params.push(phase); query += ` AND phase = $${params.length}`; }

  query += ` ORDER BY created_at ASC`;
  const { rows } = await pool.query(query, params);
  return rows;
};

const deleteMedia = async (mediaId, patientId) => {
  const { rows } = await pool.query(
    `SELECT * FROM patient_media WHERE id = $1 AND patient_id = $2`,
    [mediaId, patientId]
  );
  if (!rows[0]) throw new Error('Media not found');

  if (rows[0].public_id.startsWith('local:')) {
    deleteLocally(rows[0].public_id);
  } else {
    const { cloudinary } = require('../config/cloudinary');
    await cloudinary.uploader.destroy(rows[0].public_id, {
      resource_type: rows[0].media_type === 'video' ? 'video' : 'image',
    });
  }

  await pool.query(`DELETE FROM patient_media WHERE id = $1`, [mediaId]);
  return true;
};

module.exports = { uploadMedia, getPatientMedia, deleteMedia };

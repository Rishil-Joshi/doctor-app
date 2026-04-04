const { pool } = require('../config/database');
const { cloudinary } = require('../config/cloudinary');

/**
 * Upload a single image or video to Cloudinary and save record to DB
 */
const uploadMedia = async (patientId, file, imageType, phase) => {
  const isVideo = file.mimetype.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';
  const folder = `surgiflow/patients/${patientId}/${phase || 'general'}`;

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
    };

    // For videos, generate a thumbnail automatically
    if (isVideo) {
      uploadOptions.eager = [{ format: 'jpg', transformation: [{ width: 400, crop: 'scale' }] }];
      uploadOptions.eager_async = false;
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, async (error, result) => {
      if (error) return reject(error);
      try {
        const thumbnailUrl = isVideo && result.eager?.[0]?.secure_url
          ? result.eager[0].secure_url
          : null;

        const { rows } = await pool.query(
          `INSERT INTO patient_media (patient_id, url, public_id, media_type, image_type, phase, thumbnail_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            patientId,
            result.secure_url,
            result.public_id,
            isVideo ? 'video' : 'image',
            imageType || null,
            phase || null,
            thumbnailUrl,
          ]
        );
        resolve(rows[0]);
      } catch (dbErr) {
        reject(dbErr);
      }
    });

    stream.end(file.buffer);
  });
};

/**
 * Get all media for a patient, optionally filtered
 */
const getPatientMedia = async (patientId, { mediaType, phase } = {}) => {
  let query = `SELECT * FROM patient_media WHERE patient_id = $1`;
  const params = [patientId];

  if (mediaType) {
    params.push(mediaType);
    query += ` AND media_type = $${params.length}`;
  }
  if (phase) {
    params.push(phase);
    query += ` AND phase = $${params.length}`;
  }

  query += ` ORDER BY created_at ASC`;
  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Delete a media record from Cloudinary and DB
 */
const deleteMedia = async (mediaId, patientId) => {
  const { rows } = await pool.query(
    `SELECT * FROM patient_media WHERE id = $1 AND patient_id = $2`,
    [mediaId, patientId]
  );
  if (!rows[0]) throw new Error('Media not found');

  const isVideo = rows[0].media_type === 'video';
  await cloudinary.uploader.destroy(rows[0].public_id, {
    resource_type: isVideo ? 'video' : 'image',
  });
  await pool.query(`DELETE FROM patient_media WHERE id = $1`, [mediaId]);
  return true;
};

module.exports = { uploadMedia, getPatientMedia, deleteMedia };

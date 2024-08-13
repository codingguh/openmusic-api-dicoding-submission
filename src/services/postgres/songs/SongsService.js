const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');
const { mapDBSongToModel } = require('../../../utils');
const NotFoundError = require('../../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async _validateAlbumId(albumId) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
 
  async addSong({ title,year,genre,performer,duration,albumId }) {
    const id = 'song-' + nanoid(16);

    // Validate the albumId
    await this._validateAlbumId(albumId);
    
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year,genre,performer,duration,albumId],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
 
    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id,title,performer FROM songs');
    return result.rows.map(mapDBSongToModel);
  }


  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    console.log(result.rows.map(mapDBSongToModel)[0]);
    // return result.rows;
 
    return result.rows.map(mapDBSongToModel)[0];
  }

  async editSongById(id, { title,year,genre,performer,duration,albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id`,
      values: [title,year,genre,performer,duration,albumId, id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id lagu tersebut tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
 
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports= SongsService;
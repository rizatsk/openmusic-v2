const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const {mapDBToModelPlaylists} = require('../../utils');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({name, username}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING  id',
      values: [id, name, username],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      JOIN users ON playlists.owner = users.id
      WHERE playlists.owner=$1`,
      values: [owner],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelPlaylists);
  }

  async getPlaylistsForSong(playlistId, owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $2 AND playlists.owner=$1`,
      values: [owner, playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus, Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistService;

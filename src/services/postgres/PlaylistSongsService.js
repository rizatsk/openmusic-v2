const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const {mapDBToModelPlaylistSongs} = require('../../utils');

class PlaylistSongsService {
  constructor(songsService, playlistService) {
    this._pool = new Pool();
    this._songService = songsService;
    this._playlistService = playlistService;
  }

  async addPlaylistSong({playlistId, songId, owner}) {
    const id = `playlist_song-${nanoid(16)}`;

    await this._songService.getSongById(songId);
    await this._playlistService.verifyPlaylistOwner(playlistId, owner);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING  id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);


    if (!result.rows[0].id) {
      throw new InvariantError('Playlist song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistIdSongs(playlistId, owner) {
    await this._playlistService.verifyPlaylistOwner(playlistId, owner);

    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      JOIN songs ON songs.id = playlist_songs.song_id 
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistIdSong(playlistId, songId, owner) {
    await this._playlistService.verifyPlaylistOwner(playlistId, owner);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new ClientError('Playlist song gagal dihapus, song id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;

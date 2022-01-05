exports.up = (pgm) => {
  // membuat song baru.
  pgm.sql(`INSERT INTO songs(id, title, year, performer, genre, duration, album_id) 
  VALUES('jaka_id', 'jaka', 2003, 'jaka', 'jaka', 123, 'joko_id')`);

  // membuat album baru.
  pgm.sql(`INSERT INTO albums(id, name, year) VALUES('joko_id', 'joko_id', 1234)`);


  // memberikan constraint
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');

  // menghapus album baru
  pgm.sql(`DELETE FROM albums WHERE id = 'joko_id'`);

  // menghapus song baru
  pgm.sql(`DELETE FROM songs WHERE id = 'jaka_id'`);
};

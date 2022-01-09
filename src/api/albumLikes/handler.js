class AlbumLikesHandler {
  constructor(service, albumsService, cacheService) {
    this._service = service;
    this._albumsService = albumsService;
    this._cacheService = cacheService;

    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this); // bind untuk mengikat this agar isinya tetap sama tidak berubah
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikesHandler(request, h) {
    const {id: albumId} = request.params;
    const {id: userId} = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    const userAlbumLike = await this._service.cekUserAlbumLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: userAlbumLike,
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const {id: albumId} = request.params;
    try {
      const AlbumLikes = await this._cacheService.get(`albums:${albumId}`);
      const albumLikes = JSON.parse(AlbumLikes);
      const response = h.response({
        status: 'success',
        data: {
          likes: albumLikes,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      const albumLikes = await this._service.getUserAlbumLikes(albumId);

      await this._cacheService.set(`albums:${albumId}`, JSON.stringify(albumLikes));

      const response = h.response({
        status: 'success',
        data: {
          likes: albumLikes,
        },
      });
      return response;
    }
  }
}

module.exports = AlbumLikesHandler;

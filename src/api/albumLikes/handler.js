class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

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

  async getAlbumLikesHandler(request) {
    const {id: albumId} = request.params;

    const albumLikes = await this._service.getUserAlbumLikes(albumId);
    return {
      status: 'success',
      data: {
        likes: albumLikes,
      },
    };
  }
}

module.exports = AlbumLikesHandler;

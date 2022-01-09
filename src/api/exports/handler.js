class ExportsHandler {
  constructor(ProducerService, playlistService, validator) {
    this._producerService = ProducerService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this); // bind untuk mengikat this agar isinya tetap sama tidak berubah
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const {id: credentialId} = request.auth.credentials;
    const {playlistId} = request.params;

    const message = {
      userId: request.auth.credentials.id,
      playlistId: request.params.playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;

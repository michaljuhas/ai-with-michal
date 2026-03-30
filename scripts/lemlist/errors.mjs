export class LemlistApiError extends Error {
  constructor(message, status, rawBody, code = null) {
    super(message);
    this.name = 'LemlistApiError';
    this.status = status;
    this.rawBody = rawBody;
    this.code = code;
    this.graveyard = false;
  }
}

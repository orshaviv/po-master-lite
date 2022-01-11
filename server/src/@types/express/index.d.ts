import HttpResponse from '../../middlewares/dto/httpResponse.dto';

declare global {
  namespace Express {
    interface Response {
      httpResponse: HttpResponse;
    }
  }
}

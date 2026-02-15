import { Injectable } from '@nestjs/common';
import * as handlers from './handlers';

@Injectable()
export class UtilsService {
  public JwtHandler = handlers.JwtHandler;
  public PasswordHandler = handlers.PasswordHandler;
}

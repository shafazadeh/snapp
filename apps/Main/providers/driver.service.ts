import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverService {
  // eslint-disable-next-line @typescript-eslint/require-await
  async signUp() {
    return 'welcom from service Driver in main';
  }
}

// خروجی صرفا یه ابجکت js است

// export default () => ({
//   port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
// });

import { registerAs } from '@nestjs/config';
// یه خروجی injectable میسازه
// در سایر سرویس ها باید با کلید App صدا زده بشه
const AppConfig = registerAs('App', () => ({
  port: 3000,
  version: 'v1',
}));
const SawggerConfig = registerAs('Swagger', () => ({
  title: 'snapp_backend',
  description: 'snapp back end swagger',
  version: '1.0.0',
}));
export const configurations = [AppConfig, SawggerConfig];

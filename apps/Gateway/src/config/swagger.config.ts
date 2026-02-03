import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from 'src/rest/admin/admin.module';
import { DriverModule } from 'src/rest/driver/driver.module';
import { PassengerModule } from 'src/rest/passenger/passenger.module';

interface SwaggerModuleItem {
  path: string;
  module: any;
}

export function setUpSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const apiVersion = configService.get('App.version') as number;

  const swaggerTitle = configService.get('Swagger.title') as number;
  const swaggerDescription = configService.get('Swagger.description') as number;
  const swaggerVersion = configService.get('Swagger.version') as number;

  const swaggerOption = new DocumentBuilder()
    .setTitle(swaggerTitle.toString())
    .setDescription(swaggerDescription.toString())
    .setVersion(swaggerVersion.toString())
    .build();

  const mainDocuments = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup(`${apiVersion}/docs`, app, mainDocuments);

  // داکیومنتهای ما برای پنل های مختف در صفحات جدا قرار بگیرد
  const modules: SwaggerModuleItem[] = [
    {
      path: 'admin',
      module: AdminModule,
    },
    {
      path: 'driver',
      module: DriverModule,
    },
    {
      path: 'passenger',
      module: PassengerModule,
    },
  ];

  modules.forEach(({ path, module }) => {
    const dec = SwaggerModule.createDocument(app, swaggerOption, {
      include: [module],
    });
    SwaggerModule.setup(`${apiVersion}/docs/${path}`, app, dec);
    // فقط برای اینکه کار بکنه و برای پنل یه صفحه داشته باشیم یدت نشه که باید ماژول های مربوط به هر پنل رو توی روتر هم ادد کنی
  });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          messages: Object.values(err.constraints),
        }));
        return new HttpException(
          {
            statusCode: 400,
            message: 'Validation Error',
            errors: formattedErrors,
          },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  app.enableCors({
    origin: '*', // อนุญาตทุกโดเมน (ใน Production ควรกำหนดเป็นโดเมนเฉพาะ)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // อนุญาต HTTP Methods
    credentials: true, // อนุญาตส่ง Cookies หรือ Headers ที่เกี่ยวข้อง
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Middleware ให้ NestJS ใช้ Express ในการให้บริการไฟล์สาธารณะ (รูปภาพ)
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // ✅ ตั้งค่า ValidationPipe สำหรับการตรวจสอบข้อมูลที่รับมา
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

  // ✅ เปิดใช้งาน CORS เพื่อให้สามารถเรียก API จาก Frontend ได้
  app.enableCors({
    origin: '*', // อนุญาตทุกโดเมน (ใน Production ควรระบุโดเมนที่เฉพาะเจาะจง)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // อนุญาตเฉพาะ HTTP Methods ที่จำเป็น
    credentials: true, // อนุญาตให้ใช้งาน Cookies หรือ Headers ที่เกี่ยวข้อง
  });

  // ✅ กำหนด PORT ที่ใช้ในการรันเซิร์ฟเวอร์ (ใช้ค่าจาก .env ถ้ามี)
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

# 1️⃣ ใช้ Node.js เวอร์ชันล่าสุดที่เสถียร (Alpine จะลดขนาด Image)
FROM node:22-alpine AS builder

# 2️⃣ ตั้งค่า Working Directory
WORKDIR /app

# 3️⃣ คัดลอกเฉพาะ package.json และ package-lock.json ก่อน
COPY package*.json ./

# 4️⃣ ติดตั้ง Dependencies
RUN npm install --only=production

# 5️⃣ คัดลอกโค้ดทั้งหมดเข้าไปใน Container
COPY . .

# 6️⃣ คอมไพล์ TypeScript เป็น JavaScript
RUN npm run build

# 7️⃣ ใช้ Node.js Image ใหม่เพื่อรันแอป (ลดขนาด Image)
FROM node:22-alpine

# 8️⃣ ตั้งค่า Working Directory
WORKDIR /app

# 9️⃣ คัดลอกไฟล์จาก Builder Stage
COPY --from=builder /app ./

# 🔟 กำหนด Environment Variable สำหรับ Port
ENV PORT=5000

# 11️⃣ เปิดพอร์ตให้ Docker Container ใช้
EXPOSE 5000

# 12️⃣ ใช้ `start` แทน `start:dev` (Production)
CMD ["npm", "run", "start"]

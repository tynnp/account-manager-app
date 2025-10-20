FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package và cài đặt
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ mã nguồn
COPY . .

# Expose port API
EXPOSE 8386

# Chạy ứng dụng
CMD ["npm", "start"]

# Website Giáo Xứ Đại Hải

Đây là mã nguồn chính thức cho trang web của Giáo Xứ Đại Hải.

## Cài đặt và Chạy

1. Cài đặt các thư viện:
   ```bash
   npm install
   ```
2. Thiết lập cơ sở dữ liệu:
   Cập nhật file `.env` với các biến môi trường Prisma, sau đó chạy:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
3. Chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

## Triển khai (Deploy)

Dự án này là một ứng dụng Next.js tiêu chuẩn, tối ưu hóa cho Vercel. Bạn có thể deploy trực tiếp bằng cách đẩy mã nguồn lên GitHub và kết nối với Vercel.

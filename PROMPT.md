# Prompt: Thiết kế & code trang Profile cá nhân

> Thay các chỗ `[...]` bằng thông tin của bạn trước khi dùng.

---

## Vai trò
Bạn là senior frontend engineer kiêm product designer. Hãy thiết kế và code hoàn chỉnh một trang portfolio cá nhân **một trang (single-page)**, đẹp, hiện đại, có cá tính riêng — không được trông giống template có sẵn.

## Chủ nhân trang
- Tên: `[Họ tên]` — Vai trò: **Fullstack Developer (MERN + AI)**
- Tagline: "Tôi xây sản phẩm từ database đến model AI chạy local."
- Vị trí: `[Thành phố], Việt Nam` — Email: `[email]` — GitHub: `[link]` — LinkedIn: `[link]`
- Ngôn ngữ: Tiếng Việt mặc định, có nút chuyển sang English (i18next).

## Ý tưởng thiết kế (concept)
**"DevStack — một hệ thống đang chạy."** Trang được trình bày như bảng điều khiển của một hệ thống phần mềm đang hoạt động: các khối như "service", có đèn trạng thái nhỏ, nhãn kiểu `v2.0 · running`, đường nối mảnh giữa các khối. Cảm giác: tinh tế, kỹ thuật, nhiều khoảng trống — **không** phải giao diện hacker xanh lá rối mắt.

### Màu sắc (dark mode mặc định, có light mode)
- Nền: `#0B0D12`, bề mặt thẻ: `#12151C`, viền: `#1F2430`
- Chữ chính: `#E6E8EE`, chữ phụ: `#8A93A6`
- Màu nhấn duy nhất: xanh điện `#4F8CFF`, chỉ dùng cho CTA, link, trạng thái đang hoạt động
- Màu phụ cực ít: xanh lá `#3DDC97` chỉ cho chấm "online"
- Không dùng gradient cầu vồng. Có thể dùng 1 lớp glow mờ màu nhấn phía sau hero.

### Chữ
- Tiêu đề: **Inter Tight** hoặc **Space Grotesk**, đậm, letter-spacing âm nhẹ
- Nội dung: **Inter**
- Nhãn kỹ thuật, số liệu, tag: **JetBrains Mono**
- Tất cả font phải hỗ trợ đầy đủ dấu tiếng Việt

### Bố cục
- Container tối đa 1120px, lưới 12 cột, khoảng cách theo bội số của 8px
- Bo góc 12–16px, viền 1px, gần như không đổ bóng

## Các section

1. **Navbar** dính trên cùng, nền mờ (backdrop-blur), hiện section đang xem, nút đổi ngôn ngữ và sáng/tối, nút "Liên hệ".
2. **Hero**
   - Dòng nhỏ dạng mono: `● available for work`
   - Tên lớn + vai trò + tagline
   - Bên phải: một "terminal card" tự gõ chữ:
     ```
     $ whoami
     fullstack developer · MERN · local AI
     $ ls ~/DevStack
     CreatorAI  FlorenX_v2  veltrix-voice  tool-chitieu  ...
     ```
   - 2 nút: "Xem dự án" (chính), "Tải CV" (phụ)
3. **Về tôi**: 2–3 đoạn ngắn + 3–4 con số nổi bật đếm tăng dần khi cuộn tới (số dự án, số app đã ship, số công nghệ...).
4. **Tech Stack**: trình bày như sơ đồ kiến trúc theo từng tầng, không phải lưới icon thông thường:
   - Frontend: React, Vite, TypeScript, Redux Toolkit, Tailwind, Ant Design, Sass, Framer Motion
   - Backend: Node.js, Express, MongoDB/Mongoose, Socket.IO, Zod, BullMQ, Redis
   - Auth & thanh toán: JWT, Google OAuth, Passport, PayPal
   - AI: Gemini API, llama.cpp (Gemma), Diffusers/PyTorch CUDA, TTS (VieNeu, AWS Polly, Edge TTS), Tesseract OCR
   - Kiểm thử & DevOps: Vitest, Supertest, Playwright, oxlint, Cloudinary, Vercel, monorepo
   - Khác: Chrome Extension (Manifest V3), Python Win32
   - Di chuột vào một công nghệ thì làm nổi các dự án có dùng công nghệ đó.
5. **Dự án nổi bật**: dạng bento grid, thẻ lớn cho dự án chính:
   - **CreatorAI** (thẻ lớn nhất): nền tảng tạo nội dung bằng AI theo kiến trúc monorepo (API, worker hàng đợi BullMQ, 3 web app), chạy LLM/TTS/sinh ảnh ngay trên máy, dựng video bằng Remotion.
   - **FlorenX v2**: web thương mại điện tử có PayPal, chat realtime, dashboard quản trị, trợ lý Gemini, xuất PDF.
   - **Veltrix Voice**: nền tảng chuyển văn bản thành giọng nói, nhiều engine, đa ngôn ngữ.
   - **Tool Chi Tiêu**: app quản lý chi tiêu có thông báo đẩy, trang admin, AI hỗ trợ.
   - **Incident Management (HKDN)**: hệ thống quản lý sự cố, TypeScript toàn bộ, validate bằng Zod.
   - **Veltrix Ambient Light**: tiện ích Chrome tạo đèn nền theo màu video.
   - **Tool Style Window**: công cụ Python tùy biến giao diện Windows qua Win32 API.
   - Mỗi thẻ có: tên, mô tả 1 dòng, tag công nghệ (font mono), trạng thái (`live` / `in progress`), link Demo / Code, ảnh chụp màn hình hoặc mockup. Bấm vào thẻ thì mở modal chi tiết: vấn đề → giải pháp → kiến trúc → điều tôi học được.
6. **Hành trình**: timeline dọc theo thời gian (FlorenX → FlorenX v2 → tool-chitieu → Veltrix → HKDN → CreatorAI), thể hiện sự tiến bộ từ JavaScript lên TypeScript, monorepo, AI chạy local.
7. **Liên hệ**: câu kêu gọi lớn, form (tên, email, nội dung) có validate, các nút copy email và mạng xã hội.
8. **Footer**: dòng mono `built with React + Vite · last deploy [ngày]`.

## Chuyển động
- Dùng Framer Motion: nội dung hiện dần (fade + trượt lên 12px) khi cuộn tới, các phần tử con xuất hiện lần lượt cách nhau 60ms
- Thẻ dự án: khi hover thì nhích lên 2px và viền đổi sang màu nhấn
- Con trỏ trong hero có vệt sáng nhẹ đi theo (chỉ trên desktop)
- Tôn trọng `prefers-reduced-motion`: tắt toàn bộ chuyển động nếu người dùng chọn giảm chuyển động

## Yêu cầu kỹ thuật
- **React + Vite + TypeScript + Tailwind CSS + Framer Motion + i18next + lucide-react**
- Toàn bộ nội dung (dự án, kỹ năng, timeline) tách ra file `src/data/*.ts` để tự sửa dễ dàng
- Responsive tốt ở 360px / 768px / 1280px; trên mobile, bento grid chuyển thành 1 cột
- Hỗ trợ tiếp cận (accessibility): HTML đúng ngữ nghĩa, độ tương phản đạt chuẩn WCAG AA, dùng được hoàn toàn bằng bàn phím, có focus ring rõ ràng
- SEO: meta tag, Open Graph, favicon, `lang="vi"`
- Hiệu năng: Lighthouse ≥ 95, ảnh định dạng WebP và lazy-load, font dùng `display: swap`
- Cấu trúc thư mục rõ ràng: `components/`, `sections/`, `data/`, `hooks/`, `i18n/`

## Đầu ra mong muốn
1. Cây thư mục
2. Code đầy đủ từng file, chạy được ngay với `npm install && npm run dev`
3. Hướng dẫn ngắn: cách thay nội dung, thêm dự án mới, deploy lên Vercel

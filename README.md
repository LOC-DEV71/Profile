# Lâm Chí Lộc — Portfolio

Trang portfolio một trang của **Lâm Chí Lộc**, Fullstack Developer (MERN + AI) tại TP. Hồ Chí Minh.
Giao diện song ngữ Việt / Anh, chế độ sáng / tối, và nhiều hiệu ứng chuyển động.

## Tính năng

- **Hero:** nền shader WebGL (cực quang), chân dung ghép từ hạt halftone, bấm `pixel / photo` để chuyển qua ảnh thật.
- **Màn khởi động** kiểu terminal, chỉ hiện lần đầu trong phiên trình duyệt.
- **Terminal tương tác** (`Ctrl/⌘ + K` hoặc phím `` ` ``): gõ `help` để xem các lệnh.
- **Tech Stack:** quả cầu 3D các công nghệ, kéo chuột để xoay. Rê vào một công nghệ thì các dự án dùng nó sáng lên.
- **Dự án:** trên desktop cuộn dọc sẽ trượt ngang qua các thẻ, thẻ nghiêng 3D theo chuột. Bấm thẻ mở chi tiết: vấn đề → giải pháp → kiến trúc → điều đã học.
- **Timeline** hành trình tự vẽ theo thanh cuộn.
- **Footer màn kéo:** cuộn tới cuối, nội dung trượt lên để lộ tên cỡ lớn và đồng hồ giờ Việt Nam.
- **Song ngữ** Việt / Anh, tự nhớ lựa chọn của người dùng.
- **Tiếp cận:** điều hướng bằng bàn phím, có link bỏ qua đến nội dung chính. Tôn trọng `prefers-reduced-motion` (tắt toàn bộ chuyển động khi hệ điều hành bật chế độ giảm chuyển động).

## Công nghệ

React 19 · Vite 6 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis (cuộn mượt) · i18next · lucide-react · WebGL / Canvas 2D

## Chạy trên máy

Yêu cầu: Node.js 20 trở lên.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # kiểm tra kiểu TypeScript rồi xuất ra thư mục dist/
npm run preview   # xem thử bản đã build
```

## Cấu trúc thư mục

```
public/                 ảnh, CV, favicon (phục vụ nguyên trạng)
src/
├── data/               NỘI DUNG: profile, stack, projects, journey
├── i18n/               chuỗi giao diện: vi.json, en.json
├── sections/           các phần của trang: Hero, About, Stack, Projects, Journey, Contact, Footer
├── components/         component dùng chung: Terminal, ShaderBackground, ParticlePortrait, TagSphere, Cursor…
├── hooks/              useTheme, useTypewriter, useCountUp, useActiveSection
├── lib/scroll.ts       khởi tạo Lenis, khoá cuộn khi mở modal / terminal
├── App.tsx             ghép các phần lại, quản lý màn khởi động
└── index.css           design tokens (màu, font) và keyframes
```

## Thay nội dung

Hầu hết nội dung nằm trong `src/data/`, sửa ở đó là đủ:

| File | Nội dung |
|---|---|
| `profile.ts` | Tên, vai trò, tagline, địa điểm, email, GitHub, LinkedIn, đường dẫn CV và ảnh, đoạn giới thiệu |
| `stack.ts` | Các tầng công nghệ (Frontend, Backend, AI…) |
| `projects.ts` | Danh sách dự án: mô tả, tech, link demo / code, ảnh, nội dung modal |
| `journey.ts` | Các mốc trong timeline |

Chuỗi giao diện (nút, tiêu đề, thông báo lỗi…) nằm ở `src/i18n/vi.json` và `src/i18n/en.json`.

Dữ liệu song ngữ dùng kiểu `{ vi: '...', en: '...' }`. Thiếu một ngôn ngữ thì trang sẽ hiển thị trống ở ngôn ngữ đó, nên điền đủ cả hai.

### Thêm dự án mới

Thêm một object vào mảng `projects` trong `src/data/projects.ts`:

- `size`: `xl` (2 cột, cao), `tall` (cao), `wide` (2 cột), `md` (thường). Chọn sao cho lưới không bị trống ô.
- `tech`: tên công nghệ phải trùng với `stack.ts` để hiệu ứng hover hoạt động.
- `image` (tùy chọn): đường dẫn ảnh trong `public/`, ví dụ `/projects/ten-du-an.webp`. Không có ảnh thì trang tự vẽ hình minh họa.

### Thêm lệnh cho terminal

Mở `src/components/Terminal.tsx`, thêm một `case` vào hàm `run`. Thêm tên lệnh vào mảng `COMMANDS` để Tab tự hoàn thành.

## Tài sản cần có trong `public/`

| File | Dùng ở đâu | Trạng thái |
|---|---|---|
| `me.webp` | Ảnh chân dung ở Hero, og:image | Có |
| `favicon.svg` | Icon trên tab trình duyệt | Có |
| `cv.pdf` | Nút "Tải CV" | **Chưa có** |
| `og.png` (1200×630) | Ảnh khi chia sẻ link | Chưa dùng (đang trỏ tới `me.webp`) |

Ảnh gốc `.jpg` trong `public/` không được trang sử dụng. Nên xoá trước khi deploy để giảm dung lượng.

## Form liên hệ

Hiện tại form mở ứng dụng email của người gửi bằng `mailto:`, không cần backend. Muốn nhận thư trực tiếp, sửa hàm `onSubmit` trong `src/sections/Contact.tsx` để gọi Formspree, Resend hoặc API riêng.

## Hiệu năng và tiếp cận

- Shader và hạt chân dung tạm dừng khi cuộn khỏi Hero (IntersectionObserver).
- Con trỏ tuỳ biến và hiệu ứng nghiêng chỉ bật trên thiết bị có chuột.
- Khi bật "giảm chuyển động", toàn bộ animation dừng và hạt chân dung hiện ngay ở vị trí cuối.
- Nếu hiệu năng chậm trên điện thoại cũ, giảm số hạt trong `ParticlePortrait.tsx` (biến `gap`) hoặc tắt shader trong `Hero.tsx`.

## Deploy lên Vercel

1. Đẩy thư mục này lên GitHub.
2. Vào [vercel.com](https://vercel.com) → **New Project** → chọn repo. Vercel tự nhận Vite.
   - Build command: `npm run build`
   - Output directory: `dist`
3. Hoặc chạy `npx vercel` trong thư mục dự án để deploy từ dòng lệnh.

## Ghi chú

- Mô tả dự án và các mốc trong timeline được soạn từ thông tin trong thư mục làm việc, cần kiểm tra lại trước khi công bố.
- Chế độ sáng / tối được lưu trong `localStorage` với khoá `theme`.

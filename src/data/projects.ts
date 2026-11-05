import type { L } from './types';

export type Project = {
  id: string;
  name: string;
  version: string;
  status: 'live' | 'in progress';
  size: 'xl' | 'tall' | 'wide' | 'md';
  summary: L;
  tech: string[];
  demo?: string;
  code?: string;
  image?: string; // ảnh WebP trong public/, ví dụ '/projects/creatorai.webp'
  detail: { problem: L; solution: L; architecture: L; learned: L };
};

// ✏️ Mô tả dưới đây được suy ra từ thư viện của từng dự án — hãy kiểm tra và chỉnh lại cho đúng.
export const projects: Project[] = [
  {
    id: 'creatorai',
    name: 'CreatorAI',
    version: 'v1.0',
    status: 'in progress',
    size: 'xl',
    summary: {
      vi: 'Nền tảng tạo nội dung bằng AI: monorepo gồm API, worker hàng đợi và 3 web app, chạy LLM, TTS và sinh ảnh ngay trên máy.',
      en: 'AI content platform: a monorepo with an API, a queue worker and 3 web apps, running LLM, TTS and image generation locally.',
    },
    tech: ['TypeScript', 'React', 'Vite', 'Tailwind', 'Ant Design', 'Framer Motion', 'Express', 'MongoDB', 'Zod', 'BullMQ', 'Redis', 'Socket.IO', 'Google OAuth', 'JWT', 'llama.cpp', 'Diffusers / PyTorch', 'TTS', 'Tesseract OCR', 'Gemini API', 'Remotion', 'Vitest', 'Supertest', 'Playwright', 'oxlint', 'Monorepo', 'Python'],
    detail: {
      problem: {
        vi: 'Tạo nội dung (kịch bản, giọng đọc, hình ảnh, video) cần nhiều công cụ rời rạc và tốn chi phí API.',
        en: 'Producing content (scripts, voice, images, video) takes many scattered tools and costly APIs.',
      },
      solution: {
        vi: 'Gom toàn bộ quy trình vào một nền tảng, phần nặng chạy bằng model local trên GPU để giảm chi phí.',
        en: 'One platform for the whole pipeline, with heavy work running on local GPU models to cut costs.',
      },
      architecture: {
        vi: 'apps/: backend-api, worker (BullMQ + Redis), web-client, web-admin, web-support · packages/: contracts, design-tokens, image-gen, video-renderer (Remotion) · services/: ai (Gemma qua llama.cpp), tts.',
        en: 'apps/: backend-api, worker (BullMQ + Redis), web-client, web-admin, web-support · packages/: contracts, design-tokens, image-gen, video-renderer (Remotion) · services/: ai (Gemma via llama.cpp), tts.',
      },
      learned: {
        vi: 'Tách hợp đồng dữ liệu dùng chung, xử lý job dài bằng hàng đợi, và quản lý model/artifact có checksum để build lặp lại được.',
        en: 'Shared data contracts, long-running jobs via queues, and checksummed model artifacts for reproducible builds.',
      },
    },
  },
  {
    id: 'florenx',
    name: 'FlorenX v2',
    version: 'v2.0',
    status: 'live',
    size: 'tall',
    summary: {
      vi: 'Web thương mại điện tử có PayPal, chat realtime, dashboard quản trị, trợ lý Gemini và xuất PDF.',
      en: 'E-commerce site with PayPal, realtime chat, an admin dashboard, a Gemini assistant and PDF export.',
    },
    tech: ['React', 'Vite', 'Redux Toolkit', 'Ant Design', 'Sass', 'Express', 'MongoDB', 'Socket.IO', 'JWT', 'Google OAuth', 'PayPal', 'Gemini API', 'Cloudinary'],
    detail: {
      problem: {
        vi: 'Cửa hàng cần bán hàng online, chăm sóc khách realtime và theo dõi doanh thu ở cùng một nơi.',
        en: 'A shop needed online sales, realtime customer support and revenue tracking in one place.',
      },
      solution: {
        vi: 'Viết lại từ v1: thêm Redux, thanh toán PayPal phía server, chat Socket.IO, trợ lý AI và báo cáo PDF.',
        en: 'Rewrite of v1: Redux, server-side PayPal checkout, Socket.IO chat, an AI assistant and PDF reports.',
      },
      architecture: {
        vi: 'Frontend React + Redux Toolkit · Backend Express tách api/service/socket · MongoDB · Cloudinary lưu ảnh · rate limit cho API.',
        en: 'React + Redux Toolkit frontend · Express backend split into api/service/socket · MongoDB · Cloudinary for media · API rate limiting.',
      },
      learned: {
        vi: 'Xử lý thanh toán an toàn phía server và tổ chức lại codebase khi dự án lớn dần.',
        en: 'Handling payments safely on the server and restructuring a codebase as it grows.',
      },
    },
  },
  {
    id: 'voice',
    name: 'Veltrix Voice',
    version: 'v1.0',
    status: 'live',
    size: 'md',
    summary: {
      vi: 'Nền tảng chuyển văn bản thành giọng nói với nhiều engine, giao diện đa ngôn ngữ.',
      en: 'Text-to-speech platform with multiple engines and a multilingual UI.',
    },
    tech: ['React', 'Vite', 'Redux Toolkit', 'Ant Design', 'i18next', 'Express', 'MongoDB', 'JWT', 'Google OAuth', 'TTS', 'Cloudinary', 'oxlint'],
    detail: {
      problem: { vi: 'Mỗi engine TTS có điểm mạnh riêng, người dùng phải nhảy qua nhiều trang.', en: 'Each TTS engine has its own strengths, so users hop between sites.' },
      solution: { vi: 'Một giao diện chung gọi AWS Polly, Edge TTS và Google TTS phía sau.', en: 'One interface fronting AWS Polly, Edge TTS and Google TTS.' },
      architecture: { vi: 'Backend MVC (controllers, models, routes, validators, middlewares) · Frontend React + i18next.', en: 'MVC backend (controllers, models, routes, validators, middlewares) · React + i18next frontend.' },
      learned: { vi: 'Thiết kế lớp trừu tượng để thay engine mà không đổi API.', en: 'Designing an abstraction so engines can be swapped without changing the API.' },
    },
  },
  {
    id: 'chitieu',
    name: 'Tool Chi Tiêu',
    version: 'v1.0',
    status: 'live',
    size: 'md',
    summary: {
      vi: 'App quản lý chi tiêu có thông báo đẩy, trang admin, biểu đồ và AI hỗ trợ.',
      en: 'Expense tracker with push notifications, an admin panel, charts and AI help.',
    },
    tech: ['React', 'Vite', 'Express', 'MongoDB', 'Socket.IO', 'Passport', 'Google OAuth', 'JWT', 'Gemini API', 'TTS', 'Cloudinary', 'oxlint'],
    detail: {
      problem: { vi: 'Ghi chép chi tiêu thủ công dễ quên và khó nhìn ra xu hướng.', en: 'Manual expense logging is easy to forget and hard to analyse.' },
      solution: { vi: 'Nhắc nhở bằng Web Push, biểu đồ trực quan và AI gợi ý.', en: 'Web Push reminders, visual charts and AI suggestions.' },
      architecture: { vi: '3 phần: backend Express, frontend người dùng, fe-admin riêng.', en: 'Three parts: Express backend, user frontend, separate fe-admin.' },
      learned: { vi: 'Service worker, Web Push và đăng nhập Google qua Passport.', en: 'Service workers, Web Push and Google sign-in with Passport.' },
    },
  },
  {
    id: 'hkdn',
    name: 'Incident Management',
    version: 'g1.1',
    status: 'in progress',
    size: 'md',
    summary: {
      vi: 'Hệ thống quản lý sự cố viết TypeScript toàn bộ, validate dữ liệu bằng Zod.',
      en: 'Incident management system, TypeScript end to end, validated with Zod.',
    },
    tech: ['TypeScript', 'React', 'Vite', 'Redux Toolkit', 'Express', 'MongoDB', 'Zod', 'oxlint'],
    detail: {
      problem: { vi: 'Sự cố được báo qua nhiều kênh, khó theo dõi trạng thái xử lý.', en: 'Incidents arrive through many channels and are hard to track.' },
      solution: { vi: 'Một nơi tiếp nhận, phân loại và theo dõi vòng đời sự cố.', en: 'One place to receive, triage and track the incident lifecycle.' },
      architecture: { vi: 'Backend Express + Mongoose + Zod (tsx) · Frontend React + Redux Toolkit · chạy song song bằng concurrently.', en: 'Express + Mongoose + Zod backend (tsx) · React + Redux Toolkit frontend · run together with concurrently.' },
      learned: { vi: 'Kiểu dữ liệu an toàn từ request đến database.', en: 'Type safety from request to database.' },
    },
  },
  {
    id: 'ambient',
    name: 'Veltrix Ambient Light',
    version: 'v1.0',
    status: 'live',
    size: 'md',
    summary: {
      vi: 'Tiện ích Chrome tạo đèn nền phản chiếu theo màu video, mượt trên mọi trang.',
      en: 'Chrome extension that adds an ambient glow matching the video’s colors.',
    },
    tech: ['Chrome Extension'],
    detail: {
      problem: { vi: 'Xem video trên nền tối phẳng thiếu chiều sâu.', en: 'Watching video on a flat dark background lacks depth.' },
      solution: { vi: 'Lấy màu khung hình liên tục và vẽ vùng sáng quanh trình phát.', en: 'Sample frame colors continuously and paint a glow around the player.' },
      architecture: { vi: 'Manifest V3 · content script · popup cài đặt lưu bằng chrome.storage.', en: 'Manifest V3 · content script · settings popup stored with chrome.storage.' },
      learned: { vi: 'Tối ưu hiệu năng khi xử lý khung hình theo thời gian thực.', en: 'Performance tuning for realtime frame processing.' },
    },
  },
  {
    id: 'stylewindow',
    name: 'Tool Style Window',
    version: 'poc',
    status: 'in progress',
    size: 'wide',
    summary: {
      vi: 'Công cụ Python tùy biến giao diện Windows (hiệu ứng kính) qua Win32 API, có sao lưu/khôi phục.',
      en: 'Python tool that restyles Windows (glass effects) via the Win32 API, with backup/restore.',
    },
    tech: ['Python', 'Win32 API'],
    detail: {
      problem: { vi: 'Windows ít cho phép tùy biến giao diện sâu.', en: 'Windows offers little deep UI customisation.' },
      solution: { vi: 'Gọi trực tiếp Win32 API để áp theme, chạy nền và có bảng điều khiển.', en: 'Call the Win32 API directly to apply themes, with a background agent and control panel.' },
      architecture: { vi: 'engine/ (win32_apis, surface_controllers, backup_restore, background_agent) · config/ lưu theme.', en: 'engine/ (win32_apis, surface_controllers, backup_restore, background_agent) · config/ stores themes.' },
      learned: { vi: 'Làm việc với API hệ điều hành và luôn có đường lui an toàn (backup).', en: 'Working with OS APIs and always keeping a safe rollback.' },
    },
  },
];

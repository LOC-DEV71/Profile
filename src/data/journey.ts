import type { L } from './types';

export type Milestone = { when: string; title: string; note: L };

// ✏️ Mốc thời gian đang là ước lượng — hãy sửa lại cho đúng
export const journey: Milestone[] = [
  { when: '2026 · Q1', title: 'FlorenX', note: { vi: 'Dự án MERN đầu tiên: e-commerce, Socket.IO, đăng nhập Google.', en: 'First MERN project: e-commerce, Socket.IO, Google sign-in.' } },
  { when: '2026 · Q2', title: 'FlorenX v2', note: { vi: 'Viết lại với Redux Toolkit, PayPal phía server, trợ lý Gemini.', en: 'Rewrite with Redux Toolkit, server-side PayPal, a Gemini assistant.' } },
  { when: '2026 · Q3', title: 'Tool Chi Tiêu', note: { vi: 'Web Push, Passport, tách riêng trang admin.', en: 'Web Push, Passport, a separate admin app.' } },
  { when: '2026 · Q3', title: 'Veltrix Voice', note: { vi: 'Đa engine TTS, đa ngôn ngữ, kiến trúc MVC rõ ràng.', en: 'Multiple TTS engines, i18n, a clean MVC structure.' } },
  { when: '2026 · Q4', title: 'Incident Management', note: { vi: 'Chuyển hẳn sang TypeScript + Zod.', en: 'Fully moved to TypeScript + Zod.' } },
  { when: '2026 · Q4', title: 'CreatorAI', note: { vi: 'Monorepo, hàng đợi BullMQ, AI chạy local trên GPU.', en: 'Monorepo, BullMQ queues, local GPU AI.' } },
];

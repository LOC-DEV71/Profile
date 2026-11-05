import type { L } from './types';

export type StackLayer = { id: string; label: L; items: string[] };

// ✏️ Tên công nghệ ở đây phải khớp với mảng `tech` trong projects.ts để hiệu ứng hover hoạt động
export const stack: StackLayer[] = [
  {
    id: 'frontend',
    label: { vi: 'Frontend', en: 'Frontend' },
    items: ['React', 'Vite', 'TypeScript', 'Redux Toolkit', 'Tailwind', 'Ant Design', 'Sass', 'Framer Motion', 'i18next'],
  },
  {
    id: 'backend',
    label: { vi: 'Backend', en: 'Backend' },
    items: ['Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Zod', 'BullMQ', 'Redis'],
  },
  {
    id: 'auth',
    label: { vi: 'Auth & Thanh toán', en: 'Auth & Payments' },
    items: ['JWT', 'Google OAuth', 'Passport', 'PayPal'],
  },
  {
    id: 'ai',
    label: { vi: 'AI', en: 'AI' },
    items: ['Gemini API', 'llama.cpp', 'Diffusers / PyTorch', 'TTS', 'Tesseract OCR', 'Remotion'],
  },
  {
    id: 'quality',
    label: { vi: 'Kiểm thử & DevOps', en: 'Testing & DevOps' },
    items: ['Vitest', 'Supertest', 'Playwright', 'oxlint', 'Cloudinary', 'Vercel', 'Monorepo'],
  },
  {
    id: 'other',
    label: { vi: 'Khác', en: 'Other' },
    items: ['Chrome Extension', 'Python', 'Win32 API'],
  },
];

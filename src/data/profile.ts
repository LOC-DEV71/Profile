import type { L } from './types';

// ✏️ Sửa thông tin cá nhân tại đây
export const profile = {
  name: 'Lâm Chí Lộc',
  role: { vi: 'Fullstack Developer (MERN + AI)', en: 'Fullstack Developer (MERN + AI)' } as L,
  tagline: {
    vi: 'Tôi xây sản phẩm từ database đến model AI chạy local.',
    en: 'I build products from the database all the way to local AI models.',
  } as L,
  location: { vi: 'TP. Hồ Chí Minh, Việt Nam', en: 'Ho Chi Minh City, Vietnam' } as L,
  email: 'lamchilocwork5@gmail.com',
  github: 'https://github.com/LOC-DEV71',
  linkedin: 'https://www.linkedin.com/in/l%C3%A2m-ch%C3%AD-l%E1%BB%99c-38b888437/',
  cvUrl: '/cv.pdf', // đặt file CV vào thư mục public/cv.pdf
  photo: '/me.webp', // ảnh chân dung (cắt từ ảnh gốc trong public/)
  available: true,
  about: [
    {
      vi: 'Mình là lập trình viên fullstack, làm việc chủ yếu với hệ sinh thái MERN và TypeScript. Mình thích tự tay đi hết một sản phẩm: thiết kế schema, viết API, dựng giao diện và đưa nó lên production.',
      en: 'I’m a fullstack developer working mostly with the MERN ecosystem and TypeScript. I like owning a product end to end: designing the schema, writing the API, building the UI and shipping it.',
    },
    {
      vi: 'Gần đây mình tập trung vào AI chạy local: LLM qua llama.cpp, sinh ảnh bằng diffusers trên GPU, chuyển văn bản thành giọng nói tiếng Việt, rồi ghép tất cả vào một hệ thống có hàng đợi xử lý và realtime.',
      en: 'Lately I’ve focused on local AI: LLMs via llama.cpp, GPU image generation with diffusers, Vietnamese text-to-speech, all wired into a system with job queues and realtime updates.',
    },
  ] as L[],
};

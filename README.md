# Phu Nguyen Land - BDS Website

Website chính thức của Phu Nguyen Land - Giải pháp Bất động sản Toàn diện tại Đà Nẵng.

## 🚀 Tính năng

- **Hero Section**: Background image slider với 4 ảnh đẹp
- **Vị trí dự án**: Thông tin chi tiết về Regal Complex Đà Nẵng
- **Tiện ích**: 18 tiện ích đẳng cấp 5 sao
- **Giá & Chính sách**: Chính sách bán hàng và giá bán chi tiết
- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Tailwind CSS**: Giao diện hiện đại và đẹp mắt

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3
- **UI Components**: Radix UI, Lucide React
- **Deployment**: GitHub Pages với GitHub Actions

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/bds-website.git
cd bds-website

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## 🚀 Deployment

### Tự động với GitHub Actions

Website sẽ tự động được deploy lên GitHub Pages mỗi khi có push vào nhánh `main`.

### Cấu hình GitHub Pages

1. Vào **Settings** > **Pages** trong repository
2. **Source**: Chọn "GitHub Actions"
3. **Branch**: Để mặc định (main)

### Cấu hình GitHub Actions

1. Vào **Settings** > **Actions** > **General**
2. **Workflow permissions**: Chọn "Read and write permissions"
3. **Allow GitHub Actions to create and approve pull requests**: Bật

### Manual Deployment

```bash
# Build project
npm run build

# Export static files
npm run export
```

## 📁 Cấu trúc dự án

```
bds-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   │   ├── ui/                # UI components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── HeroSection.tsx    # Hero section với background slider
│   │   ├── LocationSection.tsx # Thông tin vị trí dự án
│   │   ├── AmenitiesSection.tsx # Tiện ích dự án
│   │   └── PricingSection.tsx # Giá và chính sách
│   └── lib/                   # Utility functions
├── public/
│   └── images/
│       └── homepage/          # Background images
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── package.json
```

## 🎨 Customization

### Thay đổi background images

1. Thay thế ảnh trong `public/images/homepage/`
2. Cập nhật tên file trong `BackgroundSlider.tsx`

### Thay đổi thông tin dự án

1. **Vị trí**: Cập nhật trong `LocationSection.tsx`
2. **Tiện ích**: Cập nhật trong `AmenitiesSection.tsx`
3. **Giá bán**: Cập nhật trong `PricingSection.tsx`

### Thay đổi branding

1. **Logo**: Cập nhật trong `Header.tsx`
2. **Màu sắc**: Cập nhật trong `tailwind.config.js`

## 🔧 Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run export       # Export static files
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌐 Live Demo

Website được deploy tại: `https://your-username.github.io/bds-website/`

## 📞 Liên hệ

- **Website**: [Phu Nguyen Land](https://your-username.github.io/bds-website/)
- **Email**: contact@phunguyenland.com
- **Phone**: +84 XXX XXX XXX

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

**Phu Nguyen Land** - Giải pháp Bất động sản Toàn diện tại Đà Nẵng 🏠✨

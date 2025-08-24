# Firebase Setup Guide

## Cài đặt Firebase

Project đã được tích hợp Firebase để xử lý form liên hệ. Dưới đây là hướng dẫn chi tiết:

### 1. Dependencies đã cài đặt

```bash
npm install firebase
```

### 2. Cấu hình Firebase

File `src/lib/firebase.ts` đã được tạo với cấu hình Firebase của bạn:

- **API Key**: AIzaSyBx_ttb1Iwuk3FuGWLz2K4n6MjjSHt_Mn8
- **Project ID**: bds-website-11dc4
- **Auth Domain**: bds-website-11dc4.firebaseapp.com

### 3. Cấu hình Firestore Database

Để form liên hệ hoạt động, bạn cần:

1. **Truy cập Firebase Console**: https://console.firebase.google.com/
2. **Chọn project**: bds-website-11dc4
3. **Vào Firestore Database** trong menu bên trái
4. **Tạo database** nếu chưa có:
   - Chọn "Start in test mode" để cho phép đọc/ghi
   - Chọn location gần nhất (ví dụ: asia-southeast1)

### 4. Cấu hình Security Rules

Trong Firestore Database > Rules, cập nhật rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contacts/{document} {
      allow read, write: if true; // Cho phép đọc/ghi cho tất cả (chỉ dành cho demo)
    }
  }
}
```

**Lưu ý**: Trong production, bạn nên có rules bảo mật hơn.

### 5. Cấu hình Analytics (tùy chọn)

Firebase Analytics đã được tích hợp và sẽ tự động hoạt động trong môi trường browser.

## Cách hoạt động

### 1. Form Submission

Khi người dùng gửi form liên hệ:

1. Dữ liệu được validate
2. Gửi đến Firestore collection "contacts"
3. Hiển thị thông báo thành công/lỗi
4. Reset form sau khi gửi thành công

### 2. Data Structure

Mỗi contact record trong Firestore có cấu trúc:

```typescript
interface ContactFormData {
  name: string;           // Họ và tên
  email: string;          // Email
  phone: string;          // Số điện thoại
  service: string;        // Dịch vụ quan tâm
  message: string;        // Nội dung tin nhắn
  createdAt: Timestamp;   // Thời gian tạo (tự động)
}
```

### 3. Error Handling

- Network errors được xử lý
- User-friendly error messages
- Loading states để tránh duplicate submissions

## Tính năng đã thêm

✅ **Form Validation**: Tất cả fields bắt buộc
✅ **Loading States**: Hiển thị spinner khi đang gửi
✅ **Success/Error Messages**: Thông báo rõ ràng cho user
✅ **Form Reset**: Tự động reset sau khi gửi thành công
✅ **Disabled States**: Disable form khi đang submit
✅ **TypeScript Support**: Full type safety

## Troubleshooting

### Lỗi "Firebase: Error (auth/unauthorized-domain)"

Cần thêm domain vào Firebase Console > Authentication > Settings > Authorized domains

### Lỗi "Firestore: Missing or insufficient permissions"

Kiểm tra Firestore Rules và đảm bảo cho phép đọc/ghi

### Lỗi "Firebase: Error (app/duplicate-app)"

Firebase app đã được initialize. Kiểm tra file `firebase.ts`

## Production Considerations

1. **Security Rules**: Cập nhật Firestore rules để bảo mật
2. **Rate Limiting**: Thêm rate limiting để tránh spam
3. **Data Validation**: Thêm server-side validation
4. **Monitoring**: Sử dụng Firebase Analytics để theo dõi
5. **Backup**: Thiết lập backup cho Firestore data

## Support

Nếu gặp vấn đề, kiểm tra:
- Firebase Console logs
- Browser console errors
- Network tab trong DevTools
- Firestore Rules configuration

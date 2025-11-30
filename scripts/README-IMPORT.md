# Hướng dẫn Import Projects vào Firebase

## Tổng quan

Script này sẽ import dữ liệu từ file `assets/projects.json` vào Firebase Firestore collection `projects`.

## Cài đặt

Đảm bảo bạn đã cài đặt các dependencies:

```bash
npm install
```

## Sử dụng

### Import dữ liệu vào Firebase

```bash
npm run import-projects
```

Script sẽ:
1. Đọc file `assets/projects.json`
2. Kiểm tra xem dự án đã tồn tại trong Firebase chưa (dựa trên `projectName`)
3. Import các dự án mới vào Firebase
4. Bỏ qua các dự án đã tồn tại (không ghi đè)

### Kết quả

Script sẽ hiển thị:
- ✅ Số dự án đã import thành công
- ❌ Số dự án bị lỗi
- ⏭️ Số dự án đã bỏ qua (đã tồn tại)

## Sử dụng Project Service

Sau khi import, bạn có thể sử dụng `projectService` trong code:

```typescript
import { 
  getAllProjects, 
  getProjects, 
  getProjectById,
  addProject,
  updateProject,
  deleteProject 
} from '@/lib/projectService';

// Lấy tất cả dự án
const projects = await getAllProjects();

// Lấy dự án với filter và pagination
const { projects, total, hasMore } = await getProjects(
  {
    city: 'Đà Nẵng',
    district: 'An Hải Bắc',
    searchTerm: 'Capital Square'
  },
  { page: 1, pageSize: 10 }
);

// Lấy một dự án theo ID
const project = await getProjectById('project-id');

// Thêm dự án mới
const projectId = await addProject(projectData);

// Cập nhật dự án
await updateProject('project-id', { projectName: 'New Name' });

// Xóa dự án
await deleteProject('project-id');
```

## Filter Options

Bạn có thể filter projects theo:
- `city`: Thành phố
- `district`: Quận/Huyện
- `investor`: Chủ đầu tư
- `legalStatus`: Trạng thái pháp lý
- `searchTerm`: Tìm kiếm trong tên, slogan, summary, địa chỉ
- `minPrice`: Giá tối thiểu (triệu/m²)
- `maxPrice`: Giá tối đa (triệu/m²)

## Cấu hình Firestore Rules

Nếu gặp lỗi "Missing or insufficient permissions", bạn cần cấu hình Firestore Rules:

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Firestore Database** > **Rules**
4. Cập nhật rules như sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cho phép đọc/ghi projects (tạm thời cho development)
    // Trong production, nên thêm authentication
    match /projects/{projectId} {
      allow read, write: if true;
    }
    
    // Cho phép đọc/ghi contacts (nếu cần)
    match /contacts/{contactId} {
      allow read, write: if true;
    }
  }
}
```

**Lưu ý bảo mật**: Rules trên cho phép mọi người đọc/ghi. Trong production, bạn nên:
- Thêm authentication
- Chỉ cho phép đọc công khai, ghi cần authentication
- Hoặc sử dụng Firebase Admin SDK cho server-side operations

## Lưu ý

- Script sẽ không ghi đè dữ liệu đã tồn tại
- Nếu muốn import lại, bạn cần xóa dữ liệu cũ trong Firebase Console trước
- Đảm bảo Firebase config trong script khớp với config trong `src/lib/firebase.ts`
- Đảm bảo Firestore Rules đã được cấu hình đúng


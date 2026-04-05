# Template Schema Notes

Ghi chú này giải thích 3 phần trong `src/models/template.model.js`:
- `templateFieldSchema`
- `templateSectionConfigSchema`
- `renderMeta`

---

## 1) `templateFieldSchema` là gì và dùng để làm gì?

`templateFieldSchema` mô tả **một field UI** bên trong một section của template.

### Ý nghĩa các thuộc tính
- `key`: key map trực tiếp vào data CV (ví dụ: `fullName`, `jobTitle`, `skillName`).
- `label`: nhãn hiển thị trên form.
- `placeholder`: gợi ý input cho user.
- `inputType`: gợi ý frontend render control (`text`, `textarea`, `select`, ...).
- `required`: field có bắt buộc theo template hay không.
- `isVisible`: field có hiển thị hay không.
- `options`: danh sách option, thường dùng cho `select`.
- `defaultValue`: giá trị mặc định khi tạo CV mới từ template.

### Mục đích
- Frontend có thể render form động theo template, không cần hardcode từng template.
- Backend có thể dùng `defaultValue` để prefill dữ liệu khi tạo CV mới.

---

## 2) `templateSectionConfigSchema` là gì và dùng để làm gì?

`templateSectionConfigSchema` mô tả **config cấp section** (ví dụ: `personalInfo`, `experiences`, `skills`...).

### Ý nghĩa các thuộc tính
- `sectionKey`: section nào đang được config (có enum để tránh sai tên).
- `fields`: danh sách field bên trong section (dùng `templateFieldSchema`).
- `minItems`: số item tối thiểu (cho section dạng array).
- `maxItems`: số item tối đa (cho section dạng array).
- `defaultEntries`: dữ liệu entry mặc định cho section dạng array.

### Mục đích
- Định nghĩa cấu trúc nội dung từng section một cách linh hoạt.
- Hỗ trợ khởi tạo CV mới theo template:
  - `personalInfo` lấy default từ `fields[].defaultValue`.
  - section dạng mảng (`skills`, `experiences`, ...) lấy default từ `defaultEntries`.

---

## 3) `renderMeta` là gì và dùng để làm gì?

`renderMeta` là metadata phục vụ việc render template (chủ yếu cho frontend/pipeline export).

### Thường gồm
- `variant`: biến thể template (ví dụ: `clean`, `modern-grid`).
- `supportsPhoto`: template có hỗ trợ ảnh đại diện hay không.
- `tokens`: design tokens (màu, font key, spacing key...).

### Mục đích
- Backend lưu thông tin render để frontend sử dụng nhất quán.
- Khi tạo CV, backend snapshot metadata này vào CV để CV cũ vẫn ổn định ngay cả khi template gốc thay đổi.

---

## Tóm tắt nhanh

- `sections` / `layout.sections`: quyết định bố cục (thứ tự, ẩn/hiện section).
- `fieldConfig` (`templateSectionConfigSchema` + `templateFieldSchema`): quyết định field bên trong section.
- `renderMeta`: thông tin phục vụ render giao diện/template style.

Ba lớp này kết hợp lại giúp backend quản lý template-first flow đầy đủ:
- User chọn template.
- Tạo CV mới theo template đó.
- CV có dữ liệu/bố cục ban đầu hợp lệ để tiếp tục CRUD từng section.

# react-file-upload-ui

React File Upload UI — a small, customizable React component for file uploads.

## Installation

Install as a peer dependency alongside `react` and `react-dom`:

```bash
npm install react-file-upload-ui
```

or with pnpm:

```bash
pnpm add react-file-upload-ui
```

## Usage

```tsx
import ReactFileUploaderUI from "react-file-upload-ui";

export default function App() {
  const handleFilesSelected = (files) => {
    console.log("Selected files:", files);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <ReactFileUploaderUI
        accept="image/*"
        maxSize={10 * 1024 * 1024}
        maxFiles={10}
        onFilesSelected={handleFilesSelected}
      />
    </div>
  );
}
```

## Props

| Prop              | Type                           | Default    | Description                                     |
| ----------------- | ------------------------------ | ---------- | ----------------------------------------------- |
| `accept`          | `string`                       | -          | File types to accept (e.g., "image/\*", ".pdf") |
| `multiple`        | `boolean`                      | `true`     | Allow multiple file selection                   |
| `maxSize`         | `number`                       | `10485760` | Maximum file size in bytes (default: 10MB)      |
| `maxFiles`        | `number`                       | `10`       | Maximum number of files                         |
| `onFilesSelected` | `(files: IFileData[]) => void` | -          | Callback when files are selected                |
| `onError`         | `(error: string) => void`      | -          | Callback when an error occurs                   |
| `disabled`        | `boolean`                      | `false`    | Disable the file uploader                       |
| `className`       | `string`                       | `""`       | Additional CSS classes                          |
| `classNames`      | `UIClassNames`                 | `{}`       | Custom classes for sub-components               |
| `defaultFiles`    | `IFileData[]`                  | -          | Pre-populate with default files                 |

### UIClassNames Interface

```typescript
interface UIClassNames {
  container?: string; // Main wrapper
  dropzone?: string; // Drop zone area
  label?: string; // Label inside drop zone
  fileList?: string; // File list container
  fileListContainer?: string; // Top section of file list
  thumbnailStrip?: string; // Container for thumbnails
  thumbnail?: string; // Individual thumbnail wrapper
  error?: string; // Error message container
  progressBar?: string; // Progress bar container
}
```

---

License: MIT

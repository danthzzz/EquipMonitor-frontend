import '@testing-library/jest-dom/vitest';

// jsdom has no object URLs; photo thumbnails only need a string.
if (!URL.createObjectURL) {
  URL.createObjectURL = () => 'blob:test';
  URL.revokeObjectURL = () => {};
}

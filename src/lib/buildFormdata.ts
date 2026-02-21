export const buildFormData = (data: Record<string, any>) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      // If value is a File, append it as-is
      if (value instanceof File) {
        fd.append(key, value, value.name);
      } else {
        fd.append(key, value);
      }
    }
  });
  return fd;
};
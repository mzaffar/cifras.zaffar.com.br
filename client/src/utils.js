export const slugToCamelCase = (slug) => {
  const withSpaces = slug.replace(/-/g, " ");
  const formatted = withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
  return formatted;
};

export const filePathToMusicName = (file_path, artist) => {
  const withoutExtension = file_path.replace(".json", "");
  const withoutFolder = withoutExtension.replace(`${artist}/`, "");
  return slugToCamelCase(withoutFolder);
};

export const filePathToUrl = (file_path) => {
  return file_path.replace(".json", "");
};

export const fontSizes = ["text-xs", "text-sm", "text-base", "text-lg"];

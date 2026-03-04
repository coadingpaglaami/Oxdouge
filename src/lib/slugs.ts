export const slugify = (text: string) => {
  return (
    text
      .toLowerCase()
      .trim()

      // convert special characters
      .replace(/&/g, "and")

      // convert dots to dash (2.5L → 2-5l)
      .replace(/\./g, "-")

      // remove quotes
      .replace(/["']/g, "")

      // replace all non-word characters with dash
      .replace(/[^a-z0-9]+/g, "-")

      // remove starting dash
      .replace(/^-+/, "")

      // remove ending dash
      .replace(/-+$/, "")

      // remove multiple dashes
      .replace(/--+/g, "-")

      // optional: limit slug length for SEO
      .slice(0, 80)
  );
};

const truncateHTML = (html: string, maxLength: number): string => {
  if (!html) return "";
  return html.length > maxLength ? `${html.slice(0, maxLength)}...` : html;
};

export default truncateHTML;

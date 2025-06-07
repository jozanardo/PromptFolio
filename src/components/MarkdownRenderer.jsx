export default function MarkdownRenderer({ html }) {
  return (
    <div
      className="markdown prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

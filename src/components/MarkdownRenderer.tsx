import React from 'react';

export interface MarkdownRendererProps {
  html: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ html }) => (
  <div
    className="markdown prose prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default MarkdownRenderer;

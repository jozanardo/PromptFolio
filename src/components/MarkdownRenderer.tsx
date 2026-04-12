import React from 'react';

export interface MarkdownRendererProps {
  html: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ html }) => (
  <div
    className="markdown"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default MarkdownRenderer;

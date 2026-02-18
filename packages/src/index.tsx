// @ts-ignore
import React, { useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link, Image, Code, Quote, Heading1, Heading2,
  Plus, Trash2, GripVertical, Columns, Type, Settings, Eye
} from 'lucide-react';

export type Block = {
  id: number;
  type: string;
  content: string;
  columns?: number;
  columnContent?: string[] | null;
};

export default function WordPressStyleEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'paragraph', content: 'Start writing...', columns: 1 }
  ]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState<number | null>(null);

  const addBlock = (afterId: number, type = 'paragraph', columns = 1) => {
    const newBlock: Block = {
      id: Date.now(),
      type,
      content: type === 'image' ? '' : 'New block...',
      columns,
      columnContent: columns > 1 ? Array(columns).fill('Column content...') : null
    };
    
    const index = blocks.findIndex(b => b.id === afterId);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setShowBlockMenu(null);
  };

  const updateBlock = (id: number, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: number) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
      setSelectedBlock(null);
    }
  };

  const moveBlock = (id: number, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) {
      return;
    }
    
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const BlockMenu: React.FC<{ blockId: number; position?: string }> = ({ blockId, position }) => (
    <div className="block-menu" style={{ top: position }}>
      <h3>Add Block</h3>
      <div className="block-options">
        <button onClick={() => addBlock(blockId, 'paragraph', 1)}>
          <Type size={20} />
          <span>Paragraph</span>
        </button>
        <button onClick={() => addBlock(blockId, 'heading', 1)}>
          <Heading1 size={20} />
          <span>Heading</span>
        </button>
        <button onClick={() => addBlock(blockId, 'image', 1)}>
          <Image size={20} />
          <span>Image</span>
        </button>
        <button onClick={() => addBlock(blockId, 'quote', 1)}>
          <Quote size={20} />
          <span>Quote</span>
        </button>
        <button onClick={() => addBlock(blockId, 'code', 1)}>
          <Code size={20} />
          <span>Code</span>
        </button>
        <button onClick={() => addBlock(blockId, 'columns', 2)}>
          <Columns size={20} />
          <span>2 Columns</span>
        </button>
        <button onClick={() => addBlock(blockId, 'columns', 3)}>
          <Columns size={20} />
          <span>3 Columns</span>
        </button>
      </div>
    </div>
  );

  const BlockToolbar: React.FC<{ block: Block }> = ({ block }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    const execCommand = (command: string, value: string | null = null) => {
      document.execCommand(command, false, value as any);
    };

    return (
      <div className="block-toolbar">
        <button onClick={() => execCommand('bold')} title="Bold">
          <Bold size={16} />
        </button>
        <button onClick={() => execCommand('italic')} title="Italic">
          <Italic size={16} />
        </button>
        <button onClick={() => execCommand('underline')} title="Underline">
          <Underline size={16} />
        </button>
        <div className="toolbar-divider"></div>
        <button onClick={() => execCommand('justifyLeft')} title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button onClick={() => execCommand('justifyCenter')} title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button onClick={() => execCommand('justifyRight')} title="Align Right">
          <AlignRight size={16} />
        </button>
        <div className="toolbar-divider"></div>
        <button onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <List size={16} />
        </button>
        <button onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </button>
      </div>
    );
  };

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlock === block.id;

    if (block.type === 'columns') {
      return (
        <div className={`column-block ${isSelected ? 'selected' : ''}`}>
          <div className="column-container" style={{ gridTemplateColumns: `repeat(${block.columns}, 1fr)` }}>
            {Array((block.columns || 1)).fill(0).map((_, colIndex) => (
              <div key={colIndex} className="column">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e: React.FormEvent<HTMLDivElement>) => {
                    const newContent = [...(block.columnContent || [])];
                    newContent[colIndex] = (e.currentTarget as HTMLElement).innerHTML;
                    updateBlock(block.id, { columnContent: newContent });
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: block.columnContent?.[colIndex] || 'Column content...' 
                  }}
                  className="column-content"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === 'image') {
      return (
        <div className="image-block">
          {block.content ? (
            <img src={block.content} alt="Block" />
          ) : (
            <div className="image-placeholder">
              <Image size={48} />
              <p>Add image URL</p>
                <input
                type="text"
                placeholder="https://example.com/image.jpg"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateBlock(block.id, { content: e.currentTarget.value })}
              />
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'code') {
      return (
        <div className="code-block">
          <textarea
            value={block.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateBlock(block.id, { content: e.currentTarget.value })}
            placeholder="// Enter your code here"
          />
        </div>
      );
    }

    const tagMap: Record<string, any> = {
      paragraph: 'p',
      heading: 'h2',
      quote: 'blockquote'
    };

    const Tag: any = (tagMap as Record<string, any>)[block.type] || 'p';

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onInput={(e: React.FormEvent<HTMLDivElement>) => updateBlock(block.id, { content: (e.currentTarget as HTMLElement).innerHTML })}
        dangerouslySetInnerHTML={{ __html: block.content }}
        className={`block-content ${block.type}`}
      />
    );
  };

  const exportHTML = () => {
    let html = '';
    blocks.forEach(block => {
      if (block.type === 'columns') {
        html += `<div class="columns" style="display: grid; grid-template-columns: repeat(${block.columns}, 1fr); gap: 2rem;">`;
        block.columnContent?.forEach(content => {
          html += `<div>${content}</div>`;
        });
        html += '</div>';
      } else if (block.type === 'image') {
        html += `<img src="${block.content}" alt="Blog image" />`;
      } else if (block.type === 'code') {
        html += `<pre><code>${block.content}</code></pre>`;
      } else {
        const tagMap: Record<string, string> = { paragraph: 'p', heading: 'h2', quote: 'blockquote' };
        const tag = (tagMap as Record<string, string>)[block.type] || 'p';
        html += `<${tag}>${block.content}</${tag}>`;
      }
    });
    return html;
  };

  return (
    <div className="wordpress-editor">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #f0f0f1;
          min-height: 100vh;
          padding: 0;
        }

        .wordpress-editor {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 0;
          min-height: 100vh;
        }

        .editor-main {
          background: white;
          position: relative;
        }

        .editor-header {
          background: white;
          border-bottom: 1px solid #ddd;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .editor-title-input {
          font-size: 2.5rem;
          font-weight: 700;
          border: none;
          outline: none;
          width: 100%;
          padding: 1rem 0;
          font-family: 'Inter', sans-serif;
          color: #1e1e1e;
        }

        .editor-title-input::placeholder {
          color: #ccc;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:hover {
          background: #f6f7f7;
          border-color: #999;
        }

        .btn-primary {
          background: #2271b1;
          color: white;
          border-color: #2271b1;
        }

        .btn-primary:hover {
          background: #135e96;
          border-color: #135e96;
        }

        .editor-canvas {
          max-width: 840px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .title-section {
          margin-bottom: 2rem;
        }

        .block-wrapper {
          position: relative;
          margin: 1.5rem 0;
          transition: all 0.2s;
        }

        .block-wrapper:hover {
          outline: 1px solid #007cba;
          outline-offset: -1px;
        }

        .block-wrapper.selected {
          outline: 2px solid #007cba;
          outline-offset: -2px;
        }

        .block-controls {
          position: absolute;
          left: -48px;
          top: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .block-wrapper:hover .block-controls {
          opacity: 1;
        }

        .block-control-btn {
          width: 32px;
          height: 32px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .block-control-btn:hover {
          background: #f6f7f7;
          border-color: #007cba;
        }

        .block-content {
          padding: 1rem;
          outline: none;
          min-height: 3rem;
          line-height: 1.8;
          color: #1e1e1e;
        }

        .block-content.paragraph {
          font-size: 1rem;
        }

        .block-content.heading {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .block-content.quote {
          border-left: 4px solid #007cba;
          padding-left: 1.5rem;
          font-style: italic;
          color: #555;
        }

        .column-block {
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .column-container {
          display: grid;
          gap: 2rem;
        }

        .column {
          background: #f9f9f9;
          border: 1px dashed #ddd;
          border-radius: 4px;
          min-height: 150px;
        }

        .column-content {
          padding: 1rem;
          outline: none;
          min-height: 150px;
          line-height: 1.6;
        }

        .image-block {
          padding: 1rem;
          text-align: center;
        }

        .image-block img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }

        .image-placeholder {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 3rem;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #666;
        }

        .image-placeholder input {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .code-block {
          margin: 1.5rem 0;
        }

        .code-block textarea {
          width: 100%;
          min-height: 200px;
          padding: 1rem;
          background: #1e1e1e;
          color: #d4d4d4;
          border: none;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
          outline: none;
        }

        .add-block-button {
          width: 100%;
          padding: 1rem;
          border: 2px dashed #ddd;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #666;
          font-weight: 500;
          transition: all 0.2s;
          margin: 0.5rem 0;
        }

        .add-block-button:hover {
          border-color: #007cba;
          color: #007cba;
          background: #f0f6fc;
        }

        .block-menu {
          position: absolute;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 1rem;
          z-index: 1000;
          min-width: 280px;
          left: 50%;
          transform: translateX(-50%);
        }

        .block-menu h3 {
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .block-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .block-options button {
          padding: 0.75rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .block-options button:hover {
          background: #f0f6fc;
          border-color: #007cba;
          color: #007cba;
        }

        .block-toolbar {
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.25rem;
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .block-toolbar button {
          padding: 0.5rem;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .block-toolbar button:hover {
          background: #f0f0f1;
        }

        .toolbar-divider {
          width: 1px;
          background: #ddd;
          margin: 0 0.25rem;
        }

        .sidebar {
          background: white;
          border-left: 1px solid #ddd;
          padding: 1.5rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        .sidebar h3 {
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .sidebar-section {
          margin-bottom: 2rem;
        }

        .block-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .block-list-item {
          padding: 0.75rem;
          background: #f9f9f9;
          border-radius: 4px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .block-list-item:hover {
          background: #f0f6fc;
        }

        @media (max-width: 1200px) {
          .wordpress-editor {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }

          .block-controls {
            left: -40px;
          }
        }
      `}</style>

      <div className="editor-main">
        <div className="editor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>WordPress-Style Editor</h1>
          </div>
          <div className="header-actions">
            <button className="btn">
              <Eye size={18} />
              Preview
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => {
                const html = exportHTML();
                console.log('Exported HTML:', html);
                alert('Content exported! Check console for HTML.');
              }}
            >
              Publish
            </button>
          </div>
        </div>

        <div className="editor-canvas">
          <div className="title-section">
            <input
              type="text"
              className="editor-title-input"
              placeholder="Add title"
            />
          </div>

          {blocks.map((block, index) => (
            <div key={block.id}>
              <div
                className={`block-wrapper ${selectedBlock === block.id ? 'selected' : ''}`}
                onClick={() => setSelectedBlock(block.id)}
              >
                <div className="block-controls">
                  <button 
                    className="block-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlock(block.id, 'up');
                    }}
                  >
                    ↑
                  </button>
                  <button 
                    className="block-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveBlock(block.id, 'down');
                    }}
                  >
                    ↓
                  </button>
                  <button 
                    className="block-control-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {selectedBlock === block.id && block.type !== 'image' && block.type !== 'code' && (
                  <BlockToolbar block={block} />
                )}

                {renderBlock(block)}
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  className="add-block-button"
                  onClick={() => setShowBlockMenu(showBlockMenu === block.id ? null : block.id)}
                >
                  <Plus size={20} />
                  Add Block
                </button>
                {showBlockMenu === block.id && (
                  <BlockMenu blockId={block.id} position="100%" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-section">
          <h3>Document</h3>
          <div className="block-list">
            <div className="block-list-item">
              <Type size={16} />
              Blocks: {blocks.length}
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Quick Add</h3>
          <div className="block-list">
            <div className="block-list-item" onClick={() => addBlock(blocks[blocks.length - 1].id, 'paragraph')}>
              <Type size={16} />
              Paragraph
            </div>
            <div className="block-list-item" onClick={() => addBlock(blocks[blocks.length - 1].id, 'heading')}>
              <Heading1 size={16} />
              Heading
            </div>
            <div className="block-list-item" onClick={() => addBlock(blocks[blocks.length - 1].id, 'image')}>
              <Image size={16} />
              Image
            </div>
            <div className="block-list-item" onClick={() => addBlock(blocks[blocks.length - 1].id, 'columns', 2)}>
              <Columns size={16} />
              2 Columns
            </div>
            <div className="block-list-item" onClick={() => addBlock(blocks[blocks.length - 1].id, 'columns', 3)}>
              <Columns size={16} />
              3 Columns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
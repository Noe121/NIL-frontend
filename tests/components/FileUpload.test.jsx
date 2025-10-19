import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../../src/components/FileUpload.jsx';
import * as responsiveUtils from '../../src/utils/responsive.jsx';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }) => children
}));

// Mock responsive utilities
vi.mock('../../src/utils/responsive.jsx', () => ({
  useScreenSize: () => ({ isMobile: false, isTablet: false }),
  useTouchGestures: vi.fn()
}));

// Mock accessibility utilities
vi.mock('../../src/utils/accessibility.js', () => ({
  getAccessibilityProps: (props) => props
}));

// Mock File and FileReader
global.File = class File {
  constructor(parts, filename, properties = {}) {
    this.name = filename;
    this.size = parts.reduce((acc, part) => acc + part.length, 0);
    this.type = properties.type || '';
    this.lastModified = properties.lastModified || Date.now();
  }
};

global.FileReader = class FileReader {
  constructor() {
    this.result = null;
    this.onload = null;
    this.onloadend = null;
    this.onerror = null;
  }

  readAsDataURL(file) {
    // Synchronous for tests - set result and call onloadend immediately
    this.result = `data:${file.type};base64,mock-base64-data`;
    if (this.onloadend) {
      this.onloadend({ target: this });
    }
  }
};

// Mock XMLHttpRequest for upload testing
global.XMLHttpRequest = class XMLHttpRequest {
  constructor() {
    this.upload = {
      onprogress: null,
    };
    this.onload = null;
    this.onerror = null;
    this.status = 200;
    this.responseText = '{"success": true}';
  }

  open() {}
  setRequestHeader() {}
  send() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 10);
  }
};

describe('FileUpload Component', () => {
  const mockOnFileSelect = vi.fn();
  const mockOnUpload = vi.fn();
  const mockOnProgress = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
    mockOnUpload.mockClear();
    mockOnProgress.mockClear();
    mockOnError.mockClear();
  });

  it('renders upload area with default props', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    expect(screen.getByText('Click to select files or drag and drop')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect} 
        label="Upload Documents"
      />
    );

    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect} 
        description="Only PDF files allowed"
      />
    );

    expect(screen.getByText('Only PDF files allowed')).toBeInTheDocument();
  });

  it('displays file restrictions', () => {
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        accept="image/*"
        maxSize={5 * 1024 * 1024}
        maxFiles={3}
      />
    );

    expect(screen.getByText('Accepted types: image/*')).toBeInTheDocument();
    expect(screen.getByText('Max size: 5 MB')).toBeInTheDocument();
    expect(screen.getByText('Max files: 3')).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
  });

  it('validates file size', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        maxSize={10} // 10 bytes
      />
    );

    const file = new File(['this is a large file content'], 'large.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnError).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('File size exceeds')])
    );
  });

  it('validates file type', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        accept="image/*"
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnError).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('File type not accepted')])
    );
  });

  it('enforces maximum file count', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload 
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        maxFiles={1}
        multiple
      />
    );

    const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    // Upload first file
    fireEvent.change(input, { target: { files: [file1] } });
    
    // Try to upload second file (should fail)
    fireEvent.change(input, { target: { files: [file1, file2] } });

    expect(mockOnError).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('Maximum 1 files allowed')])
    );
  });

  it('displays selected files', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });
  });

  it.skip('shows file preview for images', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={mockOnFileSelect} showPreview />);

    const file = new File(['image data'], 'image.jpg', { type: 'image/jpeg' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      // Check preview image appears
      const previewImg = screen.getByAltText('');
      expect(previewImg).toBeInTheDocument();
      expect(previewImg).toHaveAttribute('src', expect.stringContaining('data:image/jpeg;base64'));

      // Check preview accessibility
      const previewContainer = previewImg.parentElement;
      expect(previewContainer).toHaveAttribute('aria-label', 'Preview of image.jpg');
    });
  });

  it('allows file removal', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    const removeButton = screen.getByLabelText('Remove test.txt');
    await user.click(removeButton);

    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
  });

  it('clears all files', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
  });
});

describe('FileUpload Drag and Drop', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('handles drag enter and leave events', async () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} allowDragDrop />);

    const dropArea = screen.getByRole('button');
    
    // Test drag enter
    fireEvent.dragEnter(dropArea, {
      dataTransfer: { types: ['Files'] }
    });

    expect(dropArea).toHaveAttribute('data-dragging', 'true');
    expect(screen.getByText('Drop files here')).toBeInTheDocument();

    // Test drag leave
    fireEvent.dragLeave(dropArea, {
      dataTransfer: { types: ['Files'] }
    });

    await waitFor(() => {
      expect(dropArea).not.toHaveAttribute('data-dragging');
      expect(screen.queryByText('Drop files here')).not.toBeInTheDocument();
    });
  });

  it('handles file drop', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} allowDragDrop />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const dropArea = screen.getByRole('button');
    
    fireEvent.drop(dropArea, {
      dataTransfer: {
        files: [file]
      }
    });

    expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
  });

  it('shows drop indicator when dragging', () => {
    render(<FileUpload onFileSelect={mockOnFileSelect} allowDragDrop />);

    const dropArea = screen.getByRole('button');
    fireEvent.dragEnter(dropArea);

    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });
});

describe('FileUpload Auto Upload', () => {
  const mockOnUpload = vi.fn();
  const mockOnProgress = vi.fn();

  beforeEach(() => {
    mockOnUpload.mockClear();
    mockOnProgress.mockClear();
  });

  it('automatically uploads files and handles errors when autoUpload is true', async () => {
    const user = userEvent.setup();
    const mockError = vi.fn();
    
    render(
      <FileUpload 
        onFileSelect={vi.fn()}
        onUpload={mockOnUpload}
        onProgress={mockOnProgress}
        onError={mockError}
        autoUpload
        uploadEndpoint="/upload"
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
      expect(mockOnProgress).toHaveBeenCalledWith(expect.any(Number), 50);
    });
  });

  it('shows upload progress', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload 
        onFileSelect={vi.fn()}
        onProgress={mockOnProgress}
        onUpload={mockOnUpload}
        autoUpload
        uploadEndpoint="/upload"
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    // Wait for upload to start and progress bar to appear
    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-label', expect.stringContaining('Upload progress for test.txt'));
    }, { timeout: 200 });

    // Verify progress callback was called
    expect(mockOnProgress).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
  });

  it('shows upload button when not auto uploading', async () => {
    const user = userEvent.setup();
    
    render(
      <FileUpload 
        onFileSelect={vi.fn()}
        uploadEndpoint="/upload"
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Upload Files')).toBeInTheDocument();
    });
  });
});

describe('FileUpload Mobile Responsiveness', () => {
  it('adapts text for mobile', () => {
    // Temporarily modify the mock for this test
    const originalMock = vi.mocked(responsiveUtils.useScreenSize);
    responsiveUtils.useScreenSize = vi.fn(() => ({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    }));

    render(<FileUpload onFileSelect={vi.fn()} />);

    expect(screen.getByText('Tap to select files')).toBeInTheDocument();
    expect(screen.queryByText('Click to select files or drag and drop')).not.toBeInTheDocument();

    // Restore original mock
    responsiveUtils.useScreenSize = originalMock;
  });

  it('maintains touch-friendly interactions', () => {
    // Temporarily modify the mock for this test
    const originalMock = vi.mocked(responsiveUtils.useScreenSize);
    responsiveUtils.useScreenSize = vi.fn(() => ({
      isMobile: true,
      isTablet: false,
      isDesktop: false
    }));

    render(<FileUpload onFileSelect={vi.fn()} />);

    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveAttribute('data-mobile', 'true');
    // Note: minHeight is handled by CSS classes, not inline styles

    // Restore original mock
    responsiveUtils.useScreenSize = originalMock;
  });
});

describe('FileUpload Accessibility', () => {
  it('has proper ARIA labels', () => {
    render(<FileUpload onFileSelect={vi.fn()} />);

    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveAttribute('aria-label');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={vi.fn()} />);

    const uploadArea = screen.getByRole('button');
    uploadArea.focus();
    
    expect(uploadArea).toHaveFocus();
    
    await user.keyboard('{Enter}');
    // Should trigger file selection
  });

  it('has proper focus management', async () => {
    const user = userEvent.setup();
    
    render(<FileUpload onFileSelect={vi.fn()} />);

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByRole('button').querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const removeButton = screen.getByLabelText('Remove test.txt');
      expect(removeButton).toBeInTheDocument();
    });
  });
});
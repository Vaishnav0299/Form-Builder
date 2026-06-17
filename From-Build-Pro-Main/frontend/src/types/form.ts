export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'number'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'image'
  | 'header_image'
  | 'document';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FieldOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    maxFileSize?: number; // in MB
    allowedFileTypes?: string[]; // e.g., ['image/png', 'image/jpeg']
  };
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  headerImage?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  shareUrl?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
}

export const FIELD_TYPES: { type: FieldType; label: string; icon: string }[] = [
  { type: 'short_text', label: 'Short Text', icon: 'Type' },
  { type: 'long_text', label: 'Long Text', icon: 'AlignLeft' },
  { type: 'email', label: 'Email', icon: 'Mail' },
  { type: 'number', label: 'Number', icon: 'Hash' },
  { type: 'dropdown', label: 'Dropdown', icon: 'ChevronDown' },
  { type: 'radio', label: 'Radio Buttons', icon: 'Circle' },
  { type: 'checkbox', label: 'Checkboxes', icon: 'CheckSquare' },
  { type: 'date', label: 'Date', icon: 'Calendar' },
  { type: 'image', label: 'Image Upload', icon: 'Image' },
  { type: 'header_image', label: 'Header image', icon: 'Image' },
  { type: 'document', label: 'Document Upload', icon: 'FileText' },
];

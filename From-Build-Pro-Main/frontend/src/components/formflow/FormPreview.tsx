import API from '@/services/api';
import { Form, FormField } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send, Smartphone, Monitor, Upload, Image, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FormPreviewProps {
  title: string;
  description: string;
  fields: FormField[];
  headerImage?: string;
}

export function FormPreview({ title, description, fields, headerImage }: FormPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [dateValues, setDateValues] = useState<Record<string, Date | undefined>>({});

  const updateField = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

// ✅ ADD HERE 👇
const validateForm = () => {
  for (const field of fields) {
    const value = formData[field.id];
    const validation = field.validation || {};

    // ✅ REQUIRED
   if (
  field.required &&
  (!value || (Array.isArray(value) && value.length === 0))
)

    // ✅ SHORT / LONG TEXT
    if (['short_text', 'long_text'].includes(field.type) && value) {
      if (validation.minLength && value.length < validation.minLength) {
        alert(`${field.label} must be at least ${validation.minLength} characters`);
        return false;
      }

      if (validation.maxLength && value.length > validation.maxLength) {
        alert(`${field.label} must be less than ${validation.maxLength} characters`);
        return false;
      }
    }

    // ✅ NUMBER
    if (field.type === 'number' && value) {
      const num = Number(value);

      if (validation.min !== undefined && num < validation.min) {
        alert(`${field.label} must be >= ${validation.min}`);
        return false;
      }

      if (validation.max !== undefined && num > validation.max) {
        alert(`${field.label} must be <= ${validation.max}`);
        return false;
      }
    }
  }

  return true;
};

  //Change
  {/*const handleFileChange = (field: FormField, file?: File) => {
  if (!file) return;

  // 🔒 File size validation
  if (field.validation?.maxFileSize) {
    const maxBytes = field.validation.maxFileSize * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("File too large");
      return;
    }
  }

  // 🔒 File type validation
  if (field.validation?.allowedFileTypes) {
    if (!field.validation.allowedFileTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }
  }

  // ✅ Store file in state
  updateField(field.id, file);
};*/}
const handleFileChange = async (field: FormField, file?: File) => {
  if (!file) return;

  // 🔒 File size validation
  if (field.validation?.maxFileSize) {
    const maxBytes = field.validation.maxFileSize * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("File too large");
      return;
    }
  }

  // 🔒 File type validation
  if (field.validation?.allowedFileTypes) {
    if (!field.validation.allowedFileTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }
  }

   try {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const res = await API.post("/upload", formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ store URL instead of File
    updateField(field.id, res.data.url);

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};

// Change


  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'short_text':
        return (
          <Input
            placeholder={field.placeholder || 'Your answer'}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="preview-input"
          />
        );

      case 'long_text':
        return (
          <Textarea
            placeholder={field.placeholder || 'Your answer'}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="preview-input min-h-[100px] resize-none"
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder || 'email@example.com'}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="preview-input"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || '0'}
            value={formData[field.id] || ''}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="preview-input"
          />
        );

      case 'dropdown':
        return (
          <Select
            value={formData[field.id] || ''}
            onValueChange={(value) => updateField(field.id, value)}
          >
            <SelectTrigger className="preview-input">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={formData[field.id] || ''}
            onValueChange={(value) => updateField(field.id, value)}
            className="space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={`${field.id}-${option.id}`} />
                <Label
                  htmlFor={`${field.id}-${option.id}`}
                  className="font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => {
              const checked = (formData[field.id] || []).includes(option.value);
              return (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${field.id}-${option.id}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const current = formData[field.id] || [];
                      if (isChecked) {
                        updateField(field.id, [...current, option.value]);
                      } else {
                        updateField(field.id, current.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`${field.id}-${option.id}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal preview-input',
                  !dateValues[field.id] && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValues[field.id] ? format(dateValues[field.id]!, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValues[field.id]}
                onSelect={(date) => {
                  setDateValues(prev => ({ ...prev, [field.id]: date }));
                  updateField(field.id, date?.toISOString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      /*case 'image':
        return (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Image className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Upload an image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
              <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        );
        */
      case 'image':
  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleFileChange(field, e.target.files?.[0])
        }
      />

      {formData[field.id] && (
        <img
          src={formData[field.id]}
          alt="preview"
          className="w-32 h-32 object-cover rounded"
        />
      )}
    </div>
  );


      /*case 'document':
        return (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Upload a document</p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        );
        */
     case 'document':
  return (
    <div className="space-y-2">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={(e) =>
          handleFileChange(field, e.target.files?.[0])
        }
      />

      {formData[field.id] && (
        <p className="text-sm text-muted-foreground">
          Selected: {formData[field.id].name}
        </p>
      )}
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="form-builder-panel flex flex-col h-full">
      {/* Preview Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Preview
        </h3>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
        <div className={cn(
          'mx-auto transition-all duration-300',
          viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
        )}>
          <div className="bg-card rounded-xl border border-border overflow-hidden liftup-shadow">
            {headerImage && (
              <div className="w-full h-32 relative overflow-hidden">
                <img
                  src={headerImage}
                  alt="Form Header"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Form Header */}
<div className="liftup-gradient p-6">

  <h2 className="text-xl font-bold text-foreground">
    {title || 'Untitled Form'}
  </h2>

  {description && (
    <p className="mt-2 text-sm text-muted-foreground">
      {description}
    </p>
  )}

</div>

            {/* Form Fields */}
            <div className="p-6 space-y-6">
              {fields.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Add fields to see the preview
                </p>
              ) : (
                fields.map((field) => (
                  <div key={field.id} className="preview-field animate-fade-in">
                    <Label className="preview-label">
                      {field.label || 'Untitled Question'}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </Label>
                    {renderField(field)}
                  </div>
                ))
              )}

              {fields.length > 0 && (
               <Button
  className="w-full liftup-gradient text-primary-foreground border-0 h-11"
  onClick={() => {
    if (!validateForm()) return;

    console.log("SUBMITTING:", formData);
    alert("Form submitted ✅");
  }}
>
  <Send className="w-4 h-4 mr-2" />
  Submit
</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

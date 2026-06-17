import { FormField, FieldOption } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FieldEditorProps {
  field: FormField | null;
  onUpdateField: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

export function FieldEditor({ field, onUpdateField, onClose }: FieldEditorProps) {
 
  if (!field) {
    return (
      <div className="form-builder-panel p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
          Field Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Select a field to edit its properties
        </p>
      </div>
    );
  }

  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(field.type);

  const addOption = () => {
    const newOption: FieldOption = {
      id: uuidv4(),
      label: `Option ${(field.options?.length || 0) + 1}`,
      value: `option${(field.options?.length || 0) + 1}`,
    };
    onUpdateField({
      options: [...(field.options || []), newOption],
    });
  };

  const updateOption = (index: number, updates: Partial<FieldOption>) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdateField({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    onUpdateField({ options: newOptions });
  };

  return (
    <div className="form-builder-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Field Settings
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-5">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-sm font-medium">
            Question
          </Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
            placeholder="Enter your question"
            className="h-10"
          />
        </div>

        {/* Placeholder */}
        {!hasOptions && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder" className="text-sm font-medium">
              Placeholder
            </Label>
            <Input
              id="field-placeholder"
              value={field.placeholder || ''}
              onChange={(e) => onUpdateField({ placeholder: e.target.value })}
              placeholder="Placeholder text"
              className="h-10"
            />
          </div>
        )}

        {/* Options for dropdown/radio/checkbox */}
        {hasOptions && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(index, { 
                      label: e.target.value,
                      value: e.target.value.toLowerCase().replace(/\s+/g, '_')
                    })}
                    placeholder={`Option ${index + 1}`}
                    className="h-9 flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeOption(index)}
                    disabled={(field.options?.length || 0) <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addOption}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="field-required" className="text-sm font-medium cursor-pointer">
            Required
          </Label>
          <Switch
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => onUpdateField({ required: checked })}
          />
        </div>

        {/* Validation for text fields */}
        {['short_text', 'long_text'].includes(field.type) && (
          <div className="space-y-3 pt-3 border-t border-border">
            <Label className="text-sm font-medium text-muted-foreground">
              Validation
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="min-length" className="text-xs text-muted-foreground">
                  Min Length
                </Label>
                <Input
                  id="min-length"
                  type="number"
                  min={0}
                  value={field.validation?.minLength || ''}
                  onChange={(e) => onUpdateField({
                    validation: {
                      ...field.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max-length" className="text-xs text-muted-foreground">
                  Max Length
                </Label>
                <Input
                  id="max-length"
                  type="number"
                  min={0}
                  value={field.validation?.maxLength || ''}
                  onChange={(e) => onUpdateField({
                    validation: {
                      ...field.validation,
                      maxLength: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })}
                  className="h-9"
                />
              </div>
            </div>
          </div>
        )}

        {/* Validation for number field */}
        {field.type === 'number' && (
          <div className="space-y-3 pt-3 border-t border-border">
            <Label className="text-sm font-medium text-muted-foreground">
              Validation
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="min-value" className="text-xs text-muted-foreground">
                  Min Value
                </Label>
                <Input
                  id="min-value"
                  type="number"
                  value={field.validation?.min ?? ''}
                  onChange={(e) => onUpdateField({
                    validation: {
                      ...field.validation,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max-value" className="text-xs text-muted-foreground">
                  Max Value
                </Label>
                <Input
                  id="max-value"
                  type="number"
                  value={field.validation?.max ?? ''}
                  onChange={(e) => onUpdateField({
                    validation: {
                      ...field.validation,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  })}
                  className="h-9"
                />
              </div>
            </div>
          </div>
        )}

        {/* Validation for image upload */}
        {field.type === 'image' && (
          <div className="space-y-3 pt-3 border-t border-border">
            <Label className="text-sm font-medium text-muted-foreground">
              File Settings
            </Label>
            <div className="space-y-1.5">
              <Label htmlFor="max-file-size" className="text-xs text-muted-foreground">
                Max File Size (MB)
              </Label>
              <Input
                id="max-file-size"
                type="number"
                min={1}
                max={50}
                value={field.validation?.maxFileSize || ''}
                onChange={(e) => onUpdateField({
                  validation: {
                    ...field.validation,
                    maxFileSize: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })}
                placeholder="10"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Allowed File Types
              </Label>
              <div className="space-y-2">
                {[
                  { label: 'PNG', value: 'image/png' },
                  { label: 'JPEG', value: 'image/jpeg' },
                  { label: 'GIF', value: 'image/gif' },
                  { label: 'WebP', value: 'image/webp' },
                ].map((type) => {
                  const isChecked = field.validation?.allowedFileTypes?.includes(type.value) ?? true;
                  return (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`image-type-${type.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = field.validation?.allowedFileTypes || ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
                          const newTypes = checked
                            ? [...current, type.value]
                            : current.filter((t) => t !== type.value);
                          onUpdateField({
                            validation: {
                              ...field.validation,
                              allowedFileTypes: newTypes.length > 0 ? newTypes : undefined,
                            },
                          });
                        }}
                      />
                      <Label
                        htmlFor={`image-type-${type.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {type.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Validation for document upload */}
        {field.type === 'document' && (
          <div className="space-y-3 pt-3 border-t border-border">
            <Label className="text-sm font-medium text-muted-foreground">
              File Settings
            </Label>
            <div className="space-y-1.5">
              <Label htmlFor="max-doc-size" className="text-xs text-muted-foreground">
                Max File Size (MB)
              </Label>
              <Input
                id="max-doc-size"
                type="number"
                min={1}
                max={50}
                value={field.validation?.maxFileSize || ''}
                onChange={(e) => onUpdateField({
                  validation: {
                    ...field.validation,
                    maxFileSize: e.target.value ? parseInt(e.target.value) : undefined,
                  },
                })}
                placeholder="10"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Allowed File Types
              </Label>
              <div className="space-y-2">
                {[
                  { label: 'PDF', value: 'application/pdf' },
                  { label: 'Word (.doc)', value: 'application/msword' },
                  { label: 'Word (.docx)', value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
                  { label: 'Excel (.xls)', value: 'application/vnd.ms-excel' },
                  { label: 'Excel (.xlsx)', value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
                ].map((type) => {
                  const isChecked = field.validation?.allowedFileTypes?.includes(type.value) ?? true;
                  return (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`doc-type-${type.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = field.validation?.allowedFileTypes || [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          ];
                          const newTypes = checked
                            ? [...current, type.value]
                            : current.filter((t) => t !== type.value);
                          onUpdateField({
                            validation: {
                              ...field.validation,
                              allowedFileTypes: newTypes.length > 0 ? newTypes : undefined,
                            },
                          });
                        }}
                      />
                      <Label
                        htmlFor={`doc-type-${type.value}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {type.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

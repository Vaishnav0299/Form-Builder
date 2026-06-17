import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField } from '@/types/form';
import { 
  GripVertical, 
  Trash2, 
  Type, 
  AlignLeft, 
  Mail, 
  Hash, 
  ChevronDown, 
  Circle, 
  CheckSquare, 
  Calendar,
  Image,
  FileText,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  short_text: Type,
  long_text: AlignLeft,
  email: Mail,
  number: Hash,
  dropdown: ChevronDown,
  radio: Circle,
  checkbox: CheckSquare,
  date: Calendar,
  image: Image,
  document: FileText,
};

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SortableField({ field, isSelected, onSelect, onDelete }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = iconMap[field.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`field-card group animate-slide-in ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      } ${isDragging ? 'dragging z-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-1 -ml-1 cursor-grab hover:bg-muted rounded transition-colors"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
            <span className="font-medium text-foreground truncate">
              {field.label || 'Untitled Question'}
            </span>
            {field.required && (
              <span className="text-destructive text-sm">*</span>
            )}
          </div>

          {/* Preview of the field type */}
          <div className="text-sm text-muted-foreground">
            {field.type === 'short_text' && (
              <div className="h-9 bg-muted/50 rounded-lg border border-border px-3 flex items-center text-muted-foreground/50">
                {field.placeholder || 'Short answer text'}
              </div>
            )}
            {field.type === 'long_text' && (
              <div className="h-20 bg-muted/50 rounded-lg border border-border px-3 py-2 text-muted-foreground/50">
                {field.placeholder || 'Long answer text'}
              </div>
            )}
            {field.type === 'email' && (
              <div className="h-9 bg-muted/50 rounded-lg border border-border px-3 flex items-center text-muted-foreground/50">
                {field.placeholder || 'email@example.com'}
              </div>
            )}
            {field.type === 'number' && (
              <div className="h-9 bg-muted/50 rounded-lg border border-border px-3 flex items-center text-muted-foreground/50">
                {field.placeholder || '0'}
              </div>
            )}
            {field.type === 'dropdown' && (
              <div className="h-9 bg-muted/50 rounded-lg border border-border px-3 flex items-center justify-between text-muted-foreground/50">
                <span>Select an option</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            )}
            {(field.type === 'radio' || field.type === 'checkbox') && (
              <div className="space-y-1">
                {(field.options?.length ? field.options : [{ id: '1', label: 'Option 1', value: 'option1' }]).slice(0, 3).map((opt, i) => (
                  <div key={opt.id || i} className="flex items-center gap-2 text-muted-foreground/70">
                    {field.type === 'radio' ? (
                      <Circle className="w-4 h-4" />
                    ) : (
                      <CheckSquare className="w-4 h-4" />
                    )}
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
            )}
            {field.type === 'date' && (
              <div className="h-9 bg-muted/50 rounded-lg border border-border px-3 flex items-center justify-between text-muted-foreground/50">
                <span>MM/DD/YYYY</span>
                <Calendar className="w-4 h-4" />
              </div>
            )}
            {field.type === 'image' && (
              <div className="h-20 bg-muted/50 rounded-lg border border-dashed border-border px-3 py-2 flex flex-col items-center justify-center text-muted-foreground/50">
                <Image className="w-6 h-6 mb-1" />
                <span className="text-xs">Upload image</span>
              </div>
            )}
            {field.type === 'document' && (
              <div className="h-20 bg-muted/50 rounded-lg border border-dashed border-border px-3 py-2 flex flex-col items-center justify-center text-muted-foreground/50">
                <FileText className="w-6 h-6 mb-1" />
                <span className="text-xs">Upload document</span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

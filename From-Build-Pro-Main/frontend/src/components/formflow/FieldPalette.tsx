import { useDraggable } from '@dnd-kit/core';
import { FIELD_TYPES, FieldType } from '@/types/form';
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Hash, 
  ChevronDown, 
  Circle, 
  CheckSquare, 
  Calendar,
  GripVertical,
  Image,
  FileText
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
};

interface DraggableFieldProps {
  type: FieldType;
  label: string;
  icon: string;
}

function DraggableField({ type, label, icon }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, isNew: true },
  });

  const Icon = iconMap[icon];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`field-palette-item ${isDragging ? 'opacity-50' : ''}`}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function FieldPalette() {
  return (
    <div className="form-builder-panel p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
        Form Fields
      </h3>
      <div className="space-y-2">
        {FIELD_TYPES.map((field) => (
          <DraggableField
            key={field.type}
            type={field.type}
            label={field.label}
            icon={field.icon}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Drag fields to add them to your form
      </p>
    </div>
  );
}

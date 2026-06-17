import API from "@/services/api";
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FieldType, FIELD_TYPES } from '@/types/form';
import { FieldPalette } from './FieldPalette';
import { FormCanvas } from './FormCanvas';
import { FieldEditor } from './FieldEditor';
import { FormPreview } from './FormPreview';
import { TemplatePicker, FormTemplate, formTemplates } from './FormTemplates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  Save,
  Share2,
  Check,
  ArrowLeft,
  BarChart3,
  Download,
  FileJson,
  Palette,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png'; // keep logo in case any other references use it, but add lf:
import lf from '@/assets/lf.png';

export function FormBuilder() {
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false); 
  const { formId } = useParams();
  const navigate = useNavigate(); 
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [headerImage, setHeaderImage] = useState<string | undefined>(undefined);
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if we navigated here with a template ID in state
    const state = location.state as { templateId?: string };
    if (state?.templateId) {
      const template = formTemplates.find(t => t.id === state.templateId);
      if (template) {
        handleSelectTemplate(template);
      } else if (state.templateId === 'blank') {
        setShowTemplates(false);
      }
    }
  }, [location.state]);

 /* useEffect(() => {
    // Load form from localStorage if formId is present
    if (formId) {
      const storedForm = localStorage.getItem(`form-storage-${formId}`);
 */
  useEffect(() => {
  if (formId) {
    API.get(`/forms/${formId}`)
      .then((res) => {
        const data = res.data;

        setFormTitle(data.title);
        setFormDescription(data.description || '');
        setFields(data.questions || []);
        //setHeaderImage(data.header_image);
        setHeaderImage(data.header_image || data.headerImage);
        setShowTemplates(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load form");
      });
  }
  }, [formId]);

    /*  if (storedForm) {
        try {
          const parsed = JSON.parse(storedForm);
          setFormTitle(parsed.title);
          setFormDescription(parsed.description || '');
          setFields(parsed.fields || []);
          setHeaderImage(parsed.headerImage);
          setShowTemplates(false);
        } catch (e) {
          console.error('Failed to parse stored form', e);
        }
      }
    }
  }, [formId]);
  */

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  const handleSelectTemplate = (template: FormTemplate) => {
    setFormTitle(template.title);
    setFormDescription(template.formDescription);
    setFields(
      template.fields.map((field) => ({
        ...field,
        id: uuidv4(),
        options: field.options?.map((opt) => ({ ...opt, id: uuidv4() })),
      }))
    );
    setShowTemplates(false);
  };

  const createField = useCallback((type: FieldType): FormField => {
    const fieldInfo = FIELD_TYPES.find((f) => f.type === type)!;
    const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(type);

return {
  id: uuidv4(),
  type,
  label: fieldInfo.label || "Untitled Field", // ✅ FIX
  placeholder: '',
  required: false,
  options: hasOptions
    ? [
        { id: uuidv4(), label: 'Option 1', value: 'option1' },
        { id: uuidv4(), label: 'Option 2', value: 'option2' },
      ]
    : [],
};
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeData = active.data.current;

    // Adding new field from palette
    if (activeData?.isNew) {
      const type = activeData.type as FieldType;

      if (type === 'header_image') {
        setHeaderImage('/assets/headers/junior-darbar-banner.png');
        toast.success('Form header image updated!');
        return;
      }

      const newField = createField(type);
      if (over.id === 'form-canvas') {
        setFields((prev) => [...prev, newField]);
      } else {
        const overIndex = fields.findIndex((f) => f.id === over.id);
        if (overIndex !== -1) {
          setFields((prev) => {
            const newFields = [...prev];
            newFields.splice(overIndex, 0, newField);
            return newFields;
          });
        } else {
          setFields((prev) => [...prev, newField]);
        }
      }
      setSelectedFieldId(newField.id);
      return;
    }

    // Reordering existing fields
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((f) => f.id === active.id);
        const newIndex = items.findIndex((f) => f.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleUpdateField = (updates: Partial<FormField>) => {
    if (!selectedFieldId) return;
    setFields((prev) =>
      prev.map((f) => (f.id === selectedFieldId ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  /*
  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error('Please add a form title');
      return;
    }
    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    const slug = formTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const formData = {
      id: slug,
      title: formTitle,
      description: formDescription,
      fields: fields,
      headerImage: headerImage,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`form-storage-${slug}`, JSON.stringify(formData));
    toast.success('Form saved successfully!');
  };
*/
/*
const handleSave = async () => {
  if (!formTitle.trim()) {
    toast.error('Please add a form title');
    return;
  }

  if (fields.length === 0) {
    toast.error('Please add at least one field');
    return;
  }

  try {
    const res = await API.post("/forms", {
      title: formTitle,
      description: formDescription,
      fields: fields,
    });

    const createdForm = res.data;

    toast.success("Form saved to database ✅");

    return createdForm; // IMPORTANT

  } catch (err) {
    console.error(err);
    toast.error("Failed to save form ❌");
  }
};
*/
/* const handleSave = async () => {
  if (!formTitle.trim()) {
    toast.error('Please add a form title');
    return;
  }

  if (fields.length === 0) {
    toast.error('Please add at least one field');
    return;
  }

  try {
    let res;

    if (formId) {
      // ✅ UPDATE existing form
      res = await API.put(`/forms/${formId}`, {
        title: formTitle,
        description: formDescription,
        fields: fields,
      });
    } else {
      // ✅ CREATE new form
      res = await API.post("/api/forms", {
        title: formTitle,
        description: formDescription,
        fields: fields,
      });
    }

    const savedForm = res.data;

    toast.success("Form saved to database ✅");

    return savedForm;

  } catch (err) {
    console.error(err);
    toast.error("Failed to save form ❌");
  }
};
*/
const handleSave = async () => {
  if (!formTitle.trim()) {
    toast.error('Please add a form title');
    return;
  }

  if (fields.length === 0) {
    toast.error('Please add at least one field');
    return;
  }

  setSaving(true);

  try {
     const cleanedFields = fields.map((f) => ({
  ...f,
options: ['dropdown', 'radio', 'checkbox'].includes(f.type)
  ? (f.options ?? []).map(opt => ({
      id: opt.id || uuidv4(),
      label: opt.label || "Option",
      value: opt.value || opt.label || "option"
    }))
  : [], 
  validation: f.validation ?? {},
}));

// ✅ VALIDATION
    for (const f of cleanedFields) {
      if (!f.label || f.label.trim() === "") {
        toast.error("All fields must have a label");
        setSaving(false);
        return;
      }

      if (
        ['radio', 'checkbox', 'dropdown'].includes(f.type) &&
        (!f.options || f.options.length === 0)
      ) {
        toast.error(`Add options for ${f.label || "field"}`);
        setSaving(false);
        return;
      }
    }



const res = await API.post(`/forms`, {
  title: formTitle,
  description: formDescription,
  questions: cleanedFields,
});

const savedForm = res?.data;

console.log("SAVED FORM RESPONSE:", savedForm);

if (!savedForm) {
  toast.error("No response from server");
  return;
}

if (!savedForm.slug) {
  toast.error("Form saved but slug missing");
  return;
}

toast.success("Form saved successfully ✅");

navigate(`/builder/${savedForm.slug}`);

return savedForm;

  } catch (err: any) {
  console.error("SAVE ERROR FULL:", err);
  console.error("BACKEND RESPONSE:", err?.response?.data);

  toast.error(
    err?.response?.data?.message || "Failed to save form ❌"
  );
}finally {
    setSaving(false);
  }
};


const handleDelete = async () => {
  console.log("DELETE CLICKED");

  if (!formId) {
    console.log("NO FORM ID");
    toast.error("No form to delete");
    return;
  }

  if (!confirm("Are you sure you want to delete this form?")) return;

  try {
    console.log("CALLING DELETE API:", formId);

    await API.delete(`/forms/${formId}`);

    toast.success("Form deleted ✅");
    navigate("/");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete form ❌");
  }
};


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setHeaderImage(result);
      toast.success('Header image uploaded!');
    };
    reader.readAsDataURL(file);
  };

 /*
  const handleShare = () => {
    if (!formTitle.trim()) {
      toast.error('Please add a form title before sharing');
      return;
    }
    const slug = formTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Save first
    handleSave();

    // Then navigate to publication success page
    navigate(`/form/${slug}/published`);
  };
*/
const handleShare = async () => {
  if (publishing) return;

  if (!formTitle.trim()) {
    toast.error("Please add a form title before sharing");
    return;
  }

  setPublishing(true);

  try {
    const savedForm = await handleSave();

    if (!savedForm || !savedForm.id) {
      toast.error("Form save failed");
      return;
    }

    const formId = savedForm.id;

    navigate(`/form/${formId}/published`);


  } catch (err) {
    console.error(err);
    toast.error("Publish failed ❌");
  } finally {
    setPublishing(false);
  }
};

  const handleExportJSON = () => {
    if (!formTitle.trim()) {
      toast.error('Please add a form title before exporting');
      return;
    }
    const formData = {
      title: formTitle,
      description: formDescription,
      fields: fields,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formTitle.toLowerCase().replace(/\s+/g, '-')}-config.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Form configuration exported as JSON!');
  };

  // Template Selection Screen
  if (showTemplates) {
    return (
      <div className="min-h-screen bg-background text-foreground flex ">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />

        <header className="sticky top-0 z-50 glass-morphism border-b border-white/20">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden liftup-shadow-glow rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                  <img src={lf} alt="LiftupForms" className="w-full h-full object-cover scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-black liftup-gradient-text tracking-tighter">LiftupForms</h1>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Next-Gen Builder</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/analytics')}
                  className="rounded-xl hover:bg-primary/10 text-primary transition-colors"
                  title="Analytics"
                >
                  <BarChart3 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-4 tracking-tight">Create Something <span className="liftup-gradient-text">Beautiful</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Choose a professionally designed template or start with a blank canvas to build your perfect form.
            </p>
          </div>
          <TemplatePicker onSelectTemplate={handleSelectTemplate} />
        </main>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border transition">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="rounded-full h-10 w-10 hover:bg-muted transition-all"
                  title="Forms Home"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Button>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden liftup-shadow-glow">
                    <img src={lf} alt="LiftupForms" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
  <div className="flex items-center gap-2">

    <Input
      value={formTitle}
      onChange={(e) => setFormTitle(e.target.value)}
      placeholder="Untitled form"
      className="
        h-8 text-lg font-medium
        bg-transparent
        border-none
        p-0
        text-foreground
        placeholder:text-muted-foreground
        focus-visible:ring-0
        focus-visible:ring-offset-0
        min-w-[50px]
        w-auto max-w-[300px]
      "
    />
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="w-1 h-1 rounded-full bg-border" />
      <span className="text-xs font-medium">
        All changes saved in Drive
      </span>
    </div>

  </div>
</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/analytics')}
                  className="rounded-xl hover:bg-primary/10 text-primary transition-colors"
                  title="Analytics"
                >
                  <BarChart3 className="w-6 h-6" />
                </Button>

                <div className="h-6 w-px bg-border/60 mx-1" />

                 <Button
                   variant="destructive"
                   size="sm"
                   onClick={handleDelete}
                   className="rounded-xl h-10 px-5 font-bold"
                 >
                   Delete
                 </Button>


                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-primary/10 text-primary transition-colors"
                      title="Theme Customization"
                    >
                      <Palette className="w-6 h-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-3 min-w-[240px]">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 mb-3 px-1">Form Theme</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {!headerImage ? (
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2 border-dashed h-20 hover:border-primary/50 hover:bg-primary/5 transition-all text-wrap"
                              onClick={() => setHeaderImage('/assets/headers/junior-darbar-banner.png')}
                            >
                              <ImageIcon className="w-5 h-5 opacity-40" />
                              <span className="text-[10px] font-medium opacity-60">Select Junior Darbar Banner</span>
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2 h-10 hover:bg-muted font-bold text-xs"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="w-4 h-4 mr-1 text-primary" />
                              Choose from device
                            </Button>
                          </div>
                        ) : (
                          <div className="relative group rounded-md overflow-hidden border">
                            <img src={headerImage} alt="Header" className="w-full h-16 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 text-[10px] px-2"
                                onClick={() => setHeaderImage(undefined)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-6 w-px bg-border/60 mx-1" />

                <Button
                  variant="ghost"
                  size="icon"
                  /*onClick={() => {
                    const slug = formTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    handleSave();
                    window.open(`/form/${slug}`, '_blank');
                  }}
                    */
                   onClick={async () => {
                     const savedForm = await handleSave();
                     if (!savedForm) return;

                     window.open(`/form/${savedForm.id}`, '_blank');
                   }}
                  className="rounded-xl hover:bg-primary/10 text-primary transition-colors"
                  title="View Live Form"
                  disabled={!formTitle.trim()}
                >
                  <Eye className="w-6 h-6" />
                </Button>

                <div className="h-6 w-px bg-border/60 mx-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className={cn(
                    "rounded-xl h-10 px-4 font-bold transition-all",
                    showPreview ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Preview
                </Button>

                {/*<Button variant="outline" size="sm" onClick={handleShare} className="rounded-xl h-10 px-5 font-bold border-2 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Publish'}
                </Button>*/}
                
                <Button
  variant="outline"
  size="sm"
  onClick={handleShare}
  disabled={publishing}
>
  {publishing ? "Publishing..." : "Publish"}
</Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl h-10 px-5 font-bold border-2 gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[180px]">
                    <DropdownMenuItem onClick={handleExportJSON} className="rounded-lg py-2.5 cursor-pointer">
                      <FileJson className="w-4 h-4 mr-3 text-primary" />
                      <span className="font-semibold text-sm">Export as JSON</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/*<Button size="sm" onClick={handleSave} className="rounded-xl h-10 px-6 font-bold liftup-gradient text-primary-foreground border-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                  <Save className="w-4 h-4 mr-2 text-white/90" />
                  Save Changes
                </Button>*/}
                <Button
  onClick={handleSave}
  disabled={saving}
  className="bg-primary text-primary-foreground hover:opacity-90 transition"
>
  {saving ? "Saving..." : "Save Changes"}
</Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-background">
          <div className="flex gap-6 h-[calc(100vh-8rem)]">
            {/* Left Panel - Field Palette */}
            <div className="w-64 shrink-0 hidden lg:block">
              <FieldPalette />
            </div>

            {/* Center - Form Canvas */}
            <div className="flex-1 min-w-0 flex flex-col">
              <FormCanvas
                fields={fields}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
                onDeleteField={handleDeleteField}
                formTitle={formTitle}
                formDescription={formDescription}
                onTitleChange={setFormTitle}
                onDescriptionChange={setFormDescription}
                headerImage={headerImage}
              />
            </div>

            {/* Right Panel - Field Editor or Preview */}
            <div className="w-80 shrink-0 hidden md:flex flex-col gap-6">
              <FieldEditor
                field={selectedField}
                onUpdateField={handleUpdateField}
                onClose={() => setSelectedFieldId(null)}
              />

              {showPreview && (
                <div className="flex-1 min-h-0">
                  <FormPreview
                    title={formTitle}
                    description={formDescription}
                    fields={fields}
                    headerImage={headerImage}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <DragOverlay>
        {activeId && activeId.startsWith('palette-') && (
          <div className="field-palette-item drag-overlay bg-card liftup-shadow-lg">
            <span className="text-sm font-medium">
              {FIELD_TYPES.find((f) => f.type === activeId.replace('palette-', ''))?.label}
            </span>
          </div>
        )}
      </DragOverlay>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
    </DndContext>
  );
}

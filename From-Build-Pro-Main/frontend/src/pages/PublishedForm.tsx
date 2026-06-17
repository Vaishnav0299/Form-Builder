import API from "../services/api";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormField, FieldType } from '@/types/form';
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
import { CalendarIcon, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import logo from '@/assets/logo.png'; // we keep logo in case other code uses it, but we add lf:
import lf from '@/assets/lf.png';

// function to fetch form structure from localStorage
/*const getFormStructure = (formId: string) => {
    const storedForm = localStorage.getItem(`form-storage-${formId}`);
    if (storedForm) {
        try {
            return JSON.parse(storedForm);
        } catch (e) {
            console.error('Failed to parse stored form', e);
        }
    }

    // In a real app, this would be an API call
    // For now, we'll return mock data if not found in localStorage
    return {
        title: formId.replace(/-/g, ' ').toUpperCase(),
        description: 'Please fill out this form carefully. Your response is important to us.',
        headerImage: undefined,
        fields: [
            {
                id: 'f1',
                type: 'short_text',
                label: 'Full Name',
                required: true,
                placeholder: 'Enter your name'
            },
            {
                id: 'f2',
                type: 'email',
                label: 'Email Address',
                required: true,
                placeholder: 'email@example.com'
            },
            {
                id: 'f3',
                type: 'radio',
                label: 'How did you hear about us?',
                required: true,
                options: [
                    { id: 'o1', label: 'Social Media', value: 'social' },
                    { id: 'o2', label: 'Friend/Family', value: 'friend' },
                    { id: 'o3', label: 'Advertisement', value: 'ads' },
                    { id: 'o4', label: 'Other', value: 'other' },
                ]
            }
        ] as FormField[]
    };
};
*/

    const PublishedForm = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<{ title: string; description: string; fields: FormField[]; headerImage?: string } | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [dateValues, setDateValues] = useState<Record<string, Date | undefined>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

   /* useEffect(() => {
        if (formId) {
            // Simulate API delay
            const timer = setTimeout(() => {
                setForm(getFormStructure(formId));
                setLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [formId]);
    */
   // new code
   useEffect(() => {
    const fetchForm = async () => {
        try {
            const res = await API.get(`/forms/${formId}`);
            console.log("FORM FROM BACKEND:", res.data);
            const data = res.data;
            if (data && !data.fields && data.questions) {
                data.fields = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions;
            }
            if (data && !data.fields) {
                data.fields = [];
            }
            setForm(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load form ❌");
        } finally {
            setLoading(false);
        }
    };

    if (formId) {
        fetchForm();
    }
    }, [formId]);

    const updateField = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

/*
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation for required fields
        const missingFields = form?.fields.filter(f => f.required && !formData[f.id]);
        if (missingFields?.length) {
            toast.error(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }

        setIsSubmitting(true);
        // Simulate API submission
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Form submitted successfully!');
            navigate('/form/success');
        }, 1500);
    };
*/
//new code   
/*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    const missingFields = form?.fields?.filter(f => f.required && !formData[f.id]);
    if (missingFields?.length) {
        toast.error(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
    }
    console.log("FORM ID:", formId); 
    console.log("FORM DATA BEING SENT:", formData);
    
    try {
    setIsSubmitting(true);

    await API.post(`/forms/${formId}/submit`, {
        answers: formData,
    });

    toast.success("Response submitted!");
} catch (err) {
    console.error(err);
    toast.error("Submission failed ❌");
} finally {
    setIsSubmitting(false);
}
};
*/

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   const errors: string[] = [];

form?.fields?.forEach((field) => {
    const value = formData[field.id];

    if (field.required && !value) {
        errors.push(`${field.label} is required`);
        return;
    }

    if (!value) return;

    // ✅ TEXT VALIDATION
    if (field.type === "short_text" || field.type === "long_text") {
        if (field.validation?.minLength !== undefined && 
            value.length < field.validation.minLength
        ){
            errors.push(`${field.label} must be at least ${field.validation.minLength} characters`);
        }

        if (field.validation?.maxLength && 
            value.length > field.validation.maxLength
        ){
            errors.push(`${field.label} must be less than ${field.validation.maxLength} characters`);
        }
    }

    // ✅ NUMBER VALIDATION
    if (field.type === "number") {
        const num = Number(value);

        if (field.validation?.min !== undefined &&
            num < field.validation.min
        ){
            errors.push(`${field.label} must be ≥ ${field.validation.min}`);
        }

        if (field.validation?.max !== undefined &&
            num > field.validation.max
        ){
            errors.push(`${field.label} must be ≤ ${field.validation.max}`);
        }
    }
});

console.log("ERRORS:", errors);

if (errors.length > 0) {
    toast.error(errors[0]);
    return;
}

    try {
        setIsSubmitting(true);

        // ✅ CORRECT ROUTE
        await API.post(`/forms/${formId}/submit`, {
            answers: formData,
        });

        // ✅ REDIRECT
        navigate("/thank-you", {
            state: {
                formTitle: form?.title,
            },
        });

    } catch (err: any) {
        console.error("ERROR:", err?.response?.data || err);
        toast.error("Submission failed ❌");
    } finally {
        setIsSubmitting(false);
    }
};


    
    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'short_text':
                return (
                    <Input
                          placeholder={field.placeholder || 'Your answer'}
                          value={formData[field.id] || ''}
                          onChange={(e) => updateField(field.id, e.target.value)}
                          className="preview-input"
                          required={field.required}
                          minLength={field.validation?.minLength}
                          maxLength={field.validation?.maxLength}
                    />
                );

            case 'long_text':
                return (
                    <Textarea
                          placeholder={field.placeholder || 'Your answer'}
                          value={formData[field.id] || ''}
                          onChange={(e) => updateField(field.id, e.target.value)}
                          className="preview-input min-h-[120px] resize-none"
                          required={field.required}
                          minLength={field.validation?.minLength}
                          maxLength={field.validation?.maxLength}
                    />
                );

            case 'email':
                return (
                    <Input
                        type="email"
                        placeholder={field.placeholder || 'email@example.com'}
                        value={formData[field.id] || ''}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        required={field.required}
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
                          required={field.required}
                          min={field.validation?.min}
                          max={field.validation?.max}
                    />
                );

            case 'dropdown':
                return (
                    <Select
                        value={formData[field.id] || ''}
                        onValueChange={(value) => updateField(field.id, value)}
                        required={field.required}
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
                        className="space-y-3"
                        required={field.required}
                    >
                        {field.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-4 p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                                <RadioGroupItem value={option.value} id={`${field.id}-${option.id}`} className="w-5 h-5 border-2" />
                                <Label
                                    htmlFor={`${field.id}-${option.id}`}
                                    className="flex-1 font-bold text-base cursor-pointer py-1 group-hover:text-primary transition-colors"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case 'checkbox':
                return (
                    <div className="space-y-3">
                        {field.options?.map((option) => {
                            const checked = (formData[field.id] || []).includes(option.value);
                            return (
                                <div key={option.id} className="flex items-center space-x-4 p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                                    <Checkbox
                                        id={`${field.id}-${option.id}`}
                                        checked={checked}
                                        className="w-5 h-5 border-2 rounded-md"
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
                                        className="flex-1 font-bold text-base cursor-pointer py-1 group-hover:text-primary transition-colors"
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
                                    'preview-input justify-start text-left font-normal',
                                    !dateValues[field.id] && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-3 h-5 w-5 opacity-60" />
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

            case 'image':
                return (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                                      updateField(field.id, file);
                      }
                    }}
                    className="preview-input"
                    required={field.required}
                  />
                );

            case 'document':
                 return (
                   <input
                     type="file"
                     accept=".pdf,.doc,.docx,.xls,.xlsx"
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                         updateField(field.id, file);
                       }
                     }}
                     className="preview-input"
                     required={field.required}
                   />
                 );    

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground font-medium">Loading form...</p>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Form not found</h2>
                    <p className="text-muted-foreground">The form you are looking for does not exist or has been removed.</p>
                    <Button onClick={() => navigate('/')}>Return Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden py-24 px-4 font-sans leading-relaxed">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/[0.03] skew-y-[-2deg] origin-top-left -z-10" />
            <div className="absolute top-40 right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] -z-10 animate-float" />
            <div className="absolute bottom-20 left-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '-3s' }} />

            <div className="max-w-[800px] mx-auto space-y-8">
                {/* Form Header Card */}
                <div className="bg-card rounded-[2rem] border-0 overflow-hidden liftup-shadow-lg relative selection:bg-primary/10">
                    {/* Header Image */}
                    {form.headerImage && (
                        <div className="w-full h-48 sm:h-64 relative overflow-hidden">
                            <img
                                src={form.headerImage}
                                alt="Form Header"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Top accent gradient bar */}
                    {!form.headerImage && <div className="h-2.5 liftup-gradient w-full" />}

                    <div className="p-10 sm:p-12 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2">
                            <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden liftup-shadow-glow shrink-0 rotate-[-2deg]">
                               <img src={lf} alt="LiftupForms" className="w-full h-full object-cover scale-110" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">{form.title}</h1>
                                <p className="text-xs font-black text-primary uppercase tracking-[0.3em] opacity-80">Public Form</p>
                            </div>
                        </div>
                        <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed border-l-4 border-primary/20 pl-6 py-1">
                            {form.description}
                        </p>
                        <div className="pt-4 flex items-center justify-between border-t border-border/50">
                            <p className="text-[10px] text-destructive font-black uppercase tracking-widest flex items-center gap-1.5">
                                <span className="text-lg leading-none mt-1">*</span> Indicates required question
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {form.fields.map((field) => (
                        <div
                            key={field.id}
                            className="bg-card rounded-[2rem] border-0 p-10 sm:p-12 liftup-shadow-sm hover:liftup-shadow transition-all duration-300 group"
                        >
                            <div className="space-y-6">
                                <Label className="text-xl font-black flex items-baseline gap-2 text-foreground/90 uppercase tracking-tight">
                                    {field.label}
                                    {field.required && <span className="text-destructive font-black text-2xl leading-none">*</span>}
                                </Label>
                                <div className="pt-2">
                                    {renderField(field)}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6 pb-20">
                        <Button
  type="submit"
  disabled={isSubmitting}
  className="
    h-16 px-12 text-xl font-bold
    liftup-gradient
    text-primary-foreground
    border-0 rounded-2xl
    shadow-lg shadow-primary/20
    hover:shadow-primary/30
    transition-all
    hover:scale-[1.02]
    active:scale-[0.98]
    w-full sm:w-auto
  "
>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    SENDING...
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6 mr-3" />
                                    SUBMIT RESPONSE
                                </>
                            )}
                        </Button>

                        <div className="
  flex flex-col items-center sm:items-end gap-1
  px-4 py-2 rounded-xl
  bg-card/80
  backdrop-blur-sm
  border border-border
">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Built with</span>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <img src={lf} alt="" className="w-5 h-5 grayscale opacity-60" />
                                </div>
                            <span className="text-lg font-black liftup-gradient-text tracking-tighter uppercase">LiftupForms</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PublishedForm;
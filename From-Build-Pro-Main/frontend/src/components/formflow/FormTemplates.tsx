
import { FormField } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';
import { 
  FileText, 
  MessageSquare, 
  ClipboardList,
  Sparkles
} from 'lucide-react';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  title: string;
  formDescription: string;
  fields: Omit<FormField, 'id'>[];
}

export const formTemplates: FormTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Form',
    description: 'Start from scratch',
    icon: <Sparkles className="w-6 h-6" />,
    title: '',
    formDescription: '',
    fields: []
  },
  {
    id: 'contact',
    name: 'Contact Us',
    description: 'Collect inquiries from visitors',
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Contact Us',
    formDescription: 'We\'d love to hear from you! Please fill out the form below and we\'ll get back to you as soon as possible.',
    fields: [
      {
        type: 'short_text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        type: 'email',
        label: 'Email Address',
        placeholder: 'you@example.com',
        required: true
      },
      {
        type: 'short_text',
        label: 'Subject',
        placeholder: 'What is this regarding?',
        required: true
      },
      {
        type: 'long_text',
        label: 'Message',
        placeholder: 'Tell us what you need help with...',
        required: true
      }
    ]
  },
  {
    id: 'feedback',
    name: 'Feedback',
    description: 'Gather user opinions',
    icon: <FileText className="w-6 h-6" />,
    title: 'Share Your Feedback',
    formDescription: 'Your feedback helps us improve! Please take a moment to share your thoughts.',
    fields: [
      {
        type: 'short_text',
        label: 'Name',
        placeholder: 'Your name (optional)',
        required: false
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'Your email (optional)',
        required: false
      },
      {
        type: 'radio',
        label: 'How would you rate your experience?',
        required: true,
        options: [
          { id: uuidv4(), label: 'Excellent', value: 'excellent' },
          { id: uuidv4(), label: 'Good', value: 'good' },
          { id: uuidv4(), label: 'Average', value: 'average' },
          { id: uuidv4(), label: 'Poor', value: 'poor' }
        ]
      },
      {
        type: 'long_text',
        label: 'What did you like most?',
        placeholder: 'Tell us what worked well...',
        required: false
      },
      {
        type: 'long_text',
        label: 'What could we improve?',
        placeholder: 'Share your suggestions...',
        required: false
      }
    ]
  },
  {
    id: 'survey',
    name: 'Survey',
    description: 'Conduct detailed research',
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Customer Survey',
    formDescription: 'Help us serve you better by answering a few questions about your experience.',
    fields: [
      {
        type: 'short_text',
        label: 'Name',
        placeholder: 'Your name',
        required: true
      },
      {
        type: 'email',
        label: 'Email',
        placeholder: 'your@email.com',
        required: true
      },
      {
        type: 'dropdown',
        label: 'How did you hear about us?',
        required: true,
        options: [
          { id: uuidv4(), label: 'Search Engine', value: 'search' },
          { id: uuidv4(), label: 'Social Media', value: 'social' },
          { id: uuidv4(), label: 'Friend/Family', value: 'referral' },
          { id: uuidv4(), label: 'Advertisement', value: 'ad' },
          { id: uuidv4(), label: 'Other', value: 'other' }
        ]
      },
      {
        type: 'radio',
        label: 'How satisfied are you with our service?',
        required: true,
        options: [
          { id: uuidv4(), label: 'Very Satisfied', value: '5' },
          { id: uuidv4(), label: 'Satisfied', value: '4' },
          { id: uuidv4(), label: 'Neutral', value: '3' },
          { id: uuidv4(), label: 'Dissatisfied', value: '2' },
          { id: uuidv4(), label: 'Very Dissatisfied', value: '1' }
        ]
      },
      {
        type: 'checkbox',
        label: 'Which features do you use most?',
        required: false,
        options: [
          { id: uuidv4(), label: 'Dashboard', value: 'dashboard' },
          { id: uuidv4(), label: 'Reports', value: 'reports' },
          { id: uuidv4(), label: 'Analytics', value: 'analytics' },
          { id: uuidv4(), label: 'Integrations', value: 'integrations' }
        ]
      },
      {
        type: 'long_text',
        label: 'Any additional comments?',
        placeholder: 'Share any other thoughts or suggestions...',
        required: false
      }
    ]
  }
];

interface TemplatePickerProps {
  onSelectTemplate: (template: FormTemplate) => void;
}

export function TemplatePicker({ onSelectTemplate }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {formTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="group p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-accent/50 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-md border border-primary/5">
            {template.icon}
          </div>
          <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </button>
      ))}
    </div>
  );
}


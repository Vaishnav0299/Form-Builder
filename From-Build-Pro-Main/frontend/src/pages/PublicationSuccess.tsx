import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import lf from '@/assets/lf.png';

const PublicationSuccess = () => {
    const { formId } = useParams();
    const [copied, setCopied] = useState(false);
    const [formTitle, setFormTitle] = useState('');

    useEffect(() => {
        if (formId) {
            const storedForm = localStorage.getItem(`form-storage-${formId}`);
            if (storedForm) {
                try {
                    const parsed = JSON.parse(storedForm);
                    setFormTitle(parsed.title);
                } catch (e) {
                    console.error('Failed to parse stored form', e);
                    setFormTitle(formId.replace(/-/g, ' ').toUpperCase());
                }
            } else {
                setFormTitle(formId.replace(/-/g, ' ').toUpperCase());
            }
        }
    }, [formId]);

    const publicUrl = `${window.location.origin}/form/${formId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        toast.success('Public form link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />

            <div className="max-w-[600px] w-full bg-card rounded-[2.5rem] shadow-2xl shadow-primary/10 border-0 overflow-hidden relative">
                <div className="h-3 liftup-gradient w-full" />

                <div className="p-10 text-center space-y-8">
                    <div className="relative">
                        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-subtle">
                            <CheckCircle2 className="w-16 h-16 text-primary" />
                        </div>
                        <div className="absolute top-0 right-[35%]">
                            <div className="w-3 h-3 bg-primary rounded-full animate-ping opacity-75" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase tracking-tighter">Form Published!</h1>
                        <p className="text-muted-foreground font-medium text-lg px-6 leading-relaxed">
                            Your form <span className="text-primary font-bold">"{formTitle}"</span> is now live and ready to collect responses.
                        </p>
                    </div>

                    <div className="bg-primary/5 rounded-2xl p-6 space-y-3 border border-primary/10">
                        <p className="text-xs font-black text-primary/60 uppercase tracking-[0.2em] text-left">Public Link</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 overflow-hidden truncate bg-white/50 backdrop-blur-sm border border-white p-3 rounded-xl text-sm font-medium text-muted-foreground text-left">
                                {publicUrl}
                            </div>
                            <Button
                                onClick={handleCopy}
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 shrink-0 rounded-xl hover:bg-primary/5 transition-all"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button asChild variant="outline" className="h-14 border-2 rounded-2xl hover:bg-primary/5 hover:border-primary/30 group transition-all duration-300">
                            <Link to="/" className="flex items-center justify-center gap-3 font-bold">
                                <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild className="h-14 liftup-gradient border-0 text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]">
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                                <ExternalLink className="w-5 h-5" />
                                Visit Published Form
                            </a>
                        </Button>
                    </div>

                    <div className="h-px bg-border pt-2" />

                    <div className="flex items-center justify-center gap-3 mt-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <img src={lf} alt="" className="w-6 h-6 rotate-[-10deg]" />
                        <span className="text-2xl font-black tracking-tighter liftup-gradient-text uppercase">LiftupForms</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationSuccess;

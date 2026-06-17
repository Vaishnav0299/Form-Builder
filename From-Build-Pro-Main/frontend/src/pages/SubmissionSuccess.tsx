import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Plus, ArrowRight } from 'lucide-react';
import lf from '@/assets/lf.png';

const SubmissionSuccess = () => {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />

            <div className="max-w-[550px] w-full bg-card rounded-[2.5rem] shadow-2xl shadow-primary/10 border-0 overflow-hidden relative">
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
                        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase tracking-tighter">Response Recorded</h1>
                        <p className="text-muted-foreground font-medium text-lg px-6 leading-relaxed">
                            Thank you! Your response has been successfully sent. We've archived it in our high-performance analytics engine.
                        </p>
                    </div>

                    <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button asChild variant="outline" className="h-14 border-2 rounded-2xl hover:bg-primary/5 hover:border-primary/30 group transition-all duration-300">
                            <Link to="/" className="flex items-center justify-center gap-3 font-bold">
                                <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                Homepage
                            </Link>
                        </Button>
                        <Button asChild className="h-14 liftup-gradient border-0 text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]">
                            <Link to="/analytics" className="flex items-center justify-center gap-3">
                                View Analytics
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </Button>
                    </div>

                    <div className="h-px bg-border pt-2" />

                    <div className="flex flex-col items-center gap-4 pt-4">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/5 rounded-full border border-primary/10">
                            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">Create more forms</span>
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                                <Link to="/"><Plus className="w-5 h-5" /></Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 mt-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <img src={lf} alt="" className="w-6 h-6 rotate-[-10deg]" />
                            <span className="text-2xl font-black tracking-tighter liftup-gradient-text uppercase">LiftupForms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionSuccess;

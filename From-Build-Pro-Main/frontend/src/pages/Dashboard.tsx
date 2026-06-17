import API from '@/services/api';
import ThemeSwitcher from "../components/ThemeSwitcher";
import { toast } from "sonner";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from 'date-fns';
import {
    MoreVertical,
    // ... (rest of imports remains same, I'll use a larger block or multi_replace if needed)
    FileText,
    Users,
    LayoutGrid,
    List,
    ChevronDown,
    Plus,
    ArrowUpDown,
    ExternalLink,
    Trash2,
    Edit2,
    BarChart3
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import lf from '@/assets/lf.png';

type OwnershipFilter = 'anyone' | 'me' | 'not-me';
type SortOrder = 'opened' | 'modified' | 'title';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [ownership, setOwnership] = useState<OwnershipFilter>('anyone');
    const [sortOrder, setSortOrder] = useState<SortOrder>('opened');
  //  const [forms, setForms] = useState<any[]>(MOCK_FORMS);
   

   const [forms, setForms] = useState<any[]>([]);
   const [sidebarOpen, setSidebarOpen] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);

const handleDelete = async (formId: string) => {
  console.log("DELETE CLICKED:", formId);

  if (!window.confirm("Are you sure you want to delete this form?")) return;

  try {
    setDeletingId(formId);

    await API.delete(`/forms/${formId}`);

    setForms(prev => prev.filter(f => f.id !== formId));

    toast.success("Form deleted");
  } 
  catch (err: any) {
  console.error("DELETE ERROR:", err);
  console.log("ERROR RESPONSE:", err?.response?.data);
  toast.error(err?.response?.data?.message || "Failed to delete");
  } 
  finally {
    setDeletingId(null);
  }
};

   useEffect(() => {
    const fetchForms = async () => {
        try {
            const res = await API.get("/forms");

            console.log("FORMS FROM BACKEND:", res.data); // ✅ ADD HERE

            setForms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    fetchForms();
}, []);

    // Filtering and Sorting Logic
    const safeForms = Array.isArray(forms) ? forms : [];
    const filteredForms = safeForms
        .filter(form => {
            const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesOwnership =
                ownership === 'anyone' ? true :
                    ownership === 'me' ? form.owner === 'me' :
                        form.owner !== 'me';
            return matchesSearch && matchesOwnership;
        })
     
        .sort((a, b) => {
    if (sortOrder === 'title') return a.title.localeCompare(b.title);

    const dateA = new Date(a.created_at || a.updatedAt || Date.now());
    const dateB = new Date(b.created_at || b.updatedAt || Date.now());

    return dateB.getTime() - dateA.getTime();
});

    const getOwnershipLabel = (val: OwnershipFilter) => {
        if (val === 'anyone') return 'Owned by anyone';
        if (val === 'me') return 'Owned by me';
        return 'Not owned by me';
    };

    const getSortLabel = (val: SortOrder) => {
        if (val === 'opened') return 'Last opened by me';
        if (val === 'modified') return 'Last modified';
        return 'Title';
    };

    return (
        <div className="min-h-screen bg-background font-sans">
            
        {sidebarOpen && (
         <div className="fixed left-0 top-0 h-full w-64 bg-background shadow-lg z-50 p-4 pt-8">
            <h2 className="font-bold mb-4 ">Menu</h2>
            <button onClick={() => navigate('/')} className="block mb-2">Dashboard</button>
            <button onClick={() => navigate('/builder')} className="block mb-2">Create Form</button>
         </div>
        )}

{/* Main Navigation */}
            <header className="h-16 border-b flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                   
                    {/*<Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <List className="w-5 h-5 text-muted-foreground" />
                    </Button>*/}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                      <List className="w-5 h-5 text-muted-foreground" />
                    </Button>

                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <img src={lf} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-medium text-muted-foreground">Forms</span>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl mx-8 flex items-center gap-3">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 bg-muted/50 hover:bg-background hover:shadow-md transition-all rounded-xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <ThemeSwitcher />
                </div>

                <div className="flex items-center gap-2">
                    
                    {/*<Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <Users className="w-5 h-5 text-muted-foreground" />
                    </Button>*/}

                    <Button
                       variant="ghost"
                       size="icon"
                       className="rounded-full h-10 w-10"
                       onClick={() => alert("Users feature coming soon")}
                    >
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </Button>


                    {/*<div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/10 flex items-center justify-center text-xs font-bold text-primary ml-2 cursor-pointer">
                        A
                    </div>*/}

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold ml-2 cursor-pointer shadow-sm hover:opacity-90 transition-opacity uppercase">
                                 {user?.name ? user.name[0] : "A"}
                           </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate('/profile')}>
                            Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/settings')}>
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={logout}>
                            Logout
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>


                </div>


            </header>

            <div className="bg-background border-b border-border">
                <main className="max-w-[1200px] mx-auto py-6 px-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-medium text-foreground">Start a new form</h2>
                        <Button variant="ghost" className="text-sm font-medium gap-2 px-3 py-1 text-muted-foreground hover:bg-muted/50">
                            Template gallery
                            <div className="flex flex-col -space-y-1.5 opacity-60">
                                <ChevronDown className="w-3 h-3 rotate-180" />
                                <ChevronDown className="w-3 h-3" />
                            </div>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Blank Template */}
                        <div className="space-y-2 group cursor-pointer" onClick={() => navigate('/builder', { state: { templateId: 'blank' } })}>
                            <div className="aspect-[3/2] bg-background border border-border group-hover:border-primary/50 transition-all rounded-2xl flex items-center justify-center p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                    <div className="absolute w-12 h-1.5 bg-primary/80 rounded-full shadow-sm" />
                                    <div className="absolute h-12 w-1.5 bg-primary/60 rounded-full shadow-sm" />
                                    <div className="absolute w-6 h-1.5 bg-primary/40 rounded-full" />
                                    <div className="absolute h-6 w-1.5 bg-primary/70 rounded-full" />
                                    <Plus className="w-12 h-12 text-transparent z-10" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-foreground px-1">Blank</p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2 group cursor-pointer" onClick={() => navigate('/builder', { state: { templateId: 'contact' } })}>
                            <div className="aspect-[3/2] bg-background border border-border group-hover:border-primary/50 transition-all rounded-2xl overflow-hidden relative shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="absolute inset-0 bg-muted/10 flex flex-col p-3">
                                    <div className="w-full h-8 bg-[#4285f4]/10 rounded-t-md mb-1 px-2 py-1 flex items-center">
                                        <div className="w-16 h-1 bg-[#4285f4]/30 rounded" />
                                    </div>
                                    <div className="p-2 space-y-2">
                                        <div className="w-1/3 h-1 bg-muted/40 rounded" />
                                        <div className="w-full h-8 bg-muted/5 rounded-md border border-border/10" />
                                        <div className="w-1/2 h-1 bg-muted/40 rounded" />
                                        <div className="w-full h-8 bg-muted/5 rounded-md border border-border/10" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-foreground px-1 uppercase tracking-tight text-[11px]">Contact Information</p>
                        </div>

                        {/* Event RSVP */}
                        <div className="space-y-2 group cursor-pointer" onClick={() => navigate('/builder', { state: { templateId: 'feedback' } })}>
                            <div className="aspect-[3/2] bg-background border border-border group-hover:border-primary/50 transition-all rounded-2xl overflow-hidden relative shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="absolute inset-0 bg-muted/10 flex flex-col p-3">
                                    <div className="w-full h-8 bg-[#db4437]/10 rounded-t-md mb-1 px-2 py-1 flex items-center">
                                        <div className="w-12 h-1 bg-[#db4437]/30 rounded" />
                                    </div>
                                    <div className="p-2 space-y-2">
                                        <div className="w-2/3 h-2 bg-muted/30 rounded" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="h-6 bg-muted/5 border border-border/10 rounded-md" />
                                            <div className="h-6 bg-muted/5 border border-border/10 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-foreground px-1 uppercase tracking-tight text-[11px]">Event RSVP</p>
                        </div>

                        {/* Party Invite */}
                        <div className="space-y-2 group cursor-pointer" onClick={() => navigate('/builder', { state: { templateId: 'survey' } })}>
                            <div className="aspect-[3/2] border border-border group-hover:border-primary/50 transition-all rounded-2xl overflow-hidden relative shadow-sm hover:shadow-lg hover:-translate-y-1 duration-300">
                                <div className="absolute inset-0 bg-muted/10 flex flex-col p-3">
                                    <div className="w-full h-8 bg-[#f4b400]/10 rounded-t-md mb-1 px-2 py-1 flex items-center">
                                        <div className="w-20 h-1 bg-[#f4b400]/30 rounded" />
                                    </div>
                                    <div className="p-2 flex flex-col items-center gap-2">
                                        <div className="w-full h-4 bg-muted/5 border border-border/10 rounded-md" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-foreground px-1 uppercase tracking-tight text-[11px]">Party Invite</p>
                        </div>
                    </div>
                </main>
            </div>

            <main className="max-w-[1200px] mx-auto py-8 px-6">
                {/* Section Header Controls */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-medium text-foreground/80">Recent forms</h2>
                    <div className="flex items-center gap-2">
                        {/* Ownership Filter Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-sm font-medium gap-2 px-3 py-1 text-muted-foreground hover:bg-muted/50">
                                    {getOwnershipLabel(ownership)}
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                <DropdownMenuItem onClick={() => setOwnership('anyone')}>
                                    Owned by anyone
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOwnership('me')}>
                                    Owned by me
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOwnership('not-me')}>
                                    Not owned by me
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="w-px h-6 bg-border mx-2" />

                        {/* View Mode Toggles */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-10 w-10 rounded-full", viewMode === 'list' && "bg-primary/10 text-primary")}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-10 w-10 rounded-full", viewMode === 'grid' && "bg-primary/10 text-primary")}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </Button>

                        {/* Sort Order Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button
  variant="ghost"
  className="text-sm font-medium gap-2 px-3 py-1 text-muted-foreground hover:bg-muted/50"
>
  {getSortLabel(sortOrder)}
  <ArrowUpDown className="w-4 h-4" />
</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <h3 className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Sort by</h3>
                                <DropdownMenuItem onClick={() => setSortOrder('opened')} className={cn(sortOrder === 'opened' && "text-primary font-bold")}>
                                    Last opened by me
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder('modified')} className={cn(sortOrder === 'modified' && "text-primary font-bold")}>
                                    Last modified by me
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder('title')} className={cn(sortOrder === 'title' && "text-primary font-bold")}>
                                    Title
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Grid View */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                        {filteredForms.map((form) => (
                            <div key={form.id} className="group cursor-pointer">
                                <div
                                    className="aspect-[4/3] bg-muted/30 border border-border/80 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all mb-3 relative"
                                    onClick={() => navigate(`/analytics/${form.id}`)}
                                >
                                    <div className="absolute inset-0 flex flex-col p-4">
                                        <div className="w-full h-8 flex items-center gap-2 mb-2 p-1 border-b border-border/20">
                                            <div className="w-3 h-3 rounded-full bg-primary/20 shrink-0" />
                                            <div className="w-1/2 h-1.5 bg-muted rounded shrink-0" />
                                        </div>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="space-y-1">
                                                    <div className="w-1/3 h-1 bg-muted/60 rounded" />
                                                    <div className="w-full h-3 border border-border/10 rounded-sm" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                                </div>

                                <div className="px-1 flex items-start justify-between">
                                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                        <div className={cn("w-8 h-8 rounded-xl shadow-md shadow-black/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5", form.iconColor || "bg-primary")}>
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1" onClick={() => navigate(`/analytics/${form.id}`)}>
                                            <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                {form.title}
                                            </h3>
                                            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                                <Users className="w-3 h-3" />
                                                Opened {form.created_at 
                                                ? formatDistanceToNow(new Date(form.created_at), { addSuffix: true }) 
                                                : "recently"}
                                            </p>
                                        </div>
                                    </div>

                                 
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4 text-muted-foreground mr-1" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuItem onClick={() => navigate(`/builder/${form.id}`)}>
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Open in Builder
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate(`/analytics/${form.id}`)}>
                                                <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                                                View Analytics
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                 disabled={deletingId === form.id}
                                                 onClick={(e) => {
                                                   e.stopPropagation();
                                                   handleDelete(form.id);
                                                 }}
                                               >
                                                <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                                                {deletingId === form.id ? "Deleting..." : "Remove"}
                                                </DropdownMenuItem>

                                            <DropdownMenuSeparator />
                                            {/*<DropdownMenuItem onClick={() => window.open(`/form/${form.id}`, '_blank')}>*/}
                                               <DropdownMenuItem onClick={() => window.open(`${window.location.origin}/form/${form.id}`, '_blank')}>
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Open Live Form
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                  
                  
                  
                    /* List View */
                    <div className="border rounded-xl bg-card overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
                        <div className="grid grid-cols-[1fr,200px,200px,48px] px-6 py-3 border-b bg-muted/20 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                            <div>Name</div>
                            <div>Owner</div>
                            <div>Last opened</div>
                            <div></div>
                        </div>
                        <div className="divide-y">
                            {filteredForms.map((form) => (
                                <div key={form.id} className="grid grid-cols-[1fr,200px,200px,48px] px-6 py-4 hover:bg-muted/30 transition-colors group items-center cursor-pointer">
                                    <div className="flex items-center gap-4 min-w-0" onClick={() => navigate(`/analytics/${form.id}`)}>
                                        <div className={cn("w-7 h-7 rounded-lg shadow-sm shadow-black/10 border border-white/10 flex items-center justify-center shrink-0", form.iconColor || "bg-primary")}>
                                            <FileText className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{form.title}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">{form.owner === 'me' ? 'me' : 'shared'}</div>
                                    <div className="text-sm text-muted-foreground">{form.updatedAt}</div>
                                    
                                     
                                           <div>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56">
                                                <DropdownMenuItem onClick={() => navigate(`/builder/${form.id}`)}>
                                                    <Edit2 className="w-4 h-4 mr-2" />
                                                    Open in Builder
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate(`/analytics/${form.id}`)}>
                                                    <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                                                    View Analytics
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Trash2 className="w-4 h-4 mr-2 text-destructive" />
                                                    Remove
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => window.open(`/form/${form.id}`, '_blank')}>
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Open Live Form
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                         </DropdownMenu>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredForms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <FileText className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                        <p className="text-lg font-medium text-muted-foreground">No forms found</p>
                        <p className="text-sm text-muted-foreground/60 mt-1">Try a different search or filter</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;



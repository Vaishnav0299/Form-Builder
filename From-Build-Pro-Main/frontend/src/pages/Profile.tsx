import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Shield, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "June 17, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="h-16 border-b flex items-center px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full h-10 w-10 mr-4"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">User Profile</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-10 px-6 animate-in fade-in duration-500">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-md">
          {/* Avatar & Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/80">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-extrabold shadow-lg uppercase">
              {user?.name ? user.name[0] : "U"}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-black text-foreground">{user?.name || "User"}</h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">Creator Account</p>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start text-xs font-semibold text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-full mt-2 w-fit">
                <CheckCircle className="w-3.5 h-3.5" />
                Active Account
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">Full Name</p>
                  <p className="text-sm font-semibold text-foreground">{user?.name || "User"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">Email Address</p>
                  <p className="text-sm font-semibold text-foreground">{user?.email || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">Role</p>
                  <p className="text-sm font-semibold text-foreground">Creator</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">Member Since</p>
                  <p className="text-sm font-semibold text-foreground">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

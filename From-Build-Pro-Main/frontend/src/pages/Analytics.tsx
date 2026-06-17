import { useState, useEffect, useCallback } from 'react';
import API from '@/services/api';

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import {
  ArrowLeft,
  Users,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  MoreVertical
} from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { format, subDays } from 'date-fns';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import lf from '@/assets/lf.png';

const PIE_COLORS = [
  '#6366f1', '#8b5cf6', '#3b82f6',
  '#a855f7', '#0ea5e9', '#ec4899'
];

const Analytics = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const today = new Date();
  const [dateRange, setDateRange] = useState({
    from: subDays(today, 6),
    to: today,
  });

  // ✅ FETCH DATA
  useEffect(() => {
    if (!formId) return;

    API.get(`/forms/${formId}`)
      .then(res => {
        const data = res.data;
        if (data && !data.fields && data.questions) {
          data.fields = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions;
        }
        if (data && !data.fields) {
          data.fields = [];
        }
        setForm(data);
        setSelectedQuestion(data?.fields?.[0]);
      });

    API.get(`/forms/${formId}/responses`)
      /*.then(res => setResponses(res.data));
  }, [formId]);*/
      .then(res => {
      console.log("FETCHING RESPONSES...");
      console.log("RESPONSES FROM API:", res.data); // ✅ ADD HERE
      setResponses(res.data);
      });
      }, [formId]);

  // ✅ FILTERED RESPONSES (DATE BASED)
  const filteredResponses = responses.filter(r => {
    const d = new Date(r.created_at);
    return d >= dateRange.from && d <= dateRange.to;
  });

  // ✅ STATS
  const stats = [
    {
      label: 'Total Responses',
      value: filteredResponses.length,
      icon: Users,
    }
  ];

  // ✅ EXPORT CSV
  const exportCSV = useCallback(() => {
    if (!filteredResponses.length) {
      toast.error('No data');
      return;
    }

    const headers = [

      'Date',
      ...(form?.fields || []).map((f: any) => f.label)
    ];

    {/*const rows = filteredResponses.map(r => [
      r.id,
      format(new Date(r.created_at), 'yyyy-MM-dd'),
      ...(form?.fields || []).map((f: any) => {
        const val = r.responses?.[f.id];
        return Array.isArray(val) ? val.join(', ') : val || '';
      })
    ]);*/}
    const rows = filteredResponses.map(r => [
  format(new Date(r.created_at), 'yyyy-MM-dd'),
  ...(form?.fields || []).map((f: any) => {
    const val = r.responses?.[f.id];
    return Array.isArray(val) ? val.join(', ') : val || '';
    })
  ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'responses.csv';
    a.click();

    toast.success('CSV exported');
  }, [filteredResponses, form]);

  // ✅ EXPORT PDF
  const exportPDF = useCallback(() => {
    const doc = new jsPDF();

    doc.text('Analytics Report', 14, 20);

    /*autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value']],
      body: stats.map(s => [s.label, String(s.value)])
    });*/
    autoTable(doc, {
  startY: 30,
  head: [['Response #', 'Question', 'Answer']],
  body: filteredResponses.flatMap((r, index) => {
    return (form?.fields || []).map((f: any, i: number) => [
      i === 0 ? `Response ${index + 1}` : '',
      f.label,
      r.responses?.[f.id] || '—'
    ]);
  }),
});

    doc.save('analytics.pdf');
    toast.success('PDF exported');
  }, [stats]);
  
  
const [search, setSearch] = useState("");
const [sortField, setSortField] = useState<string | null>(null);
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

{/*const processedResponses = [...filteredResponses]
  .filter((r) =>
    form?.fields?.some((f: any) =>
      String(r.responses?.[f.id] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  )
  .sort((a, b) => {
    if (!sortField) return 0;

    const valA = a.responses?.[sortField];
    const valB = b.responses?.[sortField];

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  */}
  const processedResponses = [...filteredResponses]
  .filter((r) => {
    if (!search) return true;

    return (form?.fields || []).some((f: any) => {
      const value = r.responses?.[f.id];

      if (!value) return false;

      return String(value)
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  })


  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate(-1)} variant="ghost">
            <ArrowLeft />
          </Button>

          <img src={lf} className="w-10 h-10 object-contain" />

          <div>
            <h1 className="font-bold">{form?.title}</h1>
            <p className="text-xs">{processedResponses.length} responses</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportCSV}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportPDF}>
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* TABS */}
      <main className="max-w-4xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>

          <TabsList className="mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="question">Question</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
          </TabsList>

          {/* SUMMARY */}
          <TabsContent value="summary">
            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map(s => (
                <Card key={s.label}>
                  <CardContent className="p-6">
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p>{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
{/* FIELDS GRID */}
{/*<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">

  {(form?.fields || []).map((field: any) => (
    <Card key={field.id} className="h-full hover:shadow-lg transition">
      <CardHeader>
        <CardTitle>{field.label}</CardTitle>
      </CardHeader>

      <CardContent>
        {field.type === 'radio' || field.type === 'checkbox' ? (
          <div className="h-[250px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={(() => {
                    const counts: any = {};
                    field.options?.forEach((o: any) => counts[o.label] = 0);

                    filteredResponses.forEach(r => {
                      const val = r.responses?.[field.id];

                      if (Array.isArray(val)) {
                        val.forEach(v => {
                          const opt = (field.options ?? []).find((o: any) => o.value === v);
                          if (opt) counts[opt.label]++;
                        });
                      } else {
                        const opt = (field.options ?? []).find((o: any) => o.value === val);
                        if (opt) counts[opt.label]++;
                      }
                    });

                    return Object.entries(counts).map(([name, value]) => ({
                      name,
                      value
                    }));
                  })()}
                  dataKey="value"
                >
                  {field.options?.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-1 text-sm">
            {filteredResponses.slice(0, 5).map((r, i) => (
              <p key={i} className="truncate">
                {r.responses?.[field.id]}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  ))}

</div>
*/}
{/* SEARCH */}
<div className="mb-4">
  <input
    type="text"
    placeholder="Search responses..."
    className="w-full border p-2 rounded"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

{/* TABLE SECTION */}
<div className="overflow-x-auto">

  <table className="w-full border border-border text-sm text-foreground">
    
    {/* HEADER */}
    <thead className="bg-muted text-foreground sticky top-0 z-10">
      <tr>
        {/* FIXED COLUMN (#) */}
        <th className="border p-2 sticky left-0 bg-muted z-20">
          #
        </th>

        {(form?.fields || []).map((field: any) => (
          <th
            key={field.id}
            className="border p-2 whitespace-nowrap min-w-[150px] cursor-pointer hover:bg-muted/70"
            onClick={() => {
              if (sortField === field.id) {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              } else {
                setSortField(field.id);
                setSortOrder("asc");
              }
            }}
          >
            {field.label}
            {sortField === field.id && (
              <span className="ml-1">
                {sortOrder === "asc" ? "↑" : "↓"}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {processedResponses.map((r, rowIndex) => (
        <tr key={r.id || rowIndex} className="hover:bg-muted/50">
          
          {/* FIXED FIRST COLUMN */}
         <td className="border p-2 text-center sticky left-0 bg-background z-10 text-foreground">
            {rowIndex + 1}
          </td>

          {/* FIELD VALUES */}
          {(form?.fields || []).map((field: any) => (
            <td
  key={field.id}
  className="border p-2 whitespace-nowrap min-w-[150px] text-muted-foreground"
>
             {/*} {Array.isArray(r.responses?.[field.id])
                ? r.responses?.[field.id].join(', ')
                : r.responses?.[field.id] ?? '—'}
                */}

                {Array.isArray(r.responses?.[field.id])
  ? r.responses?.[field.id].join(', '):
  field.type === 'date' && r.responses?.[field.id]
  ? format(new Date(r.responses?.[field.id]), 'yyyy-MM-dd')
  : r.responses?.[field.id] ?? '—'
                }
            </td>
          ))}
        </tr>
      ))}
    </tbody>

  </table>
</div>



          </TabsContent>

          {/* QUESTION VIEW */}
          <TabsContent value="question">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Select Question</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {(form?.fields || []).map((f: any) => (
                  <DropdownMenuItem
                    key={f.id}
                    onClick={() => setSelectedQuestion(f)}
                  >
                    {f.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-6">
              {filteredResponses.map((r, i) => (
                
                <Card key={i} className="mb-3 p-4">
  {selectedQuestion?.type === 'date'
    ? new Date(r.responses?.[selectedQuestion?.id]).toLocaleDateString()
    : r.responses?.[selectedQuestion?.id] ?? '—'}
</Card>
              ))}
            </div>
          </TabsContent>

          {/* INDIVIDUAL */}
          <TabsContent value="individual">
            {filteredResponses.length > 0 && (
              <>
                <div className="flex gap-2 mb-4">
                  <Button
                    disabled={currentResponseIndex === 0}
                    onClick={() => setCurrentResponseIndex(i => i - 1)}
                  >
                    <ChevronLeft />
                  </Button>

                  <Button
                    disabled={currentResponseIndex === filteredResponses.length - 1}
                    onClick={() => setCurrentResponseIndex(i => i + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>

                <Card className="p-6">
                  {(form?.fields || []).map((f: any) => (
                    <div key={f.id} className="mb-4">
                      <p className="font-semibold">{f.label}</p>
                      <p>
  {f.type === 'date'
    ? new Date(filteredResponses[currentResponseIndex]?.responses?.[f.id]).toLocaleDateString()
    : filteredResponses[currentResponseIndex]?.responses?.[f.id] ?? '—'}
</p>
                    </div>
                  ))}
                </Card>
              </>
            )}
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
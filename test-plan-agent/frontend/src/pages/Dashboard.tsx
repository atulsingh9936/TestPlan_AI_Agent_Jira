import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jiraApi, templatesApi, testplanApi } from '@/services/api';
import { JiraTicket, Template, RecentTicket } from '@/types';
import { Search, Loader2, FileText, Download, Copy, History, Sparkles, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard() {
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState<JiraTicket | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [testPlan, setTestPlan] = useState('');
  const [isLoading, setIsLoading] = useState({
    ticket: false,
    generate: false,
  });
  const [generationStep, setGenerationStep] = useState('');
  const [streamedContent, setStreamedContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadTemplates();
    loadRecentTickets();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await templatesApi.getAll();
      if (res.data.success) {
        setTemplates(res.data.templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadRecentTickets = async () => {
    try {
      const res = await jiraApi.getRecent();
      if (res.data.success) {
        setRecentTickets(res.data.tickets);
      }
    } catch (error) {
      console.error('Failed to load recent tickets:', error);
    }
  };

  const fetchTicket = async () => {
    if (!ticketId || !/^[A-Z]+-\d+$/.test(ticketId)) {
      alert('Please enter a valid JIRA ticket ID (e.g., VWO-123)');
      return;
    }

    setIsLoading({ ...isLoading, ticket: true });
    setGenerationStep('Fetching ticket...');
    
    try {
      const res = await jiraApi.fetchTicket(ticketId);
      if (res.data.success) {
        setTicket(res.data.data);
        loadRecentTickets();
      } else {
        alert('Failed to fetch ticket: ' + res.data.error);
      }
    } catch (error) {
      alert('Error fetching ticket');
    }
    
    setIsLoading({ ...isLoading, ticket: false });
    setGenerationStep('');
  };

  const generateTestPlan = async (useStream = false) => {
    if (!ticket) {
      alert('Please fetch a ticket first');
      return;
    }

    setIsLoading({ ...isLoading, generate: true });
    setTestPlan('');
    setStreamedContent('');
    setGenerationStep('Generating test plan...');

    try {
      if (useStream) {
        // Streaming generation
        const eventSource = testplanApi.streamGenerate({
          ticketId: ticket.key,
          templateId: selectedTemplate || undefined,
        });

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.chunk) {
            setStreamedContent((prev) => prev + data.chunk);
          }
          
          if (data.done) {
            setTestPlan(streamedContent);
            eventSource.close();
            setIsLoading({ ...isLoading, generate: false });
            setGenerationStep('');
          }
          
          if (data.error) {
            alert('Generation error: ' + data.error);
            eventSource.close();
            setIsLoading({ ...isLoading, generate: false });
            setGenerationStep('');
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          setIsLoading({ ...isLoading, generate: false });
          setGenerationStep('');
        };
      } else {
        // Non-streaming generation
        const res = await testplanApi.generate({
          ticketId: ticket.key,
          templateId: selectedTemplate || undefined,
        });

        if (res.data.success) {
          setTestPlan(res.data.data.content);
        } else {
          alert('Failed to generate test plan: ' + res.data.error);
        }
        
        setIsLoading({ ...isLoading, generate: false });
        setGenerationStep('');
      }
    } catch (error) {
      alert('Error generating test plan');
      setIsLoading({ ...isLoading, generate: false });
      setGenerationStep('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(testPlan || streamedContent);
    alert('Copied to clipboard!');
  };

  const downloadMarkdown = () => {
    const blob = new Blob([testPlan || streamedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-plan-${ticket?.key || 'generated'}.md`;
    a.click();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Generate Test Plan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Ticket Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Fetch JIRA Ticket
              </CardTitle>
              <CardDescription>Enter a JIRA ticket ID to fetch its details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="VWO-123"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && fetchTicket()}
                />
                <Button onClick={fetchTicket} disabled={isLoading.ticket}>
                  {isLoading.ticket ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Fetch
                </Button>
              </div>

              {/* Recent Tickets */}
              {recentTickets.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <History className="h-4 w-4" />
                    Recent Tickets
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {recentTickets.map((t) => (
                      <Button
                        key={t.ticket_key}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTicketId(t.ticket_key);
                          fetchTicket();
                        }}
                      >
                        {t.ticket_key}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Details */}
          {ticket && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{ticket.key}</CardTitle>
                    <CardDescription className="mt-1">{ticket.summary}</CardDescription>
                  </div>
                  <Badge variant={ticket.priority === 'High' ? 'destructive' : 'default'}>
                    {ticket.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium">{ticket.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assignee:</span>
                    <span className="ml-2 font-medium">{ticket.assignee}</span>
                  </div>
                </div>
                
                {ticket.description && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Description</Label>
                    <div className="bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                      {ticket.description.slice(0, 500)}
                      {ticket.description.length > 500 && '...'}
                    </div>
                  </div>
                )}

                {ticket.acceptanceCriteria && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Acceptance Criteria</Label>
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {ticket.acceptanceCriteria}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Template
              </CardTitle>
              <CardDescription>Select a template for test plan generation</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Default template (no template selected)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={() => generateTestPlan(false)}
            disabled={!ticket || isLoading.generate}
            className="w-full"
            size="lg"
          >
            {isLoading.generate ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            {isLoading.generate ? generationStep : 'Generate Test Plan'}
          </Button>
        </div>

        {/* Right Column - Output */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Test Plan
                </CardTitle>
                {(testPlan || streamedContent) && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {(testPlan || streamedContent) ? (
                <div className="prose prose-sm max-w-none dark:prose-invert bg-muted p-4 rounded-md max-h-[600px] overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {streamedContent || testPlan}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 opacity-20" />
                  <p>Generated test plan will appear here</p>
                  <p className="text-sm">Fetch a ticket and click Generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { settingsApi } from '@/services/api';
import { CheckCircle, XCircle, Cloud, Server, Save, TestTube } from 'lucide-react';

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'llama3-8b-8192',
  'mixtral-8x7b-32768',
  'gemma-7b-it',
];

export default function Settings() {
  const [jiraConfig, setJiraConfig] = useState({
    baseUrl: '',
    username: '',
    apiToken: '',
  });
  
  const [llmConfig, setLlmConfig] = useState({
    provider: 'groq' as 'groq' | 'ollama',
    groq: {
      apiKey: '',
      model: 'llama3-70b-8192',
      temperature: 0.7,
    },
    ollama: {
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2',
    },
  });
  
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<{
    jira: boolean | null;
    groq: boolean | null;
    ollama: boolean | null;
  }>({ jira: null, groq: null, ollama: null });
  const [loading, setLoading] = useState({
    jira: false,
    groq: false,
    ollama: false,
    save: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [jiraRes, llmRes] = await Promise.all([
        settingsApi.getJira(),
        settingsApi.getLLM(),
      ]);
      
      if (jiraRes.data.success) {
        setJiraConfig(jiraRes.data.data);
      }
      
      if (llmRes.data.success) {
        setLlmConfig(llmRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const testJiraConnection = async () => {
    setLoading({ ...loading, jira: true });
    try {
      const res = await settingsApi.testJira();
      setConnectionStatus({ ...connectionStatus, jira: res.data.success });
    } catch (error) {
      setConnectionStatus({ ...connectionStatus, jira: false });
    }
    setLoading({ ...loading, jira: false });
  };

  const testGroqConnection = async () => {
    setLoading({ ...loading, groq: true });
    try {
      const res = await settingsApi.testGroq(llmConfig.groq.apiKey);
      setConnectionStatus({ ...connectionStatus, groq: res.data.success });
    } catch (error) {
      setConnectionStatus({ ...connectionStatus, groq: false });
    }
    setLoading({ ...loading, groq: false });
  };

  const testOllamaConnection = async () => {
    setLoading({ ...loading, ollama: true });
    try {
      const res = await settingsApi.testOllama(llmConfig.ollama.baseUrl);
      setConnectionStatus({ ...connectionStatus, ollama: res.data.success });
      if (res.data.success && res.data.models) {
        setOllamaModels(res.data.models);
      }
    } catch (error) {
      setConnectionStatus({ ...connectionStatus, ollama: false });
    }
    setLoading({ ...loading, ollama: false });
  };

  const fetchOllamaModels = async () => {
    try {
      const res = await settingsApi.getOllamaModels();
      if (res.data.success && res.data.models) {
        setOllamaModels(res.data.models);
      }
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
    }
  };

  const saveJiraSettings = async () => {
    setLoading({ ...loading, save: true });
    try {
      await settingsApi.saveJira(jiraConfig);
      alert('JIRA settings saved successfully!');
    } catch (error) {
      alert('Failed to save JIRA settings');
    }
    setLoading({ ...loading, save: false });
  };

  const saveLLMSettings = async () => {
    setLoading({ ...loading, save: true });
    try {
      await settingsApi.saveLLM(llmConfig);
      alert('LLM settings saved successfully!');
    } catch (error) {
      alert('Failed to save LLM settings');
    }
    setLoading({ ...loading, save: false });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="jira" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="jira">JIRA Configuration</TabsTrigger>
          <TabsTrigger value="llm">LLM Provider</TabsTrigger>
        </TabsList>

        <TabsContent value="jira">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                JIRA Configuration
                {connectionStatus.jira === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                {connectionStatus.jira === false && <XCircle className="h-5 w-5 text-red-500" />}
              </CardTitle>
              <CardDescription>Configure your JIRA instance connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="jira-url">JIRA Base URL</Label>
                <Input
                  id="jira-url"
                  placeholder="https://your-domain.atlassian.net"
                  value={jiraConfig.baseUrl}
                  onChange={(e) => setJiraConfig({ ...jiraConfig, baseUrl: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jira-username">Username / Email</Label>
                <Input
                  id="jira-username"
                  placeholder="your-email@example.com"
                  value={jiraConfig.username}
                  onChange={(e) => setJiraConfig({ ...jiraConfig, username: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jira-token">API Token</Label>
                <Input
                  id="jira-token"
                  type="password"
                  placeholder="your-jira-api-token"
                  value={jiraConfig.apiToken}
                  onChange={(e) => setJiraConfig({ ...jiraConfig, apiToken: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Generate an API token from your{' '}
                  <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Atlassian Account Settings
                  </a>
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={testJiraConnection} disabled={loading.jira} variant="outline">
                  <TestTube className="mr-2 h-4 w-4" />
                  {loading.jira ? 'Testing...' : 'Test Connection'}
                </Button>
                <Button onClick={saveJiraSettings} disabled={loading.save}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading.save ? 'Saving...' : 'Save JIRA Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm">
          <Card>
            <CardHeader>
              <CardTitle>LLM Provider Settings</CardTitle>
              <CardDescription>Choose between cloud (Groq) or local (Ollama) LLM providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {llmConfig.provider === 'groq' ? <Cloud className="h-5 w-5" /> : <Server className="h-5 w-5" />}
                  <span className="font-medium">Use {llmConfig.provider === 'groq' ? 'Cloud LLM (Groq)' : 'Local LLM (Ollama)'}</span>
                </div>
                <Switch
                  checked={llmConfig.provider === 'ollama'}
                  onCheckedChange={(checked) =>
                    setLlmConfig({ ...llmConfig, provider: checked ? 'ollama' : 'groq' })
                  }
                />
              </div>

              {llmConfig.provider === 'groq' ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Groq Configuration</h3>
                    {connectionStatus.groq === true && <Badge variant="default" className="bg-green-500">Connected</Badge>}
                    {connectionStatus.groq === false && <Badge variant="destructive">Failed</Badge>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groq-key">Groq API Key</Label>
                    <Input
                      id="groq-key"
                      type="password"
                      placeholder="gsk_..."
                      value={llmConfig.groq.apiKey}
                      onChange={(e) =>
                        setLlmConfig({
                          ...llmConfig,
                          groq: { ...llmConfig.groq, apiKey: e.target.value },
                        })
                      }
                    />
                    <p className="text-sm text-muted-foreground">
                      Get your API key from{' '}
                      <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Groq Console
                      </a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={llmConfig.groq.model}
                      onValueChange={(value) =>
                        setLlmConfig({
                          ...llmConfig,
                          groq: { ...llmConfig.groq, model: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GROQ_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature: {llmConfig.groq.temperature}</Label>
                    <Slider
                      value={[llmConfig.groq.temperature]}
                      onValueChange={([value]) =>
                        setLlmConfig({
                          ...llmConfig,
                          groq: { ...llmConfig.groq, temperature: value },
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <Button onClick={testGroqConnection} disabled={loading.groq} variant="outline">
                    <TestTube className="mr-2 h-4 w-4" />
                    {loading.groq ? 'Testing...' : 'Test Groq Connection'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Ollama Configuration</h3>
                    {connectionStatus.ollama === true && <Badge variant="default" className="bg-green-500">Connected</Badge>}
                    {connectionStatus.ollama === false && <Badge variant="destructive">Failed</Badge>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ollama-url">Base URL</Label>
                    <Input
                      id="ollama-url"
                      placeholder="http://localhost:11434"
                      value={llmConfig.ollama.baseUrl}
                      onChange={(e) =>
                        setLlmConfig({
                          ...llmConfig,
                          ollama: { ...llmConfig.ollama, baseUrl: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Model</Label>
                    <div className="flex gap-2">
                      <Select
                        value={llmConfig.ollama.model}
                        onValueChange={(value) =>
                          setLlmConfig({
                            ...llmConfig,
                            ollama: { ...llmConfig.ollama, model: value },
                          })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select or enter model" />
                        </SelectTrigger>
                        <SelectContent>
                          {ollamaModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                          <SelectItem value="llama3.2">llama3.2 (default)</SelectItem>
                          <SelectItem value="mistral">mistral</SelectItem>
                          <SelectItem value="codellama">codellama</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={fetchOllamaModels}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  <Button onClick={testOllamaConnection} disabled={loading.ollama} variant="outline">
                    <TestTube className="mr-2 h-4 w-4" />
                    {loading.ollama ? 'Testing...' : 'Test Ollama Connection'}
                  </Button>
                </div>
              )}

              <Button onClick={saveLLMSettings} disabled={loading.save} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {loading.save ? 'Saving...' : 'Save LLM Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

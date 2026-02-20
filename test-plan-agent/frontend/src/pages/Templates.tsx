import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { templatesApi } from '@/services/api';
import { Template } from '@/types';
import { Upload, FileText, X, Check, Loader2 } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadStatus({ success: false, message: 'Only PDF files are allowed' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ success: false, message: 'File size must be less than 5MB' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const res = await templatesApi.upload(file);
      if (res.data.success) {
        setUploadStatus({ success: true, message: 'Template uploaded successfully!' });
        loadTemplates();
      } else {
        setUploadStatus({ success: false, message: res.data.error || 'Upload failed' });
      }
    } catch (error) {
      setUploadStatus({ success: false, message: 'Upload failed. Please try again.' });
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const viewTemplate = async (template: Template) => {
    try {
      const res = await templatesApi.getById(template.id);
      if (res.data.success) {
        setSelectedTemplate(res.data.template);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  // Load templates on mount
  useState(() => {
    loadTemplates();
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Template Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Template
              </CardTitle>
              <CardDescription>
                Upload a PDF template to use for test plan generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF files up to 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}

              {uploadStatus && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                    uploadStatus.success
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {uploadStatus.success ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {uploadStatus.message}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Templates List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>Click on a template to preview its content</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No templates uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted border border-transparent'
                      }`}
                      onClick={() => viewTemplate(template)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(template.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
              <CardDescription>
                {selectedTemplate
                  ? `Previewing: ${selectedTemplate.name}`
                  : 'Select a template to preview'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  {selectedTemplate.sections && selectedTemplate.sections.length > 0 ? (
                    <div className="space-y-4">
                      {selectedTemplate.sections.map((section: any, index: number) => (
                        <div key={index} className="border-b border-muted pb-4 last:border-0">
                          <h3 className="font-semibold text-sm mb-2">{section.title}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {section.content.slice(0, 500)}
                            {section.content.length > 500 && '...'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedTemplate.content?.slice(0, 2000)}
                        {(selectedTemplate.content?.length || 0) > 2000 && '...'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 opacity-20" />
                  <p>Select a template to preview its content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

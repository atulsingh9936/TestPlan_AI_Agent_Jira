import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbAsync } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFService {
  constructor() {
    this.templatesDir = path.join(__dirname, '../../../templates');
  }

  async parsePDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      return {
        text: data.text,
        pages: data.numpages,
        info: data.info
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  extractSections(text) {
    const sectionPatterns = [
      /^(?:\d+\.)?\s*(OVERVIEW|INTRODUCTION|SCOPE)/im,
      /^(?:\d+\.)?\s*(TEST SCENARIOS?|TEST CASES?)/im,
      /^(?:\d+\.)?\s*(ACCEPTANCE CRITERIA?)/im,
      /^(?:\d+\.)?\s*(TEST DATA|PREREQUISITES)/im,
      /^(?:\d+\.)?\s*(ENVIRONMENT|SETUP)/im,
      /^(?:\d+\.)?\s*(RISKS?|ASSUMPTIONS?)/im
    ];

    const sections = [];
    const lines = text.split('\n');
    let currentSection = { title: 'General', content: [] };

    for (const line of lines) {
      const trimmedLine = line.trim();
      let isHeader = false;

      for (const pattern of sectionPatterns) {
        if (pattern.test(trimmedLine)) {
          if (currentSection.content.length > 0) {
            sections.push({
              title: currentSection.title,
              content: currentSection.content.join('\n').trim()
            });
          }
          currentSection = { title: trimmedLine, content: [] };
          isHeader = true;
          break;
        }
      }

      if (!isHeader && trimmedLine) {
        currentSection.content.push(trimmedLine);
      }
    }

    if (currentSection.content.length > 0) {
      sections.push({
        title: currentSection.title,
        content: currentSection.content.join('\n').trim()
      });
    }

    return sections;
  }

  async saveTemplate(filePath, originalName) {
    try {
      const parsed = await this.parsePDF(filePath);
      const sections = this.extractSections(parsed.text);
      
      const templateId = uuidv4();
      
      await dbAsync.run(`
        INSERT INTO templates (id, name, filename, content, sections, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [templateId, originalName.replace('.pdf', ''), originalName, parsed.text, JSON.stringify(sections)]);

      const template = {
        id: templateId,
        name: originalName.replace('.pdf', ''),
        filename: originalName,
        content: parsed.text,
        sections: sections
      };

      return { success: true, template };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAllTemplates() {
    try {
      const templates = await dbAsync.all('SELECT id, name, filename, created_at FROM templates ORDER BY created_at DESC');
      return { success: true, templates };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getTemplateById(id) {
    try {
      const template = await dbAsync.get('SELECT * FROM templates WHERE id = ?', [id]);
      if (template && template.sections) {
        try {
          template.sections = JSON.parse(template.sections);
        } catch (e) {
          template.sections = [];
        }
      }
      return { success: true, template };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new PDFService();

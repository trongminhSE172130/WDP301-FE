export interface ValidationRules {
  min?: number;
  max?: number;
  pattern?: string;
  min_length?: number;
  max_length?: number;
  options?: string[];
  file_types?: string[];
}

export interface ConditionalLogic {
  show_if?: {
    field: string;
    operator: string;
    value: string;
  };
}

export interface FormField {
  validation_rules: ValidationRules;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'file';
  is_required: boolean;
  placeholder?: string;
  help_text?: string;
  order: number;
  conditional_logic?: ConditionalLogic;
}

export interface FormSection {
  section_name: string;
  section_label: string;
  description?: string;
  order: number;
  fields: FormField[];
}

export interface Service {
  _id: string;
  title: string;
  description: string;
}

export interface Creator {
  _id: string;
  full_name: string;
  email: string;
}

export interface DynamicForm {
  _id: string;
  service_id: string | Service;
  form_type: string;
  form_name: string;
  form_description: string;
  sections: FormSection[];
  version: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  __v: number;
  error?: string;
}

export interface DynamicFormResponse {
  success: boolean;
  count: number;
  data: DynamicForm[];
}

export interface DynamicFormCreate {
  service_id: string;
  form_type: string;
  form_name: string;
  form_description: string;
  sections: FormSection[];
}

export interface FormSubmissionData {
  [key: string]: string | number | boolean | string[] | File | null | undefined;
} 
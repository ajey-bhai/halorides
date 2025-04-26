import { getSupabase } from '@/lib/supabase';

// Define the lead type
export interface Lead {
  id?: string;
  parentName: string;
  childGrade: string;
  schoolName?: string;
  city: string;
  mobileNumber: string;
  email?: string;
  createdAt?: string;
}

// Service for handling lead operations with Supabase
export const leadService = {
  // Submit a new lead
  async submitLead(leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    try {
      const supabase = await getSupabase();
      
      // Insert the lead into the 'leads' table
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          parent_name: leadData.parentName,
          child_grade: leadData.childGrade,
          school_name: leadData.schoolName || null,
          city: leadData.city,
          mobile_number: leadData.mobileNumber,
          // Convert empty string to null for database storage
          email: leadData.email && leadData.email.trim() !== '' ? leadData.email : null,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Supabase error: ${error.message}. ${error.hint || ''}`);
      }
      
      if (!data) {
        throw new Error('Failed to create lead: No data returned');
      }
      
      // Accessing data safely
      const id = data?.id as string;
      const parent_name = data?.parent_name as string;
      const child_grade = data?.child_grade as string;
      const school_name = data?.school_name as string | null;
      const city = data?.city as string;
      const mobile_number = data?.mobile_number as string;
      const email = data?.email as string | null;
      const created_at = data?.created_at as string;
      
      // Transform from database format (snake_case) to client format (camelCase)
      return {
        id: id,
        parentName: parent_name,
        childGrade: child_grade,
        schoolName: school_name || undefined,
        city: city,
        mobileNumber: mobile_number,
        email: email || undefined,
        createdAt: created_at,
      };
    } catch (error) {
      console.error('Error submitting lead:', error);
      throw error;
    }
  }
};
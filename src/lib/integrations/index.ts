import { supabase } from '../supabase';

export interface IntegrationConfig {
  id: string;
  type: 'payment' | 'maps' | 'analytics';
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastChecked?: Date;
  errorMessage?: string;
}

export const saveIntegrationConfig = async (config: Partial<IntegrationConfig>) => {
  const { data, error } = await supabase
    .from('integration_configs')
    .upsert([config])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getIntegrationConfig = async (type: string) => {
  const { data, error } = await supabase
    .from('integration_configs')
    .select('*')
    .eq('type', type)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const testIntegration = async (type: string, config: Record<string, any>) => {
  // Simulate API test
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would test the actual integration
  return {
    success: true,
    message: 'Integration test successful'
  };
};

export const deleteIntegrationConfig = async (id: string) => {
  const { error } = await supabase
    .from('integration_configs')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
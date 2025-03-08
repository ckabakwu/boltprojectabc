import { supabase } from './supabase';

export interface IntegrationConfig {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastChecked?: Date;
  errorMessage?: string;
}

class IntegrationHub {
  private configs: Map<string, IntegrationConfig> = new Map();

  async loadConfigs() {
    const { data, error } = await supabase
      .from('integration_configs')
      .select('*');

    if (error) throw error;

    data.forEach(config => {
      this.configs.set(config.id, config);
    });
  }

  async saveConfig(config: IntegrationConfig) {
    const { data, error } = await supabase
      .from('integration_configs')
      .upsert([config])
      .select()
      .single();

    if (error) throw error;

    this.configs.set(config.id, data);
    return data;
  }

  async deleteConfig(id: string) {
    const { error } = await supabase
      .from('integration_configs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    this.configs.delete(id);
  }

  async testConnection(config: IntegrationConfig) {
    try {
      // Implement connection testing logic based on integration type
      const result = await this.testIntegration(config);
      
      await this.saveConfig({
        ...config,
        status: result.success ? 'active' : 'error',
        lastChecked: new Date(),
        errorMessage: result.error
      });

      return result;
    } catch (error) {
      await this.saveConfig({
        ...config,
        status: 'error',
        lastChecked: new Date(),
        errorMessage: error.message
      });

      throw error;
    }
  }

  private async testIntegration(config: IntegrationConfig) {
    switch (config.type) {
      case 'payment':
        return this.testPaymentIntegration(config);
      case 'messaging':
        return this.testMessagingIntegration(config);
      case 'analytics':
        return this.testAnalyticsIntegration(config);
      default:
        throw new Error(`Unknown integration type: ${config.type}`);
    }
  }

  private async testPaymentIntegration(config: IntegrationConfig) {
    // Implement payment integration testing
    return { success: true };
  }

  private async testMessagingIntegration(config: IntegrationConfig) {
    // Implement messaging integration testing
    return { success: true };
  }

  private async testAnalyticsIntegration(config: IntegrationConfig) {
    // Implement analytics integration testing
    return { success: true };
  }

  getActiveConfigs() {
    return Array.from(this.configs.values())
      .filter(config => config.status === 'active');
  }

  getConfigsByType(type: string) {
    return Array.from(this.configs.values())
      .filter(config => config.type === type);
  }

  getConfig(id: string) {
    return this.configs.get(id);
  }
}

export const integrationHub = new IntegrationHub();
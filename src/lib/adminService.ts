import { supabase } from './supabase';
import { emailService } from './emailService';
import { systemTemplates } from './emailTemplates';
import mixpanel from './analytics';

interface SystemConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface HealthCheck {
  id: string;
  timestamp: string;
  endpoint: string;
  status: string;
  response_time: number;
  error?: string;
  metadata?: Record<string, any>;
}

class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // System Configuration
  public async getSystemConfig(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;

      // Convert array to key-value object
      return data.reduce((acc, setting) => ({
        ...acc,
        [setting.key]: setting.value
      }), {});
    } catch (error) {
      console.error('Error fetching system config:', error);
      throw error;
    }
  }

  public async updateSystemConfig(config: Record<string, any>): Promise<void> {
    try {
      const updates = Object.entries(config).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_settings')
        .upsert(updates, {
          onConflict: 'key'
        });

      if (error) throw error;

      mixpanel.track('Admin:System Config Updated', {
        config,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating system config:', error);
      throw error;
    }
  }

  // User Management
  public async getUsers(filters: Record<string, any> = {}) {
    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          customers:customers(id, loyalty_points, total_bookings),
          service_providers:service_providers(id, rating, total_jobs)
        `);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  public async updateUserStatus(userId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Log to audit trail
      await this.logAuditEvent({
        user_id: userId,
        action: 'status_update',
        details: { status }
      });

      mixpanel.track('Admin:User Status Updated', {
        userId,
        status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Analytics & Reporting
  public async getAnalytics(period: string = 'month') {
    try {
      const { data, error } = await supabase.rpc('get_analytics', { 
        p_period: period 
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  public async generateReport(type: string, filters: Record<string, any> = {}) {
    try {
      const { data, error } = await supabase.rpc('generate_report', {
        p_type: type,
        p_filters: filters
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Health Monitoring
  public async getSystemHealth(): Promise<HealthCheck[]> {
    try {
      const { data, error } = await supabase
        .from('api_health_checks')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking system health:', error);
      throw error;
    }
  }

  public async logApiHealth(check: Omit<HealthCheck, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_health_checks')
        .insert([{
          ...check,
          timestamp: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging API health:', error);
      throw error;
    }
  }

  // Audit Trail
  private async logAuditEvent(event: {
    user_id: string;
    action: string;
    details?: Record<string, any>;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_log')
        .insert([{
          user_id: event.user_id,
          action: event.action,
          metadata: event.details,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging audit event:', error);
      // Don't throw - we don't want audit logging to break main functionality
    }
  }

  // Maintenance Mode
  public async setMaintenanceMode(enabled: boolean, message?: string): Promise<void> {
    try {
      // Update system settings
      await this.updateSystemConfig({
        maintenance_mode: enabled,
        maintenance_message: message
      });

      // If enabling maintenance mode, notify admins
      if (enabled && message) {
        const { data: admins } = await supabase
          .from('users')
          .select('email')
          .eq('role', 'admin');

        if (admins) {
          await emailService.sendEmail({
            to: admins.map(admin => admin.email),
            template: systemTemplates.maintenanceAlert({
              startTime: new Date().toISOString(),
              duration: 'Unknown',
              impact: message
            }),
            metadata: {
              type: 'maintenance_alert'
            }
          });
        }
      }

      mixpanel.track('Admin:Maintenance Mode', {
        enabled,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error setting maintenance mode:', error);
      throw error;
    }
  }

  // Data Export
  public async exportData(tables: string[]): Promise<Record<string, any>[]> {
    try {
      const exports = await Promise.all(
        tables.map(async (table) => {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          return { table, data };
        })
      );

      mixpanel.track('Admin:Data Exported', {
        tables,
        timestamp: new Date().toISOString()
      });

      return exports;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

export const adminService = AdminService.getInstance();
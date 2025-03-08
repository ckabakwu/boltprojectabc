import { supabase } from './supabase';
import mixpanel from './analytics';

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

class SecurityMonitor {
  private static instance: SecurityMonitor;
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  private constructor() {}

  public static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  public async logEvent(event: Omit<SecurityEvent, 'id'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    // Add to local history
    this.events.unshift(securityEvent);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS);
    }

    // Log to database
    try {
      const { error } = await supabase
        .from('security_events')
        .insert([securityEvent]);

      if (error) throw error;

      // Track in analytics
      mixpanel.track('Security Event', {
        type: event.type,
        severity: event.severity,
        timestamp: securityEvent.timestamp.toISOString(),
        ...event.metadata
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  public getRecentEvents(severity?: SecurityEvent['severity']): SecurityEvent[] {
    return this.events
      .filter(event => !severity || event.severity === severity)
      .slice(0, 100);
  }

  public async getSecurityStats(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('timestamp', startDate.toISOString());

      if (error) throw error;

      return {
        total: data.length,
        bySeverity: data.reduce((acc: Record<string, number>, curr) => {
          acc[curr.severity] = (acc[curr.severity] || 0) + 1;
          return acc;
        }, {}),
        byType: data.reduce((acc: Record<string, number>, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
          return acc;
        }, {}),
        trend: this.calculateTrend(data)
      };
    } catch (error) {
      console.error('Error fetching security stats:', error);
      return null;
    }
  }

  private calculateTrend(data: SecurityEvent[]) {
    const dailyCounts: Record<string, number> = {};
    
    data.forEach(event => {
      const date = event.timestamp.toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }

  public clearHistory() {
    this.events = [];
  }
}

export const securityMonitor = SecurityMonitor.getInstance();
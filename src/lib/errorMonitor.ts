import { supabase } from './supabase';
import mixpanel from './analytics';

interface ErrorEvent {
  id: string;
  type: string;
  message: string;
  stack?: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private errors: ErrorEvent[] = [];
  private readonly MAX_ERRORS = 1000;

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private setupGlobalHandlers() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.logError('uncaught', error || new Error(message as string));
    };

    window.addEventListener('unhandledrejection', (event) => {
      this.logError('unhandled_promise', event.reason);
    });
  }

  public async logError(type: string, error: Error, metadata?: Record<string, any>) {
    const errorEvent: ErrorEvent = {
      id: crypto.randomUUID(),
      type,
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      metadata
    };

    // Add to local history
    this.errors.unshift(errorEvent);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(0, this.MAX_ERRORS);
    }

    // Log to database
    try {
      const { error: dbError } = await supabase
        .from('error_logs')
        .insert([errorEvent]);

      if (dbError) console.error('Failed to log error to database:', dbError);
    } catch (e) {
      console.error('Error logging to database:', e);
    }

    // Track in analytics
    mixpanel.track('Error', {
      type,
      message: error.message,
      timestamp: errorEvent.timestamp.toISOString(),
      ...metadata
    });
  }

  public getRecentErrors(limit: number = 100): ErrorEvent[] {
    return this.errors.slice(0, limit);
  }

  public async getErrorStats(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('type, created_at')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      return {
        total: data.length,
        byType: data.reduce((acc: Record<string, number>, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
          return acc;
        }, {}),
        trend: this.calculateTrend(data)
      };
    } catch (error) {
      console.error('Error fetching error stats:', error);
      return null;
    }
  }

  private calculateTrend(data: any[]) {
    const dailyCounts: Record<string, number> = {};
    
    data.forEach(error => {
      const date = new Date(error.created_at).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }

  public clearHistory() {
    this.errors = [];
  }
}

export const errorMonitor = ErrorMonitor.getInstance();
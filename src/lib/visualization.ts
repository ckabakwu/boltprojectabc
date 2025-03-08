import { format, subDays } from 'date-fns';

export interface VisualizationError {
  component: string;
  message: string;
  timestamp: Date;
  stack?: string;
}

export interface VisualizationCheck {
  component: string;
  status: 'success' | 'error';
  message?: string;
  timestamp: Date;
}

class VisualizationMonitor {
  private errors: VisualizationError[] = [];
  private checks: VisualizationCheck[] = [];

  logError(component: string, error: Error) {
    this.errors.push({
      component,
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
  }

  logCheck(check: VisualizationCheck) {
    this.checks.push(check);
  }

  getRecentErrors(days: number = 7) {
    const cutoff = subDays(new Date(), days);
    return this.errors.filter(error => error.timestamp > cutoff);
  }

  getRecentChecks(days: number = 7) {
    const cutoff = subDays(new Date(), days);
    return this.checks.filter(check => check.timestamp > cutoff);
  }

  getComponentHealth(component: string) {
    const recentChecks = this.getRecentChecks(1)
      .filter(check => check.component === component);

    if (recentChecks.length === 0) return 'unknown';

    const hasErrors = recentChecks.some(check => check.status === 'error');
    return hasErrors ? 'error' : 'healthy';
  }

  generateReport() {
    const components = [...new Set(this.checks.map(check => check.component))];
    
    return components.map(component => ({
      component,
      health: this.getComponentHealth(component),
      recentErrors: this.getRecentErrors(1)
        .filter(error => error.component === component),
      lastCheck: this.checks
        .filter(check => check.component === component)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
    }));
  }

  clearHistory(days: number = 30) {
    const cutoff = subDays(new Date(), days);
    this.errors = this.errors.filter(error => error.timestamp > cutoff);
    this.checks = this.checks.filter(check => check.timestamp > cutoff);
  }
}

export const visualizationMonitor = new VisualizationMonitor();

export const checkVisualization = async (
  component: string,
  checkFn: () => Promise<boolean>
) => {
  try {
    const success = await checkFn();
    visualizationMonitor.logCheck({
      component,
      status: success ? 'success' : 'error',
      timestamp: new Date()
    });
    return success;
  } catch (error) {
    visualizationMonitor.logError(component, error as Error);
    visualizationMonitor.logCheck({
      component,
      status: 'error',
      message: (error as Error).message,
      timestamp: new Date()
    });
    return false;
  }
};
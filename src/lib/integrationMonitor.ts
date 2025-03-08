import { integrationHub } from './integrationHub';
import { visualizationMonitor } from './visualization';
import { testAllIntegrations } from './integrationTests';

class IntegrationMonitor {
  private static instance: IntegrationMonitor;
  private checkInterval: number = 5 * 60 * 1000; // 5 minutes
  private intervalId?: number;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): IntegrationMonitor {
    if (!IntegrationMonitor.instance) {
      IntegrationMonitor.instance = new IntegrationMonitor();
    }
    return IntegrationMonitor.instance;
  }

  async startMonitoring() {
    // Initial check
    await this.checkIntegrations();

    // Set up periodic checks
    this.intervalId = window.setInterval(() => {
      this.checkIntegrations();
    }, this.checkInterval);
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async checkIntegrations() {
    try {
      const report = await testAllIntegrations();
      
      // Log results to visualization monitor
      report.results.forEach(result => {
        visualizationMonitor.logCheck({
          component: result.name,
          status: result.status === 'success' ? 'success' : 'error',
          message: result.error,
          timestamp: new Date()
        });
      });

      // Update integration hub status
      const activeConfigs = integrationHub.getActiveConfigs();
      activeConfigs.forEach(config => {
        const testResult = report.results.find(r => r.name.toLowerCase() === config.type);
        if (testResult) {
          integrationHub.saveConfig({
            ...config,
            status: testResult.status === 'success' ? 'active' : 'error',
            lastChecked: new Date(),
            errorMessage: testResult.error
          });
        }
      });

      return report;
    } catch (error) {
      console.error('Integration check failed:', error);
      return {
        timestamp: new Date().toISOString(),
        error: error.message,
        status: 'error'
      };
    }
  }

  async generateReport() {
    const report = await testAllIntegrations();
    const visualizationReport = visualizationMonitor.generateReport();
    
    return {
      ...report,
      visualizationHealth: visualizationReport,
      monitoringStatus: {
        isActive: !!this.intervalId,
        checkInterval: this.checkInterval,
        lastCheck: new Date().toISOString()
      }
    };
  }
}

export const integrationMonitor = IntegrationMonitor.getInstance();
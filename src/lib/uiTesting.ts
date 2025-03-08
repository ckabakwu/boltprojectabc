import { supabase } from './supabase';

interface UITestResult {
  component: string;
  status: 'success' | 'error';
  error?: string;
  details?: Record<string, any>;
}

export const testNavigation = async (): Promise<UITestResult[]> => {
  const results: UITestResult[] = [];
  
  // Test all navigation links
  const navLinks = document.querySelectorAll('a[href], button[type="button"]');
  navLinks.forEach(link => {
    try {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        // Verify link destination exists
        const route = href.split('?')[0];
        if (!document.querySelector(`[data-route="${route}"]`)) {
          results.push({
            component: 'Navigation',
            status: 'error',
            error: `Invalid route: ${route}`,
            details: { element: link.outerHTML }
          });
        }
      }
    } catch (error) {
      results.push({
        component: 'Navigation',
        status: 'error',
        error: error.message
      });
    }
  });

  return results;
};

export const testForms = async (): Promise<UITestResult[]> => {
  const results: UITestResult[] = [];

  // Test all forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    try {
      // Check required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) {
          results.push({
            component: 'Form',
            status: 'error',
            error: 'Required field missing accessibility label',
            details: { element: field.outerHTML }
          });
        }
      });

      // Check form submission
      const submitButton = form.querySelector('button[type="submit"]');
      if (!submitButton) {
        results.push({
          component: 'Form',
          status: 'error',
          error: 'Form missing submit button',
          details: { formId: form.id }
        });
      }
    } catch (error) {
      results.push({
        component: 'Form',
        status: 'error',
        error: error.message
      });
    }
  });

  return results;
};

export const testResponsiveness = async (): Promise<UITestResult[]> => {
  const results: UITestResult[] = [];

  // Test viewport meta tag
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport || !viewport.getAttribute('content')?.includes('width=device-width')) {
    results.push({
      component: 'Responsive',
      status: 'error',
      error: 'Missing or invalid viewport meta tag'
    });
  }

  // Test responsive images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      results.push({
        component: 'Accessibility',
        status: 'error',
        error: 'Image missing alt text',
        details: { src: img.src }
      });
    }
  });

  return results;
};

export const testAccessibility = async (): Promise<UITestResult[]> => {
  const results: UITestResult[] = [];

  // Test ARIA labels
  const interactiveElements = document.querySelectorAll('button, a[href], input, select, textarea');
  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && 
        !element.getAttribute('aria-labelledby') &&
        !element.getAttribute('title')) {
      results.push({
        component: 'Accessibility',
        status: 'error',
        error: 'Interactive element missing accessible name',
        details: { element: element.outerHTML }
      });
    }
  });

  return results;
};

export const runAllTests = async (): Promise<Record<string, UITestResult[]>> => {
  return {
    navigation: await testNavigation(),
    forms: await testForms(),
    responsive: await testResponsiveness(),
    accessibility: await testAccessibility()
  };
};
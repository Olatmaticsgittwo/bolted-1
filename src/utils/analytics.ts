// Google Analytics 4 Integration
export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 tracking ID

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Track custom events
export const event = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track conversions
export const trackConversion = (transactionType: 'buy' | 'sell', amount: number, crypto: string) => {
  event('conversion', 'transaction', `${transactionType}_${crypto}`, amount);
  
  // Track as purchase for GA4 Enhanced Ecommerce
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      value: amount,
      currency: 'USD',
      items: [{
        item_id: crypto,
        item_name: `${crypto} ${transactionType}`,
        category: 'cryptocurrency',
        quantity: 1,
        price: amount
      }]
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formType: string) => {
  event('form_submit', 'engagement', formType);
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  event('click', 'engagement', `${buttonName}_${location}`);
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
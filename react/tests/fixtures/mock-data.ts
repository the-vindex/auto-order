export const mockProducts = {
  validAmazonUrl: 'https://www.amazon.com/test-product/dp/B08N5WRWNW',
  invalidUrl: 'not-a-valid-url',
  nonAmazonUrl: 'https://www.google.com',
} as const;

export const mockReminderData = {
  basic: {
    url: mockProducts.validAmazonUrl,
    targetPrice: '29.99',
    name: 'Test reminder for automation'
  },
  // API format for direct testing
  basicApiFormat: {
    name: 'Test reminder for automation',
    urls: [mockProducts.validAmazonUrl],
    reminderDetails: {
      type: 'priceDrop',
      initialPrice: { amount: 50.00, currency: 'USD' },
      targetPrice: { amount: 29.99, currency: 'USD' }
    }
  },
  highPrice: {
    url: mockProducts.validAmazonUrl,
    targetPrice: '999.99',
    name: 'High price test reminder'
  },
  invalidPrice: {
    url: mockProducts.validAmazonUrl,
    targetPrice: 'not-a-number',
    name: 'Invalid price test'
  },
  emptyUrl: {
    url: '',
    targetPrice: '25.00',
    name: 'Empty URL test'
  }
} as const;

export const testMessages = {
  errors: {
    invalidUrl: 'Please enter a valid URL',
    invalidPrice: 'Please enter a valid price',
    loginFailed: 'Invalid email or password',
    unauthorized: 'Please log in to continue'
  },
  success: {
    reminderCreated: 'Reminder created successfully',
    reminderUpdated: 'Reminder updated successfully',
    reminderDeleted: 'Reminder deleted successfully'
  }
} as const;
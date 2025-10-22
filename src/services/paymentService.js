// Payment Service - Abstracted payment processing with feature flags
// Supports traditional providers (Stripe, PayPal) and blockchain

import config from '../utils/config.js';

// Payment Processor Interface
class PaymentProcessor {
  async processPayment(amount, currency, paymentMethod) {
    throw new Error('processPayment must be implemented by subclass');
  }

  async refundPayment(paymentId, amount) {
    throw new Error('refundPayment must be implemented by subclass');
  }

  get name() {
    return this.constructor.name;
  }
}

// Stripe Payment Processor
class StripeProcessor extends PaymentProcessor {
  async processPayment(amount, currency, paymentMethod) {
    // Implement Stripe API integration
    console.log(`Processing $${amount} ${currency} via Stripe`);
    // TODO: Integrate with Stripe SDK
    return { success: true, transactionId: 'stripe_txn_' + Date.now() };
  }

  async refundPayment(paymentId, amount) {
    // Implement Stripe refund
    console.log(`Refunding $${amount} for payment ${paymentId} via Stripe`);
    return { success: true, refundId: 'stripe_refund_' + Date.now() };
  }
}

// PayPal Payment Processor
class PayPalProcessor extends PaymentProcessor {
  async processPayment(amount, currency, paymentMethod) {
    // Implement PayPal API integration
    console.log(`Processing $${amount} ${currency} via PayPal`);
    // TODO: Integrate with PayPal SDK
    return { success: true, transactionId: 'paypal_txn_' + Date.now() };
  }

  async refundPayment(paymentId, amount) {
    // Implement PayPal refund
    console.log(`Refunding $${amount} for payment ${paymentId} via PayPal`);
    return { success: true, refundId: 'paypal_refund_' + Date.now() };
  }
}

// Blockchain Payment Processor
class BlockchainProcessor extends PaymentProcessor {
  async processPayment(amount, currency, paymentMethod) {
    // Implement blockchain payment (crypto transfer)
    console.log(`Processing ${amount} ${currency} via Blockchain`);
    // TODO: Integrate with Web3/blockchain service
    return { success: true, transactionId: 'blockchain_txn_' + Date.now() };
  }

  async refundPayment(paymentId, amount) {
    // Implement blockchain refund (if possible)
    console.log(`Refunding ${amount} for payment ${paymentId} via Blockchain`);
    return { success: true, refundId: 'blockchain_refund_' + Date.now() };
  }
}

// Payment Service - Main service class
class PaymentService {
  constructor() {
    this.processors = {
      stripe: new StripeProcessor(),
      paypal: new PayPalProcessor(),
      blockchain: new BlockchainProcessor()
    };

    this.defaultProcessor = 'stripe'; // Fallback
  }

  // Get available payment methods based on feature flags
  getAvailablePaymentMethods() {
    const methods = [];

    if (config.features.traditionalPayments) {
      methods.push(
        { id: 'stripe', name: 'Credit Card (Stripe)', processor: 'stripe' },
        { id: 'paypal', name: 'PayPal', processor: 'paypal' }
      );
    }

    if (config.features.blockchainPayments) {
      methods.push(
        { id: 'blockchain', name: 'Cryptocurrency', processor: 'blockchain' }
      );
    }

    return methods;
  }

  // Process payment using appropriate processor
  async processPayment(amount, currency = 'USD', paymentMethodId, paymentDetails = {}) {
    const methods = this.getAvailablePaymentMethods();
    const method = methods.find(m => m.id === paymentMethodId);

    if (!method) {
      throw new Error('Payment method not available');
    }

    const processor = this.processors[method.processor];
    if (!processor) {
      throw new Error('Payment processor not found');
    }

    try {
      return await processor.processPayment(amount, currency, paymentDetails);
    } catch (error) {
      console.error(`Payment processing failed with ${processor.name}:`, error);

      // Fallback to default processor if enabled
      if (config.features.traditionalPayments && method.processor !== this.defaultProcessor) {
        console.log('Attempting fallback to default processor');
        const fallbackProcessor = this.processors[this.defaultProcessor];
        return await fallbackProcessor.processPayment(amount, currency, paymentDetails);
      }

      throw error;
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount, originalMethod) {
    const methods = this.getAvailablePaymentMethods();
    const method = methods.find(m => m.id === originalMethod);

    if (!method) {
      throw new Error('Original payment method not available for refund');
    }

    const processor = this.processors[method.processor];
    return await processor.refundPayment(paymentId, amount);
  }

  // Check if payments are enabled
  isPaymentsEnabled() {
    return config.features.traditionalPayments || config.features.blockchainPayments;
  }
}

// Export singleton instance
const paymentService = new PaymentService();
export default paymentService;
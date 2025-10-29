/**
 * Quick Order Form Component
 * Fast ordering interface for marketing materials
 */
import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { marketingMaterialsService } from '../../services/marketingMaterialsService';

const QuickOrderForm = ({ companyId, templates, onOrderCreated }) => {
  const [formData, setFormData] = useState({
    template_id: '',
    provider: 'vistaprint',
    material_type: 'postcard',
    quantity: 1,
    recipient_type: 'athlete',
    recipient_data: []
  });

  const [recipients, setRecipients] = useState([{
    name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  }]);

  const [estimatedCost, setEstimatedCost] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetEstimate = async () => {
    try {
      const estimate = await marketingMaterialsService.getPricingEstimate({
        provider: formData.provider,
        material_type: formData.material_type,
        quantity: formData.quantity,
        has_mailing: formData.recipient_type === 'bulk_mailing'
      });
      setEstimatedCost(estimate);
    } catch (error) {
      console.error('Failed to get estimate:', error);
      alert('Failed to get pricing estimate');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        company_id: companyId,
        ...formData,
        recipient_data: recipients.filter(r => r.name && r.address)
      };

      await marketingMaterialsService.createOrder(orderData);
      alert('Order created successfully!');
      onOrderCreated();

      // Reset form
      setFormData({
        template_id: '',
        provider: 'vistaprint',
        material_type: 'postcard',
        quantity: 1,
        recipient_type: 'athlete',
        recipient_data: []
      });
      setRecipients([{
        name: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US'
      }]);
      setEstimatedCost(null);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addRecipient = () => {
    setRecipients([...recipients, {
      name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }]);
  };

  const updateRecipient = (index, field, value) => {
    const newRecipients = [...recipients];
    newRecipients[index][field] = value;
    setRecipients(newRecipients);
  };

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quick Order</h2>
        <p className="text-gray-600 mt-1">
          Send marketing materials to athletes or bulk recipients
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>

              <div className="space-y-4">
                {/* Template Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template (Optional)
                  </label>
                  <select
                    value={formData.template_id}
                    onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No template (use default)</option>
                    {templates.filter(t => t.is_active).map(template => (
                      <option key={template.id} value={template.id}>
                        {template.template_name} ({template.material_type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Type
                  </label>
                  <select
                    value={formData.material_type}
                    onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="postcard">Postcard</option>
                    <option value="flyer">Flyer</option>
                    <option value="business_card">Business Card</option>
                    <option value="brochure">Brochure</option>
                    <option value="banner">Banner</option>
                  </select>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="vistaprint">Vistaprint (Best for direct mail)</option>
                    <option value="staples">Staples (Fast pickup)</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Recipient Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Type
                  </label>
                  <select
                    value={formData.recipient_type}
                    onChange={(e) => setFormData({ ...formData, recipient_type: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="athlete">To Athlete</option>
                    <option value="bulk_mailing">Bulk Direct Mail</option>
                    <option value="event">Event Distribution</option>
                    <option value="custom">Custom Recipients</option>
                  </select>
                </div>
              </div>

              {/* Recipients */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold">Recipients</h4>
                  <Button
                    type="button"
                    onClick={addRecipient}
                    variant="outline"
                    size="sm"
                  >
                    + Add Recipient
                  </Button>
                </div>

                <div className="space-y-4">
                  {recipients.map((recipient, index) => (
                    <Card key={index} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Recipient #{index + 1}
                        </span>
                        {recipients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRecipient(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={recipient.name}
                            onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Address"
                            value={recipient.address}
                            onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="City"
                          value={recipient.city}
                          onChange={(e) => updateRecipient(index, 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={recipient.state}
                          onChange={(e) => updateRecipient(index, 'state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={recipient.postal_code}
                          onChange={(e) => updateRecipient(index, 'postal_code', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={recipient.country}
                          onChange={(e) => updateRecipient(index, 'country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium capitalize">
                    {formData.material_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{formData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipients:</span>
                  <span className="font-medium">{recipients.length}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  onClick={handleGetEstimate}
                  variant="outline"
                  className="w-full mb-3"
                >
                  Get Pricing Estimate
                </Button>

                {estimatedCost && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-3">
                    <p className="text-sm text-gray-700 mb-2">Estimated Cost:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Printing:</span>
                        <span>${estimatedCost.printing_cost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${estimatedCost.shipping_cost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>${estimatedCost.total_cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading || recipients.filter(r => r.name && r.address).length === 0}
                >
                  {loading ? 'Creating Order...' : 'Create Order'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuickOrderForm;

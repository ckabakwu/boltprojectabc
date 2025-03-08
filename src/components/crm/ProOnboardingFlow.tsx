import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import type { ProApplication } from '../../lib/supabase';

const applicationSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  experience_years: z.string(),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  availability: z.array(z.string()).min(1, 'Select at least one day'),
  agree_terms: z.boolean().refine(val => val, 'You must agree to the terms'),
  agree_background_check: z.boolean().refine(val => val, 'You must agree to the background check')
});

interface ProOnboardingFlowProps {
  onSubmit: (data: z.infer<typeof applicationSchema>) => Promise<void>;
  onUploadDocument: (file: File, type: string) => Promise<void>;
}

const ProOnboardingFlow: React.FC<ProOnboardingFlowProps> = ({
  onSubmit,
  onUploadDocument
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(applicationSchema)
  });

  const services = [
    { id: 'standard', label: 'Standard Cleaning' },
    { id: 'deep', label: 'Deep Cleaning' },
    { id: 'move', label: 'Move In/Out Cleaning' },
    { id: 'airbnb', label: 'Airbnb Cleaning' },
    { id: 'office', label: 'Office Cleaning' }
  ];

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const requiredDocuments = [
    { id: 'id', label: 'Government-issued ID' },
    { id: 'address', label: 'Proof of Address' },
    { id: 'insurance', label: 'Liability Insurance' },
    { id: 'certification', label: 'Cleaning Certifications (if any)' }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[documentType] || 0;
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [documentType]: current + 10 };
        });
      }, 500);

      await onUploadDocument(file, documentType);
      
      clearInterval(interval);
      setUploadProgress(prev => ({ ...prev, [documentType]: 100 }));
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(prev => ({ ...prev, [documentType]: -1 }));
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof applicationSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setStep(step + 1);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-full h-1 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm">Personal Info</span>
          <span className="text-sm">Services</span>
          <span className="text-sm">Documents</span>
          <span className="text-sm">Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register('first_name')}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    {...register('last_name')}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  {...register('email')}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="tel"
                  {...register('phone')}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  {...register('address')}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  {...register('state')}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  {...register('zip_code')}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Services & Availability */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Services & Availability</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What services do you offer?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="relative flex items-start p-4 cursor-pointer rounded-lg border hover:border-blue-500"
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        {...register('services')}
                        value={service.id}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">{service.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.services && (
                <p className="mt-1 text-sm text-red-600">{errors.services.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What days are you available to work?
              </label>
              <div className="grid grid-cols-4 gap-3">
                {days.map((day) => (
                  <label
                    key={day}
                    className="relative flex items-start p-4 cursor-pointer rounded-lg border hover:border-blue-500"
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        {...register('availability')}
                        value={day}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">{day}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <select
                {...register('experience_years')}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select experience</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
              {errors.experience_years && (
                <p className="mt-1 text-sm text-red-600">{errors.experience_years.message}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Document Upload */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Required Documents</h2>

            <div className="space-y-6">
              {requiredDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Please upload a clear, readable copy
                      </p>
                    </div>
                    <div className="flex items-center">
                      {uploadProgress[doc.id] === undefined ? (
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(e, doc.id)}
                          />
                          <Upload className="h-5 w-5" />
                        </label>
                      ) : uploadProgress[doc.id] === 100 ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : uploadProgress[doc.id] === -1 ? (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      ) : (
                        <div className="w-20 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress[doc.id]}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('agree_background_check')}
                    className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    I agree to undergo a background check and understand that my application is subject to passing this check.
                  </span>
                </label>
                {errors.agree_background_check && (
                  <p className="text-sm text-red-600">{errors.agree_background_check.message}</p>
                )}

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('agree_terms')}
                    className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy.
                  </span>
                </label>
                {errors.agree_terms && (
                  <p className="text-sm text-red-600">{errors.agree_terms.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Review Your Application</h2>

            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {watch('first_name')} {watch('last_name')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{watch('email')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{watch('phone')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="mt-1 text-sm text-gray-900">{watch('experience_years')}</dd>
                  </div>
                </dl>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Services & Availability</h3>
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Services Offered</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {watch('services')?.map((id: string) => 
                        services.find(s => s.id === id)?.label
                      ).join(', ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Available Days</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {watch('availability')?.join(', ')}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
                <ul className="space-y-3">
                  {requiredDocuments.map((doc) => (
                    <li key={doc.id} className="flex items-center">
                      {uploadProgress[doc.id] === 100 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">{doc.label}</span>
                    </li>
                  ))}
                </ul> ```tsx
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      What happens next?
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>1. Background check verification (2-3 business days)</p>
                      <p>2. Document review and verification (1-2 business days)</p>
                      <p>3. Welcome call and platform orientation</p>
                      <p>4. Start accepting cleaning jobs!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default ProOnboardingFlow;
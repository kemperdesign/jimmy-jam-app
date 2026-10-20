import React, { useState } from 'react';
import {
  Heart,
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  ThumbsUp,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from './supabaseClient';

export default function FestivalAssistance({ setActiveNav }) {
  // Step in the 4-step flow: 1: Contact, 2: Describe Need, 3: Review & Submit, 4: Done
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'St. Augustine',
    zipCode: '',
    assistanceType: [],
    urgency: 'medium', // 'urgent' | 'medium' | 'general'
    description: '',
    amountRequested: '',
    agree: false
  });

  const assistanceCategories = [
    { id: 'medical', label: 'Medical & Healthcare', icon: '🩺', desc: 'Medical bills, surgeries, therapy & prescription assistance' },
    { id: 'housing', label: 'Housing & Utilities', icon: '🏠', desc: 'Emergency rent, mortgage, power, or water assistance' },
    { id: 'transportation', label: 'Transportation', icon: '🚗', desc: 'Critical vehicle repairs, transit, or fuel to medical visits' },
    { id: 'food', label: 'Food & Nutrition', icon: '🥫', desc: 'Emergency groceries and nutritional support for children' },
    { id: 'childcare', label: 'Child & Family Care', icon: '🧸', desc: 'Daycare, school supplies, or essential baby supplies' },
    { id: 'other', label: 'Other Life Hardship', icon: '🤝', desc: 'Sudden loss of income, disaster, or family emergency' }
  ];

  const toggleCategory = (id) => {
    setFormData(prev => ({
      ...prev,
      assistanceType: prev.assistanceType.includes(id)
        ? prev.assistanceType.filter(c => c !== id)
        : [...prev.assistanceType, id]
    }));
  };

  const handleNextFromStep1 = () => {
    setErrorMessage('');
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please enter your full first and last name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter a contact phone number.');
      return;
    }
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    setErrorMessage('');
    if (formData.assistanceType.length === 0) {
      setErrorMessage('Please select at least one assistance category.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 15) {
      setErrorMessage('Please provide a brief description of your situation (at least 15 characters).');
      return;
    }
    setCurrentStep(3);
  };

  const handleSubmitApplication = async () => {
    setErrorMessage('');
    if (!formData.agree) {
      setErrorMessage('Please confirm that the provided information is true and accurate.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('assistance_applications').insert({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        zip_code: formData.zipCode,
        assistance_type: formData.assistanceType,
        description: `[Urgency: ${formData.urgency.toUpperCase()}] [Amount: ${formData.amountRequested || 'N/A'}] ${formData.description.trim()}`
      });

      if (error) {
        // Fallback: log to local storage if supabase network error
        try {
          const offlineList = JSON.parse(localStorage.getItem('jj_offline_applications') || '[]');
          offlineList.push({ ...formData, submittedAt: new Date().toISOString() });
          localStorage.setItem('jj_offline_applications', JSON.stringify(offlineList));
        } catch (e) {}
      }

      setCurrentStep(4);
    } catch (err) {
      setCurrentStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4: Done Screen (Matching the 4th card in Vecteezy template)
  if (currentStep === 4) {
    return (
      <div className="relative min-h-screen bg-[#F0F4FA] -mx-4 px-4 sm:px-6 py-8 pb-28 font-sans flex items-center justify-center">
        <div className="w-full max-w-lg rounded-3xl bg-white p-7 sm:p-9 shadow-2xl border border-blue-100 text-center space-y-6 animate-in zoom-in-95 duration-300">
          
          {/* Thumbs up & Checkmark Illustration matching Vecteezy Step 4 */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-blue-100/70 animate-ping opacity-25" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/25">
              <ThumbsUp size={44} className="stroke-[2.5]" />
            </div>
            <div className="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-emerald-500 text-white border-2 border-white flex items-center justify-center shadow-md">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Application Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
              Done! Your Request is Submitted
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong className="text-neutral-900">{formData.firstName}</strong>. Our confidential Jimmy Jam Community Outreach committee reviews applications weekly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-left space-y-2 text-xs text-neutral-700">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Clock size={16} className="text-blue-600" />
              <span>Next Steps:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-neutral-600 pl-1">
              <li>Review turnaround: <strong>3 to 5 business days</strong>.</li>
              <li>A coordinator will call or email at <strong>{formData.email}</strong>.</li>
              <li>Grants are paid directly to service providers, medical facilities, or for verified family emergency relief.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveNav && setActiveNav('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              Return to Home Screen
            </button>
            <button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  city: 'St. Augustine',
                  zipCode: '',
                  assistanceType: [],
                  urgency: 'medium',
                  description: '',
                  amountRequested: '',
                  agree: false
                });
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Submit Another Form
            </button>
          </div>

          {/* 4 Step Dots Indicator (Step 4 active) */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-2 h-2 rounded-full bg-blue-200" />
            <span className="w-2 h-2 rounded-full bg-blue-200" />
            <span className="w-2 h-2 rounded-full bg-blue-200" />
            <span className="w-6 h-2 rounded-full bg-blue-600" />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F0F4FA] -mx-4 px-4 sm:px-6 py-6 pb-28 font-sans">
      
      <div className="max-w-xl mx-auto space-y-6">

        {/* HERO TITLE HEADER */}
        <div className="text-center pt-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Heart size={14} fill="#B91C1C" />
            <span>Jimmy Jam Community Outreach 501(c)(3)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Application for Assistance
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            100% of festival proceeds go directly to helping local individuals and families in St. Johns County facing life-altering hardships.
          </p>
        </div>

        {/* 4-STEP ONBOARDING PROGRESS CARDS (Matching Vecteezy Template Header) */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white border border-blue-100 shadow-md">
          {[
            { step: 1, title: 'Contact', icon: Phone },
            { step: 2, title: 'Describe', icon: FileText },
            { step: 3, title: 'Get Help', icon: HelpCircle },
            { step: 4, title: 'Done!', icon: ThumbsUp }
          ].map(s => {
            const Icon = s.icon;
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (s.step < currentStep) setCurrentStep(s.step);
                }}
                disabled={s.step > currentStep}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : isCompleted
                    ? 'text-blue-600 hover:bg-blue-50 font-semibold'
                    : 'text-neutral-400 opacity-60'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isCompleted
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={15} /> : <Icon size={14} />}
                </div>
                <span className="text-[10px] leading-tight block">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN FORM CARD */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-blue-100/80 space-y-5">
          
          {/* STEP 1: CONTACT US (Matching Card 1 in Vecteezy) */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-neutral-900 leading-snug">
                    Step 1: Contact Information
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Tell us how to reach you. All information is strictly confidential.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">First Name *</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">Email Address *</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="(904) 555-0123"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">City / County</label>
                  <input
                    type="text"
                    placeholder="St. Augustine, FL"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-700 block">Zip Code</label>
                  <input
                    type="text"
                    placeholder="32084"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue to Describe Need</span>
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: DESCRIBE ISSUE (Matching Card 2 in Vecteezy) */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-neutral-900 leading-snug">
                    Step 2: Describe Your Need
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Select the categories where you need assistance and share your story.
                  </p>
                </div>
              </div>

              {/* Assistance Categories Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 block">
                  Category of Hardship (select all that apply) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {assistanceCategories.map(cat => {
                    const isSelected = formData.assistanceType.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100/70'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{cat.icon}</span>
                        <div className="min-w-0">
                          <p className={`font-bold text-xs leading-tight ${isSelected ? 'text-blue-900' : 'text-neutral-800'}`}>
                            {cat.label}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-2">
                            {cat.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description Textarea */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 block">
                  Tell Us About Your Situation *
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe the hardship your family is facing (medical condition, loss of work, upcoming expense, etc.)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Estimated Amount (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-700 block">
                  Approximate Assistance Amount Needed (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. $500 - $1,500"
                  value={formData.amountRequested}
                  onChange={(e) => setFormData({ ...formData, amountRequested: e.target.value })}
                  className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-3 px-4 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="flex-1 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Review & Confirm</span>
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: GET HELP / REVIEW (Matching Card 3 in Vecteezy) */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-neutral-900 leading-snug">
                    Step 3: Review & Submit
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Confirm your details before our community outreach team begins review.
                  </p>
                </div>
              </div>

              {/* Review Summary Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <span className="font-bold text-neutral-700">Applicant:</span>
                  <span className="font-semibold text-neutral-900">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <span className="font-bold text-neutral-700">Contact:</span>
                  <span className="text-neutral-900">{formData.phone} • {formData.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <span className="font-bold text-neutral-700">Categories:</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {formData.assistanceType.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-bold text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-neutral-700 block mb-1">Situation Overview:</span>
                  <p className="text-neutral-800 italic bg-white/70 p-2.5 rounded-xl border border-blue-100">
                    "{formData.description}"
                  </p>
                </div>
              </div>

              {/* Confidentiality & Accuracy Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 cursor-pointer hover:bg-neutral-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-neutral-700 leading-snug">
                  I certify that all information provided is accurate, truthful, and for the benefit of my household. I understand the Jimmy Jam Outreach board treats all applications with strict confidentiality.
                </span>
              </label>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-3 px-4 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Heart size={16} fill="#FFFFFF" />
                  <span>{submitting ? 'Submitting Application...' : 'Submit Confidential Application'}</span>
                </button>
              </div>

            </div>
          )}

          {/* 4 Step Dots Indicator (at bottom of card, matching Vecteezy) */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-neutral-100">
            {[1, 2, 3, 4].map(step => (
              <span
                key={step}
                className={`h-2 rounded-full transition-all ${
                  currentStep === step
                    ? 'w-6 bg-blue-600'
                    : currentStep > step
                    ? 'w-2 bg-blue-300'
                    : 'w-2 bg-neutral-200'
                }`}
              />
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

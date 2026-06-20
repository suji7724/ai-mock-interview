import { useState } from "react";
import { X, HelpCircle, Mail, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

function HelpCenterModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const email = "sujitcoder044@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      question: "How does the AI evaluate my interview responses?",
      answer: "Our AI analyzes your answers for technical accuracy, communication clarity, tone, and pacing to give you comprehensive, constructive feedback."
    },
    {
      question: "Can I customize the interview questions?",
      answer: "Yes! Before starting, you can choose the job role, technologies, experience level, and number of questions to tailor the session to your needs."
    },
    {
      question: "How can I access my past feedback reports?",
      answer: "All your completed sessions are stored in the Dashboard. Simply click on any completed interview to view its detailed performance breakdown."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 relative my-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HelpCircle size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Help Center</h2>
            <p className="text-slate-400 text-sm mt-0.5">We're here to assist you with any questions or support queries.</p>
          </div>
        </div>

        {/* Custom Support Message & Action */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Mail size={18} className="text-indigo-400" />
            Contact Support
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            For any queries, feedback, account support, or technical issues, please feel free to reach out to us directly. We typically respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <span className="text-indigo-400 font-mono text-sm break-all px-2 select-all">
              {email}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition duration-200"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
              <a
                href={`mailto:${email}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200 shadow-lg shadow-indigo-600/10"
              >
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/20 hover:bg-slate-950/40 transition duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200 hover:text-white transition duration-200"
                >
                  <span className="text-sm">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronUp size={16} className="text-indigo-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${activeFaq === index ? "max-h-40 border-t border-slate-800/50" : "max-h-0"
                    }`}
                >
                  <div className="p-4 text-sm text-slate-400 leading-relaxed bg-slate-950/40">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterModal;

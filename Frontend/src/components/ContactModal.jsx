import { useState } from "react";
import { X, Mail, User, MessageSquare } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

function ContactModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // handle change

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle submit  form

  const handleSubmit = async () => {
    try {
      console.log(formData);
      const token = localStorage.getItem("accessToken");

      const response = await api.post("/users/contact/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      onClose();
    } catch (error) {
      console.log("Error Response:");

      console.log(error.response);

      console.log(error.response.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6">
          <X />
        </button>

        <h2 className="text-3xl font-bold mb-2">Contact Us</h2>

        <p className="text-slate-400 mb-8">We'd love to hear your feedback.</p>

        <div className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            placeholder="Your Message..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />

          <button
            onClick={handleSubmit}
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              py-4
              rounded-xl
              font-semibold
            "
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;

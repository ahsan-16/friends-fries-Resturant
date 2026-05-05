import { Phone, MapPin, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import { restaurantInfo } from "../data/menu";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      <div className="relative py-16 px-4 bg-gradient-to-b from-brand-gray/50 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-4">📍</div>
          <p className="text-brand-red font-heading font-bold uppercase tracking-widest text-sm mb-2">Get In Touch</p>
          <h1 className="font-display text-6xl md:text-8xl text-white">CONTACT US</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-5">
            <div className="card-dark p-6 hover:border-brand-red/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-red/10 rounded-xl">
                  <MapPin size={24} className="text-brand-red" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-1">Address</h3>
                  <p className="text-gray-400 font-body text-sm">{restaurantInfo.address}</p>
                  <p className="text-gray-600 font-body text-xs mt-1">{restaurantInfo.plusCode}</p>
                </div>
              </div>
            </div>

            <div className="card-dark p-6 hover:border-brand-red/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-red/10 rounded-xl">
                  <Phone size={24} className="text-brand-red" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-2">Phone / Order</h3>
                  <a href={`tel:${restaurantInfo.phone}`} className="text-brand-yellow hover:text-yellow-400 font-heading font-bold text-lg block transition-colors">
                    {restaurantInfo.phone}
                  </a>
                  <a href={`tel:${restaurantInfo.orderPhone}`} className="text-brand-yellow hover:text-yellow-400 font-heading font-bold text-lg block transition-colors">
                    {restaurantInfo.orderPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="card-dark p-6 hover:border-brand-red/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-red/10 rounded-xl">
                  <Clock size={24} className="text-brand-red" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-2">Hours</h3>
                  {restaurantInfo.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-4 text-sm mb-1">
                      <span className="text-gray-400 font-body">{h.day}</span>
                      <span className="text-white font-heading font-semibold">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="card-dark p-6">
              <h3 className="font-heading font-bold text-white text-lg mb-3">Services</h3>
              <div className="flex flex-wrap gap-2">
                {restaurantInfo.services.map((s) => (
                  <span key={s} className="bg-brand-red/10 text-brand-red border border-brand-red/20 px-3 py-1 rounded-full text-sm font-heading font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Map + Order CTA */}
          <div className="space-y-5">
            {/* Embedded Map */}
            <div className="card-dark overflow-hidden h-72">
              <iframe
                src="https://www.google.com/maps?q=Dubai+Kitchen+Qabristan+Rd+Wah+Cantt+Pakistan&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Friends Fries Location"
              />
            </div>

            {/* WhatsApp Order */}
            <div className="card-dark p-6 bg-gradient-to-br from-green-900/30 to-brand-gray border-green-800/30">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={24} className="text-green-400" />
                <h3 className="font-heading font-bold text-white text-lg">Order via WhatsApp</h3>
              </div>
              <p className="text-gray-400 text-sm font-body mb-4">
                Send us a message on WhatsApp with your order and we'll get it prepared right away!
              </p>
              <a
                href={`https://wa.me/923155305988`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-heading font-bold uppercase tracking-wide px-6 py-3 rounded-full transition-all hover:scale-105 w-full"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>

            {/* Social */}
            <div className="card-dark p-6">
              <h3 className="font-heading font-bold text-white text-lg mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="flex items-center gap-2 bg-gradient-to-br from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-heading font-bold text-sm hover:scale-105 transition-all">
                  <Instagram size={18} /> Instagram
                </a>
                <a href="#" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-heading font-bold text-sm hover:scale-105 transition-all">
                  <Facebook size={18} /> Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

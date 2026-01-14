
import React from 'react';
import { Instagram, Mail, Phone, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Contact and Branding */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">Cheia de Arte</h2>
            <p className="text-gray-600 mb-6 italic">Aromas que transformam ambientes em lares.</p>
            <div className="space-y-3">
              <a href="tel:+5571982331700" className="flex items-center gap-3 text-gray-700 hover:text-[#f4d3d2] transition-colors">
                <Phone className="w-5 h-5" />
                <span>(71) 9 8233-1700</span>
              </a>
              <a href="mailto:contato@cheiadearte.com" className="flex items-center gap-3 text-gray-700 hover:text-[#f4d3d2] transition-colors">
                <Mail className="w-5 h-5" />
                <span>contato@cheiadearte.com</span>
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-gray-900 mb-2">Institucional</h3>
            <a href="#" className="text-gray-600 hover:text-[#f4d3d2] transition-colors">Política de Privacidade</a>
            <a href="#" className="text-gray-600 hover:text-[#f4d3d2] transition-colors">Termos de Uso</a>
            <a href="#" className="text-gray-600 hover:text-[#f4d3d2] transition-colors">Trocas e Devoluções</a>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Siga-nos</h3>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" className="p-3 bg-white rounded-full shadow-sm hover:text-white hover:bg-[#f4d3d2] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" className="p-3 bg-white rounded-full shadow-sm hover:text-white hover:bg-[#f4d3d2] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5571982331700" target="_blank" className="p-3 bg-white rounded-full shadow-sm hover:text-white hover:bg-[#f4d3d2] transition-all">
                <Phone className="w-5 h-5" />
              </a>
              <a href="mailto:contato@cheiadearte.com" className="p-3 bg-white rounded-full shadow-sm hover:text-white hover:bg-[#f4d3d2] transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Cheia de Arte. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

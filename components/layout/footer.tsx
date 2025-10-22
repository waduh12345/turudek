"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Facebook,
  Instagram,
  Music,
  Twitter,
  Youtube,
  MessageSquare,
  Gamepad2,
  Play,
  X,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface FooterData {
  footer: {
    companyInfo: {
      name: string;
      tagline: string;
      logo: {
        text: string;
        color: string;
      };
      copyright: string;
    };
    socialMedia: Array<{
      name: string;
      icon: string;
      url: string;
      color: string;
      description: string;
    }>;
    siteMap: {
      title: string;
      links: Array<{
        name: string;
        href: string;
        description: string;
      }>;
    };
    contactInfo: {
      title: string;
      contacts: Array<{
        type: string;
        icon: string;
        label: string;
        value: string;
        description: string;
      }>;
    };
    region: {
      title: string;
      current: {
        country: string;
        currency: string;
        flag: string;
        code: string;
      };
    };
    downloadApp: {
      title: string;
      apps: Array<{
        name: string;
        icon: string;
        url: string;
        description: string;
        buttonText: string;
        storeName: string;
        color: string;
      }>;
    };
    chatSupport: {
      title: string;
      botName: string;
      status: string;
      channels: Array<{
        name: string;
        icon: string;
        url: string;
        color: string;
        description: string;
      }>;
    };
  };
}

const Footer = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/dummy/navigation-data.json');
        const data = await response.json();
        setFooterData(data);
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
      Mail,
      Facebook,
      Instagram,
      Music,
      Twitter,
      Youtube,
      MessageSquare,
      Play,
      Phone,
    };
    return icons[iconName] || Mail;
  };

  if (!footerData) {
    return (
      <footer>
        <div className="container bg-gray-50 py-12">
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer>
      <div className="container bg-gray-50 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Kolom 1: Follow Kami */}
          <div className="space-y-6">
            <h4 className="text-lg font-mono tracking-wider italic">
              Follow Kami
            </h4>

            {/* Social Media Icons */}
            <div className="flex gap-3 flex-wrap">
              {footerData.footer.socialMedia.map((social, index) => {
                const IconComponent = getIcon(social.icon);
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-8 h-8 ${social.color} rounded flex items-center justify-center`}
                    title={social.description}
                  >
                    <IconComponent size={16} className="text-white" />
                  </motion.a>
                );
              })}
            </div>

            {/* Logo Kios Tetta */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <div className={`w-4 h-4 ${footerData.footer.companyInfo.logo.color} rounded-sm`}></div>
              </div>
              <span className="sidebar-text text-xl font-bold text-green-500">
                {footerData.footer.companyInfo.name}
              </span>
            </div>

            {/* Copyright */}
            <p className="sidebar-text text-sm text-gray-500">
              {footerData.footer.companyInfo.copyright}
            </p>
          </div>

          {/* Kolom 2: Region & Site Map */}
          <div className="space-y-6">
            {/* Region */}
            <div>
              <h4 className="font-mono tracking-wider italic mb-3">{footerData.footer.region.title}</h4>
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-1 bg-white rounded-sm"></div>
                </div>
                <span className="sidebar-text text-gray-600">
                  {footerData.footer.region.current.country} ({footerData.footer.region.current.currency})
                </span>
              </div>
            </div>

            {/* Site Map */}
            <div>
              <h4 className="font-mono tracking-wider italic mb-3">{footerData.footer.siteMap.title}</h4>
              <div className="space-y-2">
                {footerData.footer.siteMap.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="sidebar-text block text-gray-600 hover:text-green-500 transition-colors"
                    title={link.description}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom 3: Kontak Kami */}
          <div className="space-y-6">
            <h4 className="sidebar-text text-lg font-bold text-black">
              {footerData.footer.contactInfo.title}
            </h4>

            {/* Contact Info */}
            <div className="space-y-3">
              {footerData.footer.contactInfo.contacts.map((contact, index) => {
                const IconComponent = getIcon(contact.icon);
                return (
                  <motion.a
                    key={index}
                    href={contact.type === 'email' ? `mailto:${contact.value}` : contact.type === 'phone' ? `tel:${contact.value}` : '#'}
                    whileHover={{ x: 3, scale: 1.02 }}
                    className="flex items-center gap-2 group cursor-pointer"
                    title={contact.description}
                  >
                    <IconComponent size={16} className="text-green-500" />
                    <span className="sidebar-text text-gray-600 group-hover:text-green-500 transition-colors">
                      {contact.value}
                    </span>
                  </motion.a>
                );
              })}
            </div>

            {/* Download App Button */}
            {footerData.footer.downloadApp.apps.map((app, index) => {
              const IconComponent = getIcon(app.icon);
              return (
                <motion.a
                  key={index}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${app.color} text-white px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors`}
                  title={app.description}
                >
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                    <IconComponent size={12} className="text-black" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="sidebar-text text-xs font-medium">
                      {app.buttonText}
                    </span>
                    <span className="sidebar-text text-sm font-bold">
                      {app.storeName}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatModalOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50"
        aria-label="Chat Support"
      >
        <MessageSquare size={24} className="text-white" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-50"
              onClick={() => setIsChatModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-black px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border border-green-400">
                  <Gamepad2 size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {footerData.footer.chatSupport.botName}
                  </h3>
                  <p className="text-gray-300 text-xs">{footerData.footer.chatSupport.status}</p>
                </div>
                <button
                  onClick={() => setIsChatModalOpen(false)}
                  className="ml-auto p-1 hover:bg-gray-800 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Chat on your favorite channel */}
                <div>
                  <h4 className="font-medium text-gray-800 text-sm mb-3">
                    Chat on your favorite channel
                  </h4>
                  <div className="space-y-2">
                    {footerData.footer.chatSupport.channels.map((channel, index) => {
                      const IconComponent = getIcon(channel.icon);
                      return (
                        <motion.a
                          key={index}
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                          title={channel.description}
                        >
                          <div className={`w-8 h-8 ${channel.color} rounded-full flex items-center justify-center`}>
                            <IconComponent size={16} className="text-white" />
                          </div>
                          <span className="text-gray-700 text-sm group-hover:text-green-600 transition-colors">
                            {channel.name}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;

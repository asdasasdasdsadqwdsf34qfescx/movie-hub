"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/services/supabaseClient';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  subItems?: { label: string }[];
}

interface Message {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

const Sidebar = () => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setUserEmail(data.session?.user?.email ?? "");
      } catch {
        if (mounted) setUserEmail("");
      }
    }
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? "");
    });
    load();
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems: MenuItem[] = [
    { 
      id: 'dashboard', 
      label: 'Collection',
      icon: 'M4 6h16M4 12h16M4 18h16',
      subItems: [
        { label: 'Activity' },
        { label: 'Trafic' },
        { label: 'Statistic' }
      ]
    },
    { id: 'statistics', label: 'Statistics', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const messages: Message[] = [
    { id: '1', name: 'Erik Gunsel', avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/58faea2f311e406ace6826ef6c981d10e79da9ba?width=96', online: true },
    { id: '2', name: 'Emily Smith', avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/58faea2f311e406ace6826ef6c981d10e79da9ba?width=96', online: false },
    { id: '3', name: 'Arthur Adelk', avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/58faea2f311e406ace6826ef6c981d10e79da9ba?width=96', online: true },
  ];

  const themeClasses = {
    dark: {
      bg: 'bg-[rgba(15,9,12,0.56)] border-[#B86E9F]',
      text: 'text-white',
      textMuted: 'text-white/56',
      textDim: 'text-white/32',
      activeBg: 'bg-white/3 border-[#B86E9F]',
      hoverBg: 'hover:bg-white/5',
      divider: 'bg-gradient-to-r from-transparent via-[#CC8B8B] to-transparent',
      promoBg: 'bg-[rgba(56,14,36,0.10)] border-[#B86E9F]',
      buttonBg: 'bg-gradient-to-b from-[#E0822D] to-[#E0822D]',
      arrowBg: 'bg-[rgba(15,9,12,0.40)] border-[#B86E9F]',
      onlineIndicator: 'bg-[#7FBA7A]',
      offlineIndicator: 'bg-[#250D0E] border-[#9F9595]',
    },
    light: {
      bg: 'bg-[rgba(255,237,224,0.56)] border-[rgba(245,239,235,0.40)]',
      text: 'text-[#242220]',
      textMuted: 'text-[rgba(36,34,32,0.56)]',
      textDim: 'text-[rgba(36,34,32,0.40)]',
      activeBg: 'bg-[rgba(36,34,32,0.04)] border-[rgba(245,239,235,0.16)]',
      hoverBg: 'hover:bg-[rgba(36,34,32,0.08)]',
      divider: 'bg-gradient-to-r from-transparent via-[#432C2C] to-transparent',
      promoBg: 'bg-white/12 border-[rgba(245,239,235,0.16)]',
      buttonBg: 'bg-gradient-to-b from-[#E58025] to-[#E58025]',
      arrowBg: 'bg-[rgba(255,237,224,0.56)] border-[rgba(245,239,235,0.32)]',
      onlineIndicator: 'bg-[#61AD5A]',
      offlineIndicator: 'bg-[#D39D8A] border-[#666260]',
    }
  };

  const colors = themeClasses[theme];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen ${isExpanded ? 'w-64' : 'w-[104px]'} 
        ${colors.bg} border-[0.5px] rounded-[28px] m-4 
        backdrop-blur-[80px] shadow-[0_64px_64px_-32px_rgba(41,15,0,0.56)] 
        transition-all duration-300 ease-in-out z-50 flex flex-col`}
    >
      {/* Window Controls */}
      <div className="flex gap-2 p-6">
        <div className="w-3 h-3 rounded-full bg-[#FF5A52]"></div>
        <div className="w-3 h-3 rounded-full bg-[#E6C02A]"></div>
        <div className="w-3 h-3 rounded-full bg-[#53C22B]"></div>
      </div>

      {/* User Header */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-3">
          {isExpanded && (
            <div className="overflow-hidden">
              <div className={`text-[14px] font-medium ${colors.text} leading-5 break-all`}>
                {userEmail}
              </div>
              <button
                onClick={handleSignOut}
                className={`mt-1 inline-flex items-center px-2.5 py-1 text-xs rounded border ${theme === 'dark' ? 'border-white/20 text-white/80 hover:bg-white/10' : 'border-black/10 text-[#242220]/80 hover:bg-black/5'} transition-colors`}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute ${isExpanded ? 'right-[-12px]' : 'right-[-12px]'} top-[78px] 
          w-6 h-6 rounded-full ${colors.arrowBg} border-[0.5px] 
          flex items-center justify-center backdrop-blur-[90px] 
          transition-all duration-300 hover:scale-110`}
      >
        <svg 
          className={`w-4 h-4 ${theme === 'dark' ? 'fill-[#AB638C]' : 'fill-[rgba(36,34,32,0.48)]'} 
            transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}
          viewBox="0 0 24 24"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M10.0524 12.0009L14.5502 7.46527C14.8831 7.12914 14.8831 6.58702 14.5502 6.25089C14.3916 6.09032 14.1752 6 13.9495 6C13.7239 6 13.5075 6.09032 13.3489 6.25089L8.25041 11.3928C7.91645 11.7286 7.91645 12.2714 8.25041 12.6072L13.3487 17.7491C13.5075 17.9097 13.7239 18 13.9495 18C14.1752 18 14.3916 17.9097 14.5504 17.7491C14.8831 17.4129 14.8831 16.8708 14.55 16.5347L10.0524 12.0009Z" />
        </svg>
      </button>

      {/* Divider */}
      <div className={`h-[1px] w-full ${colors.divider} opacity-32 mb-4`}></div>

      {/* Main Menu */}
      <div className="px-6 flex-1 overflow-y-auto">
        <div className={`text-[11px] uppercase tracking-wider ${colors.textDim} mb-2 ${isExpanded ? 'px-5' : 'text-center'}`}>
          Main
        </div>
        
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => item.id === 'dashboard' && setIsDashboardOpen(!isDashboardOpen)}
                className={`w-full flex items-center gap-4 ${isExpanded ? 'px-5' : 'justify-center'} py-4 
                  rounded-xl transition-all duration-200
                  ${item.id === 'dashboard' ? `${colors.activeBg} border-[0.5px]` : colors.hoverBg}`}
              >
                <svg className="w-6 h-6" fill="none" stroke={theme === 'dark' ? 'white' : '#242220'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {isExpanded && (
                  <>
                    <span className={`flex-1 text-left text-[14px] font-medium ${item.id === 'dashboard' ? colors.text : colors.textMuted}`}>
                      {item.label}
                    </span>
                    {item.subItems && (
                      <svg 
                        className={`w-6 h-6 transition-transform duration-200 ${isDashboardOpen ? 'rotate-180' : ''}`}
                        fill={theme === 'dark' ? 'rgba(255,255,255,0.32)' : 'rgba(36,34,32,0.48)'}
                        viewBox="0 0 24 24"
                      >
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0009 10.0525L7.46527 14.5503C7.12914 14.8832 6.58702 14.8832 6.25089 14.5503C6.09032 14.3916 6 14.1753 6 13.9496C6 13.7239 6.09032 13.5076 6.25089 13.3489L11.3928 8.25047C11.7286 7.91651 12.2714 7.91651 12.6072 8.25047L17.7491 13.3487C17.9097 13.5076 18 13.7239 18 13.9496C18 14.1753 17.9097 14.3916 17.7491 14.5505C17.4129 14.8832 16.8708 14.8832 16.5347 14.5501L12.0009 10.0525Z" />
                      </svg>
                    )}
                  </>
                )}
              </button>
              
              {item.subItems && isDashboardOpen && isExpanded && (
                <div className="ml-12 mt-1 space-y-2 border-l-[1px] border-white/16 pl-3">
                  {item.subItems.map((subItem, idx) => (
                    <button
                      key={idx}
                      className={`w-full text-left px-4 py-2 rounded-lg text-[12px] font-medium
                        ${subItem.label === 'Statistic' ? `${colors.activeBg} ${colors.text} border-[0.5px]` : `${colors.textMuted} ${colors.hoverBg}`}
                        transition-all duration-200`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className={`h-[1px] w-full ${colors.divider} opacity-32 my-4`}></div>

      {/* Promo Block */}
      {isExpanded && (
        <div className={`mx-6 mb-6 p-6 rounded-[28px] border-[0.5px] ${colors.promoBg} space-y-5`}>
          <div className="space-y-1.5">
            <h3 className={`text-[16px] font-bold ${colors.text} text-center leading-[156%] tracking-[0.16px]`}>
              Let's start!
            </h3>
            <p className={`text-[13px] font-medium ${colors.textMuted} text-center leading-[160%]`}>
              Creating or adding new tasks couldn't be easier
            </p>
          </div>
          <button className={`w-full h-12 ${colors.buttonBg} rounded-xl 
            flex items-center justify-center gap-1.5 
            shadow-[0_4px_24px_0_rgba(168,82,5,0.30)] 
            hover:scale-[1.02] transition-transform duration-200`}>
            <svg className="w-6 h-6" stroke="white" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 6V12V18M18 12H6" />
            </svg>
            <span className="text-white text-[14px] font-bold leading-[130%]">
              Add New Task
            </span>
          </button>
        </div>
      )}

      {/* Add Task Button (Collapsed) */}
      {!isExpanded && (
        <div className="px-7 pb-6">
          <button className={`w-12 h-12 ${colors.buttonBg} rounded-xl 
            flex items-center justify-center 
            shadow-[0_4px_24px_0_rgba(168,82,5,0.30)] 
            hover:scale-[1.05] transition-transform duration-200`}>
            <svg className="w-6 h-6" stroke="white" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 6V12V18M18 12H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

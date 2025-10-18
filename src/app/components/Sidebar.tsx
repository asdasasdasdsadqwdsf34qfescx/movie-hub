"use client";
import React, { useState } from 'react';
import { FaHome, FaBars, FaChartBar, FaUser, FaFilm } from 'react-icons/fa';
import DropdownProfileTrigger from './DropdownProfileTrigger';

const navItems = [
  { label: 'Home', icon: <FaHome className="text-lg" />, path: '/home' },
  { label: 'My Collection', icon: <FaFilm className="text-lg" />, path: '/my-collection' },
  { label: 'Statistics', icon: <FaChartBar className="text-lg" />, path: '/statistics' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarClasses = `bg-white text-neutral-800 shadow-md transition-all duration-300 ease-in-out
    fixed bottom-0 left-0 w-full h-16 z-50 flex items-center border-t border-gray-100
    md:relative md:h-screen md:flex-col md:justify-between md:border-t-0
    ${collapsed ? 'md:w-16' : 'md:w-44'}`;

  const navItemClasses = `flex items-center px-4 py-2.5 rounded-lg text-neutral-800 hover:bg-neutral-200/50 hover:text-blue-600 transition-colors duration-150 cursor-pointer
    ${collapsed ? 'md:justify-start' : ''}`;

  return (
    <aside className={sidebarClasses}>
      {/* Header visible only on md+ */}
      <div className="hidden md:flex items-center px-4 py-5 border-b border-gray-100 w-full transition-all duration-300">
        <button
          className="text-lg text-neutral-500 hover:text-blue-600 transition-colors duration-300"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Open sidebar' : 'Collapse sidebar'}
        >
          <FaBars />
        </button>
        {!collapsed ? (
          <h1 className="text-xl font-bold text-neutral-900 ml-3 transition-all duration-300 opacity-100 translate-x-0">
            MovieHub
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-neutral-900 ml-3 transition-all duration-300 opacity-0 translate-x-4 absolute">
            MovieHub
          </h1>
        )}
      </div>

      <nav className="hidden md:flex flex-col flex-1 w-full h-full justify-between py-4">
        {/* Main navigation items */}
        <div className="flex md:flex-col md:overflow-y-auto md:py-0 gap-1 md:[-ms-overflow-style:none] md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={`relative flex items-center ${navItemClasses}`}
              title={item.label}
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg transition-all duration-300">
                {item.icon}
              </span>
              {!collapsed && (
                <span className={`ml-3 origin-left transition-all duration-300 ${collapsed ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'} hidden md:inline whitespace-nowrap font-medium`}>
                  {item.label}
                </span>
              )}
              {collapsed && (
                <span className="hidden" >
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Profile at the bottom */}
        <div className="hidden md:block w-full border-t border-gray-100 transition-all duration-300">
          <DropdownProfileTrigger collapsed={collapsed} />
        </div>
      </nav>

      {/* Mobile bottom navigation */}
      <div className="flex md:hidden w-full h-full items-center justify-evenly bg-white">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className="flex flex-col items-center justify-center flex-1 py-2 text-neutral-600 hover:text-blue-600 transition-colors"
            title={item.label}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </a>
        ))}
        <div className="flex flex-col items-center justify-center flex-1 py-2 text-neutral-600 hover:text-blue-600 transition-colors">
          <span className="text-lg">
            <FaUser />
          </span>
          <span className="text-xs mt-1 font-medium">Profile</span>
        </div>  
      </div>
    </aside>
  );
};

export default Sidebar;
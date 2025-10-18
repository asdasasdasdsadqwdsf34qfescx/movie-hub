"use client";
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import ProfileSection from './ProfileSection';

interface Props {
  collapsed: boolean;
}

const DropdownProfileTrigger: React.FC<Props> = ({ collapsed }) => {
  const [open, setOpen] = useState(false);

  const navItemClasses = `flex items-center px-4 py-2.5 rounded-lg text-neutral-800 hover:bg-neutral-200/50 hover:text-blue-600 transition-colors duration-150 cursor-pointer ${
    collapsed ? 'justify-center' : ''
  }`;

  const dropdownClasses = `absolute ${
    collapsed ? 'left-0 right-0 bottom-full mb-2' : 'left-full ml-2 bottom-0'
  } z-50 bg-white rounded-lg shadow-lg border border-neutral-100`;

  return (
    <div
      className={`${navItemClasses} relative`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen(!open)}
      tabIndex={0}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-base"><FaUser /></span>
      <span className={`ml-3 origin-left transition-all duration-300 ${collapsed ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'} hidden md:inline whitespace-nowrap font-medium`}>Profile</span>
      {open && (
        <div className={dropdownClasses}>
          <ProfileSection collapsed={collapsed} />
        </div>
      )}
    </div>
  );
};

export default DropdownProfileTrigger;
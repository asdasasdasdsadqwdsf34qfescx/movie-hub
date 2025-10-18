"use client";
import React, { useEffect, useState } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from "../../services/supabaseClient";

interface ProfileSectionProps {
  collapsed: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ collapsed }) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (mounted) setEmail(data.user?.email ?? null);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <FaUser className="text-2xl text-blue-500 bg-blue-100 rounded-full p-1" />
        <button
          className="text-red-600 hover:text-red-700 text-xl"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-4 text-sm text-neutral-800 w-64">
      <div className="flex items-center gap-3">
        <FaUser className="text-3xl text-blue-500 bg-blue-100 rounded-full p-1" />
        <div>
          <div className="font-medium break-all">{email ?? "Guest"}</div>
          <div className="text-neutral-500 text-xs">{email ? "Signed in" : "Not signed in"}</div>
        </div>
      </div>

      <button
        className="flex items-center justify-center gap-1.5 bg-neutral-100 border border-neutral-200 text-red-600 rounded-md py-1.5 mt-1 hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-sm"
        onClick={handleLogout}
        title="Logout"
        aria-label="Logout"
      >
        <FaSignOutAlt className="text-sm" /> Log out
      </button>
    </div>
  );
};

export default ProfileSection;

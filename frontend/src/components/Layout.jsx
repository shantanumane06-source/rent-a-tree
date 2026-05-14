import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, TreePine } from 'lucide-react';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="main-content">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--pista-dark)', fontWeight: 800 }}>
            <TreePine size={20} /> Rent-a-Tree
          </div>
          <div />
        </div>
        {children}
      </div>
    </div>
  );
}

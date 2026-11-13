import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success';
  projectId: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Peringatan Titik Kunci 24 Jam',
    message: 'Meja Makan Jati: Keputusan warna finishing harus dikunci sebelum tahap 4 dimulai.',
    timestamp: '15 menit lalu',
    type: 'warning',
    projectId: 'proj-1',
  },
  {
    id: 'notif-2',
    title: 'Change Order Disetujui',
    message: 'Dekorasi Panggung: Pelanggan menyetujui penggantian kain ke Emerald Green.',
    timestamp: '2 jam lalu',
    type: 'success',
    projectId: 'proj-4',
  },
  {
    id: 'notif-3',
    title: 'Penundaan Dikonfirmasi',
    message: 'Lemari Pakaian: Keputusan bukaan pintu kaca ditunda hingga 25 Oktober 2026.',
    timestamp: 'Kemarin',
    type: 'info',
    projectId: 'proj-2',
  },
];

interface NotificationBellProps {
  onSelectProject: (projectId: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onSelectProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.length;

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label={unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : 'Notifikasi'}
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -14, 14, -8, 8, 0] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4 }}
        >
          <Bell size={18} />
        </motion.div>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden"
          >
            <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="font-display font-bold text-xs text-slate-900">
                Pusat Pemberitahuan Revio
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {unreadCount} Belum Dibaca
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Semua notifikasi telah dibaca.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onSelectProject(n.projectId);
                      setIsOpen(false);
                    }}
                    className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors space-y-1 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'warning' && (
                          <AlertTriangle size={13} className="text-amber-500 shrink-0" />
                        )}
                        {n.type === 'success' && (
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        )}
                        {n.type === 'info' && (
                          <Clock size={13} className="text-blue-500 shrink-0" />
                        )}
                        <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDismiss(n.id, e)}
                        className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500">{n.timestamp}</span>
                      <span className="text-xs text-[#0E9F8E] font-semibold flex items-center gap-0.5">
                        Lihat Proyek <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { CreditCard, Activity, ArrowRight, MessageCircle, Phone, CalendarCheck, X, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: React.FC = () => {
  const { setIsBillingOpen } = useApp();
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const tasks = [
    { id: '1', title: 'Follow up with Sarah Wijaya', due: 'Today, 2:00 PM', source: 'WhatsApp', priority: 'High', completed: false },
    { id: '2', title: 'Listing review: Asahi Hills', due: 'Tomorrow, 10:00 AM', source: 'Internal', priority: 'Medium', completed: false },
    { id: '3', title: 'Client meeting: Pak Budi', due: 'Sep 7, 4:00 PM', source: 'Instagram', priority: 'High', completed: false },
  ];

  const weekDates = [
    { d: 1, hasTask: false, isToday: false },
    { d: 2, hasTask: true, isToday: false },
    { d: 3, hasTask: false, isToday: false },
    { d: 4, hasTask: false, isToday: false },
    { d: 5, hasTask: true, isToday: true },
    { d: 6, hasTask: true, isToday: false },
    { d: 7, hasTask: false, isToday: false }
  ];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
        <Header />

      <div className="p-4 space-y-6">
            {/* Stats Cards */}
          <div className="flex gap-4">
                <Card 
                  className="flex-1 relative overflow-hidden"
                  onClick={() => setIsBillingOpen(true)}
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                      <CreditCard size={48} className="text-slate-900" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Plan Status</p>
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Active</p>
                  </div>
                  <p className="text-[10px] text-slate-400">Exp: 31 Dec 2025</p>
                </Card>

                <Card 
                  className="flex-1 relative overflow-hidden"
                  onClick={() => setIsBillingOpen(true)}
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Activity size={48} className="text-slate-900" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Tokens</p>
                  <div className="flex items-center gap-2 mb-2">
                      <p className="text-2xl font-bold text-primary text-orange-500">120</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">left</p>
                  </div>
                  <p className="text-[10px] text-slate-400">Exp: 15 Jan 2026</p>
                </Card>
          </div>

            {/* Inline Calendar */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-base">September 2025</p>
                  <button 
                      onClick={() => setIsCalendarOpen(true)}
                        className="bg-orange-50 dark:bg-slate-800 px-3 py-1.5 rounded-full"
                    >
                      <span className="text-xs text-orange-500 font-medium">View All</span>
                  </button>
              </div>
                
              <div className="flex justify-between mb-3">
                    {days.map((d, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-400 w-8 text-center">{d}</span>
                    ))}
              </div>
                
              <div className="flex justify-between">
                    {weekDates.map((date, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                          <div 
                                className={`
                                    h-8 w-8 rounded-full flex items-center justify-center
                                    ${date.isToday 
                                        ? 'bg-orange-500 shadow-sm' 
                                        : 'bg-transparent'}
                                `}
                            >
                              <span className={`text-sm font-medium ${date.isToday ? 'text-white font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                    {date.d}
                              </span>
                          </div>
                          <div className={`w-1 h-1 rounded-full ${date.hasTask ? 'bg-orange-500' : 'bg-transparent'}`}></div>
                      </div>
                    ))}
              </div>
            </Card>

            {/* Upcoming Tasks List */}
          <div>
              <div className="flex justify-between items-center mb-3 px-1">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Upcoming Tasks</h2>
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                      <ArrowRight size={16} className="text-slate-500" />
                  </button>
              </div>
              <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card key={task.id} className="flex items-center justify-between" noPadding>
                          <div className="p-4 flex items-center gap-4 flex-1">
                              <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    ${task.priority === 'High' ? 'bg-red-50' : 'bg-blue-50'}
                                `}>
                                  {task.source === 'WhatsApp' ? <MessageCircle size={20} className={task.priority === 'High' ? 'text-red-500' : 'text-blue-500'} /> : 
                                   <CalendarCheck size={20} className="text-blue-500" />}
                              </div>
                              <div className="flex-1">
                                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center gap-1">
                                          <Clock size={10} className="text-slate-400" />
                                          <span className="text-xs text-slate-500">{task.due}</span>
                                      </div>
                                      <div className="bg-green-100 px-1.5 py-0.5 rounded-full">
                                          <span className="text-[10px] font-medium text-green-700">{task.source}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="pr-4">
                              <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center">
                                  <Phone size={16} className="text-slate-400" />
                              </button>
                          </div>
                        </Card>
                    ))}
              </div>
          </div>
      </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCalendarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-950 w-full rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Calendar</h2>
                <button onClick={() => setIsCalendarOpen(false)}>
                  <X size={24} className="text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-center text-slate-500">Full calendar view would go here.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;

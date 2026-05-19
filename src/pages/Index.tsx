"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Globe, Activity, RefreshCw, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import ThreeDCard from '@/components/ThreeDCard';
import CurrencyChart from '@/components/CurrencyChart';
import { showSuccess, showError } from '@/utils/toast';

interface ExchangeRates {
  [key: string]: number;
}

const Index = () => {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [showAll, setShowAll] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '1m'>('7d');

  // محاكاة بيانات الرسم البياني بناءً على الفترة
  const chartData = useMemo(() => {
    if (timeRange === '7d') {
      return [
        { name: 'السبت', value: 400 }, { name: 'الأحد', value: 350 },
        { name: 'الاثنين', value: 500 }, { name: 'الثلاثاء', value: 480 },
        { name: 'الأربعاء', value: 600 }, { name: 'الخميس', value: 550 },
        { name: 'الجمعة', value: 700 }
      ];
    } else {
      return [
        { name: 'أسبوع 1', value: 300 }, { name: 'أسبوع 2', value: 600 },
        { name: 'أسبوع 3', value: 450 }, { name: 'أسبوع 4', value: 900 }
      ];
    }
  }, [timeRange]);

  // محاكاة فروق الأسعار (لأن الـ API المجاني لا يعطي التغير اللحظي في طلب واحد)
  const changes = useMemo(() => {
    const mockChanges: { [key: string]: { val: string, isUp: boolean } } = {};
    ["EUR", "GBP", "JPY", "SAR", "AED", "EGP"].forEach(s => {
      const isUp = Math.random() > 0.4;
      mockChanges[s] = {
        val: (Math.random() * 2).toFixed(2) + "%",
        isUp
      };
    });
    return mockChanges;
  }, [rates]);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate.host/latest?base=USD');
      const data = await response.json();
      if (data.rates) {
        setRates(data.rates);
        setLastUpdate(new Date().toLocaleTimeString('ar-EG'));
        showSuccess("تم تحديث الأسعار بنجاح");
      }
    } catch (error) {
      showError("فشل التحديث، يتم عرض بيانات مخزنة");
      setRates({ "EUR": 0.92, "GBP": 0.79, "JPY": 151.42, "SAR": 3.75, "AED": 3.67, "EGP": 48.50 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const topCurrencies = ["EUR", "GBP", "JPY", "SAR", "AED", "EGP"];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30" dir="rtl">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-white to-slate-400">
                لوحة تحكم العملات التقنية
              </h1>
              <p className="text-slate-400 text-sm">تحديثات حية لأسعار الصرف العالمية</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRates}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
            <span className="text-xs text-slate-500 mr-2">آخر تحديث: {lastUpdate}</span>
          </motion.button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {topCurrencies.map((symbol, index) => (
            <motion.div key={symbol} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <ThreeDCard className="p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${changes[symbol]?.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {changes[symbol]?.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{changes[symbol]?.val || "0%"}</span>
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm mb-1">{symbol} / USD</h3>
                <div className="text-3xl font-bold tracking-tight">
                  {rates[symbol] ? rates[symbol].toFixed(4) : '---'}
                </div>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: changes[symbol]?.isUp ? '75%' : '45%' }}
                    className={`h-full bg-gradient-to-r ${changes[symbol]?.isUp ? 'from-emerald-600 to-teal-400' : 'from-rose-600 to-orange-400'}`}
                  />
                </div>
              </ThreeDCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <ThreeDCard className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-400" />
                  <h2 className="text-xl font-semibold">تحليل الاتجاهات</h2>
                </div>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button 
                    onClick={() => setTimeRange('7d')}
                    className={`px-4 py-1 text-xs rounded-md transition-all ${timeRange === '7d' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    7 أيام
                  </button>
                  <button 
                    onClick={() => setTimeRange('1m')}
                    className={`px-4 py-1 text-xs rounded-md transition-all ${timeRange === '1m' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    شهر
                  </button>
                </div>
              </div>
              <CurrencyChart data={chartData} />
            </ThreeDCard>
          </div>

          {/* Side List */}
          <div className="lg:col-span-1">
            <ThreeDCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="text-purple-400" />
                <h2 className="text-xl font-semibold">الأسواق العالمية</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(rates).slice(0, 6).map(([symbol, rate]) => (
                  <div key={symbol} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {symbol.substring(0, 2)}
                      </div>
                      <span className="font-medium">{symbol}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{rate.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500">مقابل 1 دولار</div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowAll(true)}
                className="w-full mt-6 py-3 text-sm text-blue-400 hover:text-blue-300 font-medium border border-blue-400/20 rounded-xl hover:bg-blue-400/5 transition-all"
              >
                عرض جميع العملات
              </button>
            </ThreeDCard>
          </div>
        </div>

        {/* Modal for All Currencies */}
        <AnimatePresence>
          {showAll && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowAll(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold">جميع العملات المتاحة</h2>
                  <button onClick={() => setShowAll(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar">
                  {Object.entries(rates).map(([symbol, rate]) => (
                    <div key={symbol} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex flex-col">
                      <span className="text-blue-400 font-bold">{symbol}</span>
                      <span className="text-lg font-mono">{rate.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 pb-10 text-center text-slate-500 text-sm border-t border-slate-800 pt-8">
          <p>© 2024 لوحة تحكم العملات التقنية - جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
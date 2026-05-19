"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Globe, Activity, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate.host/latest?base=USD');
      const data = await response.json();
      if (data.rates) {
        setRates(data.rates);
        setLastUpdate(new Date().toLocaleTimeString('ar-EG'));
        showSuccess("تم تحديث البيانات بنجاح");
      }
    } catch (error) {
      showError("فشل في جلب البيانات، يتم عرض بيانات تجريبية");
      // Mock data fallback
      setRates({ "EUR": 0.92, "GBP": 0.79, "JPY": 151.42, "SAR": 3.75, "AED": 3.67 });
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
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
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
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
            <span className="text-xs text-slate-500 mr-2">آخر تحديث: {lastUpdate}</span>
          </motion.button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {topCurrencies.map((symbol, index) => (
            <motion.div
              key={symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThreeDCard className="p-6 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+2.4%</span>
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm mb-1">{symbol} / USD</h3>
                <div className="text-3xl font-bold tracking-tight">
                  {rates[symbol] ? rates[symbol].toFixed(4) : '---'}
                </div>
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
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
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 ring-blue-500">
                  <option>آخر 7 أيام</option>
                  <option>آخر شهر</option>
                </select>
              </div>
              <CurrencyChart />
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
              <button className="w-full mt-6 py-3 text-sm text-blue-400 hover:text-blue-300 font-medium border border-blue-400/20 rounded-xl hover:bg-blue-400/5 transition-all">
                عرض جميع العملات
              </button>
            </ThreeDCard>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pb-10 text-center text-slate-500 text-sm border-t border-slate-800 pt-8">
          <p>© 2024 لوحة تحكم العملات التقنية - جميع الحقوق محفوظة</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-blue-400 transition-colors">الخصوصية</a>
            <a href="#" className="hover:text-blue-400 transition-colors">الشروط</a>
            <a href="#" className="hover:text-blue-400 transition-colors">اتصل بنا</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
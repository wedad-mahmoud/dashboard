"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, RefreshCw, ArrowUpRight, ArrowDownRight, Info, Zap } from 'lucide-react';
import ThreeDCard from '@/components/ThreeDCard';
import CurrencyChart from '@/components/CurrencyChart';
import { showSuccess, showError } from '@/utils/toast';

interface ExchangeRates {
  [key: string]: number;
}

const currencyDetails: { [key: string]: { name: string, country: string } } = {
  "USD": { name: "دولار أمريكي", country: "الولايات المتحدة" },
  "EUR": { name: "يورو", country: "الاتحاد الأوروبي" },
  "GBP": { name: "جنيه إسترليني", country: "المملكة المتحدة" },
  "JPY": { name: "ين ياباني", country: "اليابان" },
  "SAR": { name: "ريال سعودي", country: "المملكة العربية السعودية" },
  "AED": { name: "درهم إماراتي", country: "الإمارات العربية المتحدة" },
  "EGP": { name: "جنيه مصري", country: "جمهورية مصر العربية" },
  "KWD": { name: "دينار كويتي", country: "الكويت" },
  "QAR": { name: "ريال قطري", country: "قطر" },
  "BHD": { name: "دينار بحريني", country: "البحرين" },
  "OMR": { name: "ريال عماني", country: "سلطنة عمان" },
  "JOD": { name: "دينار أردني", country: "الأردن" },
  "TRY": { name: "ليرة تركية", country: "تركيا" },
  "CNY": { name: "يوان صيني", country: "الصين" },
  "CHF": { name: "فرنك سويسري", country: "سويسرا" },
  "CAD": { name: "دولار كندي", country: "كندا" },
  "AUD": { name: "دولار أسترالي", country: "أستراليا" },
};

const Index = () => {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [timeRange, setTimeRange] = useState<'7d' | '1m'>('7d');

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
        showSuccess("تم تحديث النبض الرقمي");
      }
    } catch (error) {
      showError("خطأ في الاتصال بالشبكة العصبية");
      setRates({ "USD": 1, "EUR": 0.92, "GBP": 0.79, "JPY": 151.42, "SAR": 3.75, "AED": 3.67, "EGP": 48.50 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const topCurrencies = ["EUR", "GBP", "JPY", "SAR", "AED", "EGP"];

  return (
    <div className="min-h-screen bg-[#0a0510] text-slate-100 p-4 md:p-8 font-sans selection:bg-lime-400/30" dir="rtl">
      {/* Cyber Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5">
            <div className="p-4 bg-lime-400 rounded-3xl shadow-[0_0_20px_rgba(163,230,53,0.4)] rotate-3">
              <Zap className="w-8 h-8 text-[#0a0510] fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-l from-lime-400 via-white to-purple-400">
                نظام النبض المالي
              </h1>
              <p className="text-purple-400/60 text-xs font-mono uppercase tracking-widest">Cyber-Currency Interface v2.0</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(163,230,53,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchRates}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-[#1a0b2e] hover:bg-[#251042] border border-purple-500/30 rounded-2xl transition-all disabled:opacity-50 group"
          >
            <RefreshCw className={`w-5 h-5 text-lime-400 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="font-bold text-sm">مزامنة البيانات</span>
            <div className="h-4 w-[1px] bg-purple-500/30 mx-2" />
            <span className="text-[10px] text-purple-400 font-mono">{lastUpdate}</span>
          </motion.button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {topCurrencies.map((symbol, index) => (
            <motion.div key={symbol} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
              <ThreeDCard className="p-8 group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:text-lime-400 transition-colors">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${changes[symbol]?.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {changes[symbol]?.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{changes[symbol]?.val || "0%"}</span>
                  </div>
                </div>
                <h3 className="text-purple-400/50 text-xs font-mono mb-2 uppercase tracking-tighter">{symbol} / USD UNIT</h3>
                <div className="text-4xl font-black tracking-tighter text-white group-hover:text-lime-400 transition-colors">
                  {rates[symbol] ? rates[symbol].toFixed(4) : '0.0000'}
                </div>
                <div className="mt-6 h-1.5 w-full bg-purple-900/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: changes[symbol]?.isUp ? '80%' : '40%' }}
                    className={`h-full shadow-[0_0_10px_rgba(163,230,53,0.5)] ${changes[symbol]?.isUp ? 'bg-lime-400' : 'bg-purple-500'}`}
                  />
                </div>
              </ThreeDCard>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ThreeDCard className="p-8">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-lime-400 rounded-full shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
                  <h2 className="text-2xl font-black tracking-tight">التحليل الموجي</h2>
                </div>
                <div className="flex bg-[#0a0510] p-1.5 rounded-2xl border border-purple-500/20">
                  <button 
                    onClick={() => setTimeRange('7d')}
                    className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${timeRange === '7d' ? 'bg-lime-400 text-[#0a0510] shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'text-purple-400 hover:text-white'}`}
                  >
                    7D
                  </button>
                  <button 
                    onClick={() => setTimeRange('1m')}
                    className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${timeRange === '1m' ? 'bg-lime-400 text-[#0a0510] shadow-[0_0_15px_rgba(163,230,53,0.3)]' : 'text-purple-400 hover:text-white'}`}
                  >
                    1M
                  </button>
                </div>
              </div>
              <CurrencyChart data={chartData} />
            </ThreeDCard>
          </div>

          {/* Currency Directory Section */}
          <div className="lg:col-span-1">
            <ThreeDCard className="p-8 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <Info className="text-lime-400 w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tight">قاعدة البيانات</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {Object.keys(currencyDetails).map((symbol) => (
                  <div key={symbol} className="p-5 bg-[#0a0510]/60 border border-purple-500/10 rounded-[1.5rem] hover:border-lime-400/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-lime-400 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lime-400 font-black font-mono text-lg">{symbol}</span>
                      <span className="text-[9px] px-3 py-1 bg-purple-500/10 rounded-full text-purple-300 font-mono uppercase tracking-widest">
                        {currencyDetails[symbol].country}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 font-medium group-hover:text-white transition-colors">
                      {currencyDetails[symbol].name}
                    </div>
                  </div>
                ))}
              </div>
            </ThreeDCard>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pb-12 text-center border-t border-purple-500/10 pt-10">
          <div className="flex justify-center gap-8 mb-6">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-150" />
          </div>
          <p className="text-purple-400/40 text-[10px] font-mono uppercase tracking-[0.3em]">
            © 2026 CYBER-CURRENCY INTERFACE // ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
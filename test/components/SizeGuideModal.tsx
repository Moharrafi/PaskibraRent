import React from 'react';
import { X, Ruler, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeData = [
    { size: 'S', height: '155-160', chest: '88-92', waist: '72-76' },
    { size: 'M', height: '160-165', chest: '92-96', waist: '76-80' },
    { size: 'L', height: '165-170', chest: '96-100', waist: '80-84' },
    { size: 'XL', height: '170-175', chest: '100-104', waist: '84-88' },
    { size: 'XXL', height: '175+', chest: '104-108', waist: '88-92' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-2 text-slate-900">
                <Ruler className="text-red-600" />
                <h3 className="font-bold text-lg">Panduan Ukuran PDU</h3>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X size={20} />
             </button>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3">
               <Info className="text-blue-600 shrink-0" size={20} />
               <p className="text-sm text-blue-800 leading-relaxed">
                 Ukur lingkar dada pas (tidak terlalu longgar). Kostum PDU kami menggunakan bahan Japan Drill yang <i>firm</i> (tegak) sehingga fitting yang pas sangat disarankan agar terlihat gagah.
               </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Tinggi (cm)</th>
                    <th className="px-4 py-3">Lingkar Dada (cm)</th>
                    <th className="px-4 py-3">Pinggang (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sizeData.map((row, i) => (
                    <tr key={row.size} className={`hover:bg-slate-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-3 font-bold text-slate-900 bg-slate-50/80">{row.size}</td>
                      <td className="px-4 py-3 text-slate-600">{row.height}</td>
                      <td className="px-4 py-3 text-slate-600">{row.chest}</td>
                      <td className="px-4 py-3 text-slate-600">{row.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 text-center">
              *Toleransi jahitan ± 1-2 cm. Konsultasikan dengan admin jika ragu.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SizeGuideModal;
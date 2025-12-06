import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';

const Footer = () => {
  const { websiteData, getInfoValue } = useWebsite();

  return (
    <footer className="relative py-8 mt-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div 
            className="rounded-2xl border p-6"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Column 1 - Brand Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-white mb-2">
                  <span className="bg-gradient-to-r from-orange-300 to-orange-300 bg-clip-text text-transparent">
                    {getInfoValue('TITLE')}
                  </span>
                </h2>
                <div 
                  className="w-10 h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.8), rgba(249, 115, 22, 0.4))'
                  }}
                ></div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-xs">
                  Copyright © {new Date().getFullYear()}
                </p>
               
                <a 
                  href="https://maxiipins.com/" 
                  className="text-gray-300 text-xs font-medium hover:text-orange-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Designed by Maxiipins
                </a>
              </div>
            </div>

            {/* Column 2 - Sözleşmeler */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">
                <span className="bg-gradient-to-r from-orange-300 to-orange-300 bg-clip-text text-transparent">
                  Sözleşmeler
                </span>
              </h3>
              <ul className="space-y-1.5">
                {websiteData?.contracts?.map((contract) => (
                  <li key={contract.id}>
                    <Link
                      to={`/sozlesme/${contract.slug}`}
                      className="text-gray-400 hover:text-orange-300 transition-colors text-xs block"
                    >
                      {contract.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Müşteri Hizmetleri */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">
                <span className="bg-gradient-to-r from-orange-300 to-orange-300 bg-clip-text text-transparent">
                  Müşteri Hizmetleri
                </span>
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/iletisim"
                    className="text-gray-400 hover:text-orange-300 transition-colors text-xs block"
                  >
                    İletişim & Ulaşım
                  </Link>
                </li>
                <li>
                  <Link
                    to="/banka-hesaplari"
                    className="text-gray-400 hover:text-orange-300 transition-colors text-xs block"
                  >
                    Banka Hesapları
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Satış Hizmetleri */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">
                <span className="bg-gradient-to-r from-orange-300 to-orange-300 bg-clip-text text-transparent">
                  Satış Hizmetleri
                </span>
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/toplu-satin-alim"
                    className="text-gray-400 hover:text-orange-300 transition-colors text-xs block"
                  >
                    Toplu Satın Alım
                  </Link>
                </li>
                <li>
                  <Link
                    to="/geri-iade"
                    className="text-gray-400 hover:text-orange-300 transition-colors text-xs block"
                  >
                    Geri İade
                  </Link>
                </li>
                <li>
                  <Link
                    to="/canli-destek"
                    className="text-gray-400 hover:text-orange-300 transition-colors text-xs block"
                  >
                    Canlı Destek
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





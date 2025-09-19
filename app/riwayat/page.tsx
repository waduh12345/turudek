const RiwayatPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Nomor HP contoh: +628123123123"
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Order History Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-100 px-6 py-4">
              <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-800">
                <div>CODE</div>
                <div>PRODUCT</div>
                <div>USER ID</div>
                <div>TOTAL</div>
                <div>PAYMENT</div>
                <div>PROCESSING</div>
              </div>
            </div>

            {/* Table Body - Empty State */}
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500 text-lg">
                Belum ada orderan, top up dulu yuk!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Green Section */}
      <div className="relative bg-green-500 py-16 overflow-hidden">
        {/* Wave Design - Top */}
        <div className="absolute top-0 left-0 w-full h-8 bg-green-500 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="text-center text-white">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
              </div>
              <span className="text-4xl font-bold">TOKOGAME.COM</span>
            </div>

            {/* Main Promo Text */}
            <h2 className="text-2xl font-bold mb-4">
              Top Up Games Voucher Lebih Murah 20%, Cepat, dan Aman
            </h2>

            {/* Description */}
            <p className="text-lg max-w-4xl mx-auto leading-relaxed">
              Situs resmi top up games dan voucher harga termurah, tercepat, dan terpercaya. Beli Diamond Mobile Legends ML, Free Fire FF DM, Royal Dreams, HDI MD, Steam Wallet, PUBG UC, Bigo Diamonds, Boss Party, CODM CP, Honor of Kings Tokens, Genshin Impact Crystals dengan diskon dan harga promo paling murah dan banyak bonus menarik!
            </p>
          </div>
        </div>

        {/* Wave Design - Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-green-500 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 scale-150"></div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatPage;

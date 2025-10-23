const PromotionBanner = () => {
  return (
    <div className="relative bg-[#C02628] py-16 overflow-hidden">
      {/* Wave Design - Top */}
      <div className="absolute top-0 left-0 w-full h-8 bg-[#C02628] opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center text-white">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-[#C02628] rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
            </div>
            <span className="text-4xl font-bold">kiostetta.COM</span>
          </div>

          {/* Main Promo Text */}
          <h2 className="text-2xl font-bold mb-4">
            Top Up Games Voucher Lebih Murah 20%, Cepat, dan Aman
          </h2>

          {/* Description */}
          <p className="text-lg max-w-4xl mx-auto leading-relaxed">
            Situs resmi top up games dan voucher harga termurah, tercepat, dan
            terpercaya. Beli Diamond Mobile Legends ML, Free Fire FF DM, Royal
            Dreams, HDI MD, Steam Wallet, PUBG UC, Bigo Diamonds, Boss Party,
            CODM CP, Honor of Kings Tokens, Genshin Impact Crystals dengan
            diskon dan harga promo paling murah dan banyak bonus menarik!
          </p>
        </div>
      </div>

      {/* Wave Design - Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-[#C02628] opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-12 scale-150"></div>
      </div>
    </div>
  );
};

export default PromotionBanner;
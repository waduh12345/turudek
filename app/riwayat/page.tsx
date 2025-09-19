const RiwayatPage = () => {
  return (
    <div className="bg-white">
      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Nomor HP contoh: +628123123123"
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
    </div>
  );
};

export default RiwayatPage;

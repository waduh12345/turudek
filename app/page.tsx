import SectionWrapper from "@/components/ui/section-wrapper";
import Image from "next/image";
import Link from "next/link";
import HotNews from "./(home)/hot-news";

const Page = () => {
  type Item = {
    id: number;
    name: string;
    thumbnail: string;
  };

  const games: Item[] = [
    {
      id: 1,
      name: "Mobile Legends: Bang Bang",
      thumbnail: "https://placehold.co/650?text=Mobile+Legends",
    },
    {
      id: 2,
      name: "PUBG Mobile",
      thumbnail: "https://placehold.co/650?text=PUBG+Mobile",
    },
    {
      id: 3,
      name: "Free Fire",
      thumbnail: "https://placehold.co/650?text=Free+Fire",
    },
    {
      id: 4,
      name: "Genshin Impact",
      thumbnail: "https://placehold.co/650?text=Genshin+Impact",
    },
    {
      id: 5,
      name: "Call of Duty Mobile",
      thumbnail: "https://placehold.co/650?text=COD+Mobile",
    },
    {
      id: 6,
      name: "Valorant",
      thumbnail: "https://placehold.co/650?text=Valorant",
    },
    {
      id: 7,
      name: "Clash of Clans",
      thumbnail: "https://placehold.co/650?text=Clash+of+Clans",
    },
    {
      id: 8,
      name: "Arena of Valor",
      thumbnail: "https://placehold.co/650?text=Arena+of+Valor",
    },
    {
      id: 9,
      name: "League of Legends: Wild Rift",
      thumbnail: "https://placehold.co/650?text=LoL+Wild+Rift",
    },
    {
      id: 10,
      name: "Minecraft",
      thumbnail: "https://placehold.co/650?text=Minecraft",
    },
  ];

  const vouchers: Item[] = [
    {
      id: 1,
      name: "Google Play Gift Card",
      thumbnail: "https://placehold.co/650?text=Google+Play",
    },
    {
      id: 2,
      name: "App Store & iTunes Gift Card",
      thumbnail: "https://placehold.co/650?text=iTunes",
    },
    {
      id: 3,
      name: "Steam Wallet",
      thumbnail: "https://placehold.co/650?text=Steam+Wallet",
    },
    {
      id: 4,
      name: "Garena Shells",
      thumbnail: "https://placehold.co/650?text=Garena+Shells",
    },
    {
      id: 5,
      name: "PlayStation Store",
      thumbnail: "https://placehold.co/650?text=PlayStation",
    },
    {
      id: 6,
      name: "Xbox Live Gift Card",
      thumbnail: "https://placehold.co/650?text=Xbox+Live",
    },
    {
      id: 7,
      name: "Netflix Voucher",
      thumbnail: "https://placehold.co/650?text=Netflix",
    },
    {
      id: 8,
      name: "Spotify Premium",
      thumbnail: "https://placehold.co/650?text=Spotify",
    },
    {
      id: 9,
      name: "Token PLN",
      thumbnail: "https://placehold.co/650?text=TokenPLN",
    },
    {
      id: 10,
      name: "Vidio Premier",
      thumbnail: "https://placehold.co/650?text=Vidio",
    },
  ];

  const phonesCredit: Item[] = [
    {
      id: 1,
      name: "Indosat",
      thumbnail: "https://placehold.co/650?text=Indosat",
    },
    {
      id: 2,
      name: "Indosat",
      thumbnail: "https://placehold.co/650?text=Tri",
    },
    {
      id: 3,
      name: "Telkomsel",
      thumbnail: "https://placehold.co/650?text=Telkomsel",
    },
    {
      id: 4,
      name: "XL",
      thumbnail: "https://placehold.co/650?text=XL",
    },
    {
      id: 5,
      name: "Axis",
      thumbnail: "https://placehold.co/650?text=Axis",
    },
    {
      id: 6,
      name: "Smartfren",
      thumbnail: "https://placehold.co/650?text=Smartfren",
    },
  ];

  const eMoneys: Item[] = [
    {
      id: 1,
      name: "Dana",
      thumbnail: "https://placehold.co/650?text=Dana",
    },
    {
      id: 2,
      name: "Gopay",
      thumbnail: "https://placehold.co/650?text=Gopay",
    },
    {
      id: 3,
      name: "Ovo",
      thumbnail: "https://placehold.co/650?text=Ovo",
    },
    {
      id: 3,
      name: "Shopee Pay",
      thumbnail: "https://placehold.co/650?text=Shoope+Pay",
    },
  ];

  return (
    <div className="container pt-10">
      <HotNews />

      <section className="mb-6">
        <Link className="max-w-xl mx-auto block" href="/produk">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari di Tokogame"
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
        </Link>
      </section>

      <SectionWrapper title="TOP UP GAME" seeAllUrl="/produk/?category=Games">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
          {games.map((item) => (
            <div key={item.id}>
              <Image
                className="w-full aspect-square mb-2 rounded-xl"
                width={100}
                height={100}
                src={item.thumbnail}
                alt={item.name}
                unoptimized
              />
              <p className="text-center font-mono text-sm sm:text-base">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="VOUCHER" seeAllUrl="/produk/?category=Voucher">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
          {vouchers.map((item) => (
            <div key={item.id}>
              <Image
                className="w-full aspect-square mb-2 rounded-xl"
                width={100}
                height={100}
                src={item.thumbnail}
                alt={item.name}
                unoptimized
              />
              <p className="text-center font-mono text-sm sm:text-base">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="PULSA" seeAllUrl="/produk/?category=Phone">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
          {phonesCredit.map((item) => (
            <div key={item.id}>
              <Image
                className="w-full aspect-square mb-2 rounded-xl"
                width={100}
                height={100}
                src={item.thumbnail}
                alt={item.name}
                unoptimized
              />
              <p className="text-center font-mono text-sm sm:text-base">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="E-MONEY" seeAllUrl="/produk/?category=E-Money">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
          {eMoneys.map((item) => (
            <div key={item.id}>
              <Image
                className="w-full aspect-square mb-2 rounded-xl"
                width={100}
                height={100}
                src={item.thumbnail}
                alt={item.name}
                unoptimized
              />
              <p className="text-center font-mono text-sm sm:text-base">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Page;


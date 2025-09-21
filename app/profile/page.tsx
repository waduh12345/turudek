"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import PromotionBanner from "@/components/section/promotion-banner";

const Page = () => {
  const { data } = useSession();

  return (
    <>
      <div className="container pt-10 pb-20">
        <div className="grid grid-cols-12 gap-8">
          {/* Profile Card */}
          <section className="col-span-5 p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
            <div className="flex gap-x-4 mb-6 items-center">
              <Avatar className="size-20">
                <AvatarImage
                  className="rounded-xl"
                  src={data?.user?.image || ""}
                />
                <AvatarFallback className="size-20 bg-[#05ce78] text-black flex justify-center items-center rounded-xl font-bold">
                  <span className="text-3xl">
                    {data?.user?.name ? data.user.name[0].toUpperCase() : "?"}
                  </span>
                </AvatarFallback>
              </Avatar>

              <section className="space-y-1.5">
                <h2 className="font-mono text-xl tracking-wide">
                  {data?.user?.name}
                </h2>
                <p className="text-gray-300 text-sm">✉️ {data?.user?.email}</p>

                <div className="flex items-center gap-x-4 mt-3">
                  <p className="font-mono text-lg">💳 Rp 0</p>
                  <button className="px-4 py-1.5 rounded-lg bg-[#05ce78] text-black font-bold text-sm transition hover:bg-[#04b36a]">
                    + Top Up
                  </button>
                </div>
              </section>
            </div>

            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
              className="w-full py-2 mt-4 rounded-lg bg-red-500 font-semibold text-sm transition hover:bg-red-600"
            >
              Sign Out
            </button>
          </section>

          {/* Tabs Section */}
          <div className="col-span-7 p-6 rounded-2xl shadow-lg bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
            <Tabs defaultValue="tab1">
              <TabsList className="flex gap-3 mb-6 border-b border-gray-700">
                <TabsTrigger
                  value="tab1"
                  className="px-5 py-2 rounded-t-lg text-sm font-semibold data-[state=active]:bg-[#05ce78] data-[state=active]:text-black data-[state=active]:shadow transition hover:bg-[#05ce78]/20"
                >
                  Recent Order
                </TabsTrigger>
                <TabsTrigger
                  value="tab2"
                  className="px-5 py-2 rounded-t-lg text-sm font-semibold data-[state=active]:bg-[#05ce78] data-[state=active]:text-black data-[state=active]:shadow transition hover:bg-[#05ce78]/20"
                >
                  Referral Bonus
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tab1" className="mt-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm">
                    Belum ada order terbaru. Top up dulu yuk
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tab2" className="mt-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm">
                    Belum ada referral bonus.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <PromotionBanner />
    </>
  );
};

export default Page;

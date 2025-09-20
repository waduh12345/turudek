"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

const Page = () => {
  const { data } = useSession();

  return (
    <div className="container pt-10 pb-20">
      <div className="grid grid-cols-12 gap-10">
        <section className="col-span-5 p-4 bg-gray-100 rounded-md shadow">
          <div className="flex gap-x-3 mb-4">
            <section>
              <Avatar className="size-20">
                <AvatarImage
                  className="rounded-md"
                  src={data?.user?.image || ""}
                />
                <AvatarFallback className="size-20 bg-accent text-background flex justify-center items-center rounded-md">
                  <span className="text-3xl">
                    {data?.user?.name ? data.user.name[0].toUpperCase() : "?"}
                  </span>
                </AvatarFallback>
              </Avatar>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-mono text-lg">{data?.user?.name}</h2>
              <p>✉️ {data?.user?.email}</p>

              <div className="flex items-center gap-x-4 font-mono">
                <p>💳 Rp 0</p>
                <button className="px-4 py-1 bg-accent rounded-md text-sm">
                  + Top Up
                </button>
              </div>
            </section>
          </div>

          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            className="px-4 py-1 bg-red-500 text-background text-sm font-mono tracking-wide rounded-md"
          >
            Sign Out
          </button>
        </section>

        <div className="col-span-7  p-4 bg-gray-100 rounded-md shadow text-sm">
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Recent Order</TabsTrigger>
              <TabsTrigger value="tab2">Referal Bonus</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">satu</TabsContent>
            <TabsContent value="tab2">dua</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;

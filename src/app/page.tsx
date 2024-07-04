"use client";
import { endOfDay, startOfDay, subDays } from "date-fns";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EngagementData, EngagementTotals } from "./api/engagements/route";

export default function Home() {
  const [totals, setTotals] = useState<EngagementTotals | null>(null);
  const [data, setData] = useState<EngagementData[] | null>(null);

  const searchParams = useSearchParams();
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");

  useEffect(() => {
    const endDate = end_date ? new Date(end_date) : endOfDay(new Date());
    const startDate = start_date
      ? new Date(start_date)
      : startOfDay(subDays(endDate, 30));

    const fetchData = async () => {
      const response = await fetch(
        `/api/engagements?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
      );
      const result = await response.json();
      setTotals(result.rangeTotal);
      setData(result.range);
    };

    fetchData();
  }, [start_date, end_date]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          API endpoint can be accessed at{" "}
          <code className="font-mono font-bold mx-2">/api/engagements</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://shieldapp.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-sm opacity-50">Powered by </span>
            <Image
              src="/shield.svg"
              alt="Shield Logo"
              width={25}
              height={25}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <div className="font-sans ml-2">
          {totals && data ? (
            <div className="p-4 border rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Engagement data</h2>
              <p>
                <span className="font-semibold">Total Impressions:</span>{" "}
                <span className="font-mono">{totals.numImpressions}</span>
              </p>
              <p>
                <span className="font-semibold">Total Views:</span>{" "}
                <span className="font-mono">{totals.numViews}</span>
              </p>
              <p>
                <span className="font-semibold">Total Reactions:</span>{" "}
                <span className="font-mono">{totals.numReactions}</span>
              </p>
              <p>
                <span className="font-semibold">Total Comments:</span>{" "}
                <span className="font-mono">{totals.numComments}</span>
              </p>
              <p>
                <span className="font-semibold">Total Shares:</span>{" "}
                <span className="font-mono">{totals.numShares}</span>
              </p>
              <p>
                <span className="font-semibold">Total Votes:</span>{" "}
                <span className="font-mono">{totals.numVotes}</span>
              </p>
              <p>
                <span className="font-semibold">Entity Count:</span>{" "}
                <span className="font-mono">{data.length}</span>
              </p>
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                <span className="font-mono">
                  {new Date(data[0].date).toISOString()}
                </span>
              </p>
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                <span className="font-mono">
                  {new Date(data[data.length - 1].date).toISOString()}
                </span>
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}

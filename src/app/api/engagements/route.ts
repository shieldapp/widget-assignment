import { NextRequest, NextResponse } from 'next/server';

export interface EngagementData {
    numImpressions: number;
    numViews: number;
    numReactions: number;
    numComments: number;
    numShares: number;
    numVotes: number;
    date: string;
    postsCount: number;
}

export interface EngagementTotals {
    numImpressions: number;
    numViews: number;
    numReactions: number;
    numComments: number;
    numShares: number;
    numVotes: number;
}

export interface EngagementResponse {
    range: EngagementData[];
    rangeTotal: EngagementTotals;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const url = new URL(request.url);
    const startDate = new Date(url.searchParams.get('start_date') as string);
    const endDate = new Date(url.searchParams.get('end_date') as string);

    const getRandomInt = (min: number, max: number): number =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const getRandomData = (startDate: Date, endDate: Date): EngagementResponse => {
        const data: EngagementData[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const numImpressions = Math.max(0, getRandomInt(-15000, 15000));
            const numViews = Math.max(0, getRandomInt(-15000, 15000));
            const numReactions = Math.max(0, getRandomInt(-500, 500));
            const numComments = Math.max(0, getRandomInt(-200, 200));
            const numShares = Math.max(0, getRandomInt(-50, 50));
            const numVotes = Math.max(0, getRandomInt(-100, 100));

            data.push({
                numImpressions,
                numViews,
                numReactions,
                numComments,
                numShares,
                numVotes,
                date: currentDate.toISOString(),
                postsCount: getRandomInt(0, 5),
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const rangeTotal = data.reduce(
            (totals, entry) => {
                totals.numImpressions += entry.numImpressions;
                totals.numViews += entry.numViews;
                totals.numReactions += entry.numReactions;
                totals.numComments += entry.numComments;
                totals.numShares += entry.numShares;
                totals.numVotes += entry.numVotes;
                return totals;
            },
            {
                numImpressions: 0,
                numViews: 0,
                numReactions: 0,
                numComments: 0,
                numShares: 0,
                numVotes: 0,
            }
        );

        return { range: data, rangeTotal };
    };

    const data = getRandomData(startDate, endDate);

    return NextResponse.json(data);
}
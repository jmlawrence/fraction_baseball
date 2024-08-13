'use client';

import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import useChatGPT from '@/hooks/useChatGPT';
import { Player } from '@/types/Player';
import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  // STATE
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState('');
  const [activePlayer, setActivePlayer] =
    useState<Player | null>(null);
  const [
    activePlayerDescription,
    setActivePlayerDescription,
  ] = useState('');

  // HOOKS
  const { askAI } = useChatGPT();

  const descriptionSkeletonRows = [...Array(15)];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/players');
      const result = (await response.json()) as Player[];
      setPlayers(result.sort((a, b) => a.id - b.id));
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activePlayer) {
      askAI(
        `Can you give me a paragraph about this baseball player: ${activePlayer.name}`
      ).then((resp) => {
        setActivePlayerDescription(resp);
      });
    } else {
      setActivePlayerDescription('');
    }
  }, [activePlayer, askAI]);

  const filteredPlayers = useMemo(() => {
    if (filter.trim().length > 0) {
      return players
        .filter((player) =>
          player.name
            .toLowerCase()
            .includes(filter.toLowerCase())
        )
        .slice(0, 9);
    }

    return players.slice(0, 9);
  }, [filter, players]);

  return (
    <>
      <Sheet
        open={Boolean(activePlayer)}
        onOpenChange={() => {
          setActivePlayerDescription('');
          setActivePlayer(null);
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{activePlayer?.name}</SheetTitle>
            <SheetDescription>
              {activePlayerDescription ? (
                activePlayerDescription
              ) : (
                <div className='flex flex-col gap-1'>
                  {descriptionSkeletonRows.map((_, idx) => (
                    <Skeleton
                      className='h-[15px] w-full rounded-xl'
                      key={idx}
                    />
                  ))}
                </div>
              )}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className='bg-gray-500 w-full h-dvh py-5 px-8 bg-[url("/assets/images/background.png")] bg-cover bg-center overflow-y-auto'>
        <div className='max-w-72 m-auto pb-8'>
          <Input
            placeholder='Filter'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className='grid lg:grid-cols-2 xl:grid-cols-3 m-auto gap-8 w-full max-w-4xl'>
          {filteredPlayers.map((player) => (
            <div
              className='rounded bg-white bg-gradient-to-r from-violet-500/50 to-fuchsia-500/50 cursor-pointer hover:shadow transition-all'
              key={player.id}
              onClick={() => {
                setActivePlayerDescription('');
                setActivePlayer(player);
              }}
            >
              <div className='bg-white p-3 rounded text-center'>
                <div className='font-semibold text-lg'>
                  {player.name}
                </div>
                <div className='grid grid-cols-3 m-w-64 gap-3'>
                  <div className=''>
                    <div className='font-bold text-sm'>
                      {player.yearsInTheLeague}
                    </div>
                    <div className='text-xs text-gray-400'>
                      YEARS IN LEAGUE
                    </div>
                  </div>
                  <div className=''>
                    <div className='font-bold text-sm'>
                      {player.age}
                    </div>
                    <div className='text-xs text-gray-400'>
                      AGE
                    </div>
                  </div>
                  <div className=''>
                    <div className='font-bold text-sm'>
                      {player.handedness}
                    </div>
                    <div className='text-xs text-gray-400'>
                      HANDED
                    </div>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-3 m-w-64 gap-3 py-6 px-3 text-center'>
                <div className='bg-white/20 text-white rounded'>
                  <div className='font-bold text-lg'>
                    {player.battingAverage}
                  </div>
                  <div className='text-xs '>
                    BATTING AVERAGE
                  </div>
                </div>
                <div className='bg-white/20 text-white rounded'>
                  <div className='font-bold text-lg'>
                    {player.hits}
                  </div>
                  <div className='text-xs '>HITS</div>
                </div>
                <div className='bg-white/20 text-white rounded'>
                  <div className='font-bold text-lg'>
                    {player.homeRuns}
                  </div>
                  <div className='text-xs '>HOME RUNS</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { InteractiveProps } from '../registry';
import RoomFitCompact from './RoomFitCompact';
import RoomFitInline from './RoomFitInline';
import RoomFitPlay from './RoomFitPlay';
import useBackDismiss from '@/hooks/useBackDismiss';
import useMediaQuery from '@/hooks/useMediaQuery';
import useRoomFitGame from './useRoomFitGame';

// "Compact" is anything narrower than the article's two-column layout (Tailwind's `lg`): a phone or a
// tablet held upright, where the plan and its checks would stack and the buttons end up a screen from the plan.
// (1023.98, not 1023: a fractional width such as 1023.5 px must land on one side or the other.)
const COMPACT_QUERY = '(max-width: 1023.98px)';


// "Can the room still work once everything fits?" — the article's question, playable. One game
// (useRoomFitGame) in three settings: side by side with its checks where the screen is wide, as a
// picture and one button where it is not, and full screen — the way a phone plays it, and anyone can
// choose — with the plan and its buttons together and nothing to scroll.
export default function RoomFit({ lang }: InteractiveProps) {
  const game = useRoomFitGame(lang);
  const compact = useMediaQuery(COMPACT_QUERY);
  const [playing, setPlaying] = useState(false);
  const leaving = useRef(false);
  // The room the game takes in the article, kept open while the dialog stands in for it.
  const [held, setHeld] = useState(0);

  // The button that opened the full-screen game is replaced while it is up: put focus on its successor.
  useEffect(() => {
    if (playing || !leaving.current) return;
    leaving.current = false;
    document.querySelector<HTMLElement>('[data-action="play-full-screen"]')?.focus();
  }, [playing]);

  // The Back gesture closes the game (the dialog has a history entry of its own) instead of leaving the article.
  const back = useBackDismiss(playing, () => {
    leaving.current = true;
    setPlaying(false);
  });

  if (playing) {
    return (
      <>
        {/* The game is not in the article while the dialog is up. Without this the page shrinks by the game's height and, on
            closing, the browser's scroll anchoring leaves the reader somewhere else in the article. */}
        <div aria-hidden="true" style={{ height: held }} />
        <RoomFitPlay
          game={game}
          lang={lang}
          onClose={back.leave}
        />
      </>
    );
  }
  const play = (event: MouseEvent<HTMLElement>) => {
    setHeld(event.currentTarget.closest<HTMLElement>('[data-testid="room-fit"]')?.offsetHeight ?? 0);
    back.enter();
    setPlaying(true);
  };
  return compact ? <RoomFitCompact game={game} lang={lang} onPlay={play} /> : <RoomFitInline game={game} lang={lang} onPlay={play} />;
}

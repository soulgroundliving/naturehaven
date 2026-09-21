import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { InteractiveProps } from '../registry';
import RoomFitCompact from './RoomFitCompact';
import RoomFitInline from './RoomFitInline';
import RoomFitPlay from './RoomFitPlay';
import useMediaQuery from './useMediaQuery';
import useRoomFitGame from './useRoomFitGame';

// "Compact" is anything narrower than the article's two-column layout (Tailwind's `lg`): a phone or a
// tablet held upright, where the plan and its checks would stack and the buttons end up a screen from the plan.
// (1023.98, not 1023: a fractional width such as 1023.5 px must land on one side or the other.)
const COMPACT_QUERY = '(max-width: 1023.98px)';

// The dialog gets a history entry of its own, so the Back gesture of a phone (Android's button, iOS's swipe)
// closes the game instead of leaving the article and losing it. Same URL, so the router sees no navigation.
const PLAY_ENTRY = 'roomFitPlay';

// "Can the room still work once everything fits?" — the article's question, playable. One game
// (useRoomFitGame) in three settings: side by side with its checks where the screen is wide, as a
// picture and one button where it is not, and full screen — the way a phone plays it, and anyone can
// choose — with the plan and its buttons together and nothing to scroll.
export default function RoomFit({ lang }: InteractiveProps) {
  const game = useRoomFitGame(lang);
  const compact = useMediaQuery(COMPACT_QUERY);
  const [playing, setPlaying] = useState(false);
  const leaving = useRef(false);
  const pushed = useRef(false);
  // The room the game takes in the article, kept open while the dialog stands in for it.
  const [held, setHeld] = useState(0);

  // The button that opened the full-screen game is replaced while it is up: put focus on its successor.
  useEffect(() => {
    if (playing || !leaving.current) return;
    leaving.current = false;
    document.querySelector<HTMLElement>('[data-action="play-full-screen"]')?.focus();
  }, [playing]);

  // Back pops the entry the dialog pushed: that is the game closing.
  useEffect(() => {
    if (!playing) return;
    const onBack = () => {
      pushed.current = false;
      leaving.current = true;
      setPlaying(false);
    };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, [playing]);

  if (playing) {
    return (
      <>
        {/* The game is not in the article while the dialog is up. Without this the page shrinks by the game's height and, on
            closing, the browser's scroll anchoring leaves the reader somewhere else in the article. */}
        <div aria-hidden="true" style={{ height: held }} />
        <RoomFitPlay
          game={game}
          lang={lang}
          onClose={() => {
            leaving.current = true;
            // Escape and the close button take the entry back off; the popstate above then closes the game.
            if (pushed.current && window.history.state?.[PLAY_ENTRY]) window.history.back();
            else setPlaying(false);
          }}
        />
      </>
    );
  }
  const play = (event: MouseEvent<HTMLElement>) => {
    setHeld(event.currentTarget.closest<HTMLElement>('[data-testid="room-fit"]')?.offsetHeight ?? 0);
    try {
      window.history.pushState({ [PLAY_ENTRY]: true }, '');
      pushed.current = true;
    } catch {
      pushed.current = false; // the game still opens; Back then leaves the article, as it would have
    }
    setPlaying(true);
  };
  return compact ? <RoomFitCompact game={game} lang={lang} onPlay={play} /> : <RoomFitInline game={game} lang={lang} onPlay={play} />;
}

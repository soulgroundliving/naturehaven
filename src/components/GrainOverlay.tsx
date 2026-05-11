export default function GrainOverlay() {
  return (
    <>
      <style>{`
        @keyframes nh-grain{
          0%,100%{transform:translate(0,0)}
          10%{transform:translate(-2%,-3%)}
          20%{transform:translate(3%,2%)}
          30%{transform:translate(-1%,4%)}
          40%{transform:translate(2%,-1%)}
          50%{transform:translate(-3%,3%)}
          60%{transform:translate(1%,-4%)}
          70%{transform:translate(-2%,2%)}
          80%{transform:translate(3%,-2%)}
          90%{transform:translate(-1%,1%)}
        }
        .nh-grain-anim{animation:nh-grain 0.4s steps(1) infinite}
      `}</style>
      <div
        className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden"
        style={{ opacity: 0.038, mixBlendMode: 'overlay' }}
        aria-hidden="true"
      >
        <svg
          className="nh-grain-anim"
          width="120%"
          height="120%"
          style={{ position: 'absolute', top: '-10%', left: '-10%' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="nh-grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#nh-grain-filter)" />
        </svg>
      </div>
    </>
  );
}

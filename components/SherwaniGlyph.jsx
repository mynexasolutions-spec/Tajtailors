export default function SherwaniGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 200 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sherwaniGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a97c2f" />
          <stop offset="45%" stopColor="#f1d989" />
          <stop offset="100%" stopColor="#caa14b" />
        </linearGradient>
      </defs>

      {/* Collar */}
      <path d="M78 30 L100 48 L122 30" stroke="url(#sherwaniGold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Coat body */}
      <path
        d="M100 48 L60 70 L46 130 L52 260 Q52 272 64 272 L136 272 Q148 272 148 260 L154 130 L140 70 Z"
        stroke="url(#sherwaniGold)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Shoulders / sleeves */}
      <path d="M60 70 L30 110 L36 175" stroke="url(#sherwaniGold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      <path d="M140 70 L170 110 L164 175" stroke="url(#sherwaniGold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

      {/* Front placket */}
      <line x1="100" y1="52" x2="100" y2="270" stroke="url(#sherwaniGold)" strokeWidth="1.5" opacity="0.5" />

      {/* Buttons */}
      {[80, 108, 136, 164, 192, 220].map((y) => (
        <circle key={y} cx="100" cy={y} r="2.5" fill="url(#sherwaniGold)" opacity="0.85" />
      ))}

      {/* Draped measuring tape */}
      <path
        d="M42 96 Q100 130 158 96"
        stroke="url(#sherwaniGold)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M42 96 Q100 130 158 96"
        stroke="url(#sherwaniGold)"
        strokeWidth="1"
        strokeDasharray="4 5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

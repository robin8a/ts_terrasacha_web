interface SocialLinksProps {
  className?: string;
  iconSize?: string;
}

export default function SocialLinks({ className = '', iconSize = 'w-5 h-5' }: SocialLinksProps) {
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      <li>
        <a
          href="https://www.instagram.com/holaterrasacha"
          target="_blank"
          rel="noreferrer"
          className="text-gray-700 hover:text-primary transition-colors"
          aria-label="Instagram"
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.55,1H6.46C3.45,1,1,3.44,1,6.44v7.12c0,3,2.45,5.44,5.46,5.44h7.08c3.02,0,5.46-2.44,5.46-5.44V6.44 C19.01,3.44,16.56,1,13.55,1z M17.5,14c0,1.93-1.57,3.5-3.5,3.5H6c-1.93,0-3.5-1.57-3.5-3.5V6c0-1.93,1.57-3.5,3.5-3.5h8 c1.93,0,3.5,1.57,3.5,3.5V14z" />
            <circle cx="14.87" cy="5.26" r="1.09" />
            <path d="M10.03,5.45c-2.55,0-4.63,2.06-4.63,4.6c0,2.55,2.07,4.61,4.63,4.61c2.56,0,4.63-2.061,4.63-4.61 C14.65,7.51,12.58,5.45,10.03,5.45L10.03,5.45L10.03,5.45z M10.08,13c-1.66,0-3-1.34-3-2.99c0-1.65,1.34-2.99,3-2.99s3,1.34,3,2.99 C13.08,11.66,11.74,13,10.08,13L10.08,13L10.08,13z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href="https://web.facebook.com/holaterrasacha"
          target="_blank"
          rel="noreferrer"
          className="text-gray-700 hover:text-primary transition-colors"
          aria-label="Facebook"
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
            <path d="M11,10h2.6l0.4-3H11V5.3c0-0.9,0.2-1.5,1.5-1.5H14V1.1c-0.3,0-1-0.1-2.1-0.1C9.6,1,8,2.4,8,5v2H5.5v3H8v8h3V10z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href="https://www.tiktok.com/@holaterrasacha"
          target="_blank"
          rel="noreferrer"
          className="text-gray-700 hover:text-primary transition-colors"
          aria-label="TikTok"
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.24,6V8.82a6.79,6.79,0,0,1-4-1.28v5.81A5.26,5.26,0,1,1,8,8.1a4.36,4.36,0,0,1,.72.05v2.9A2.57,2.57,0,0,0,7.64,11a2.4,2.4,0,1,0,2.77,2.38V2h2.86a4,4,0,0,0,1.84,3.38A4,4,0,0,0,17.24,6Z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href="https://www.youtube.com/@TERRASACHA1"
          target="_blank"
          rel="noreferrer"
          className="text-gray-700 hover:text-primary transition-colors"
          aria-label="YouTube"
        >
          <svg className={iconSize} fill="currentColor" viewBox="0 0 20 20">
            <path d="M15,4.1c1,0.1,2.3,0,3,0.8c0.8,0.8,0.9,2.1,0.9,3.1C19,9.2,19,10.9,19,12c-0.1,1.1,0,2.4-0.5,3.4c-0.5,1.1-1.4,1.5-2.5,1.6 c-1.2,0.1-8.6,0.1-11,0c-1.1-0.1-2.4-0.1-3.2-1c-0.7-0.8-0.7-2-0.8-3C1,11.8,1,10.1,1,8.9c0-1.1,0-2.4,0.5-3.4C2,4.5,3,4.3,4.1,4.2 C5.3,4.1,12.6,4,15,4.1z M8,7.5v6l5.5-3L8,7.5z" />
          </svg>
        </a>
      </li>
    </ul>
  );
}


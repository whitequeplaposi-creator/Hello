export function VisaIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#1434CB"/>
      <path d="M20.5 11.5L18.2 20.5H15.8L14.5 14.2C14.4 13.8 14.3 13.6 14 13.4C13.5 13.1 12.7 12.8 12 12.6L12.1 12.3H16.3C16.8 12.3 17.2 12.6 17.3 13.2L18.1 17.8L20.1 12.3H22.5L20.5 11.5ZM23.5 20.5H21.2L23 12.3H25.3L23.5 20.5ZM30.5 14.8C30.5 15.3 30.1 15.6 29.4 16C28.7 16.3 28.3 16.5 28.3 16.9C28.3 17.2 28.6 17.4 29.2 17.4C29.9 17.4 30.5 17.2 31 17L31.3 18.8C30.8 19 30.1 19.2 29.2 19.2C27 19.2 25.5 18.1 25.5 16.5C25.5 15.3 26.6 14.4 27.7 13.9C28.8 13.4 29.2 13.1 29.2 12.6C29.2 12.2 28.7 11.9 28 11.9C27.2 11.9 26.4 12.1 25.7 12.5L25.4 10.7C26.2 10.4 27.1 10.2 28 10.2C30.4 10.2 31.8 11.3 31.8 13C31.8 13.5 31.5 14 30.5 14.8ZM38 20.5H36L34.5 12.3H32.5L30 20.5H27.6L30.1 12.3C30.2 11.8 30.6 11.5 31.1 11.5H34.2C34.6 11.5 34.9 11.8 35 12.2L35.5 14.8L37.5 12.3H40L38 20.5Z" fill="white"/>
    </svg>
  )
}

export function MastercardIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#EB001B"/>
      <circle cx="18" cy="16" r="9" fill="#FF5F00"/>
      <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
      <path d="M24 9.5C22.3 10.9 21.2 13 21.2 15.4C21.2 17.8 22.3 19.9 24 21.3C25.7 19.9 26.8 17.8 26.8 15.4C26.8 13 25.7 10.9 24 9.5Z" fill="#FF5F00"/>
    </svg>
  )
}

export function AmexIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#006FCF"/>
      <path d="M12 12H15L16.5 15L18 12H21V20H18.5V14.5L16.5 18H15.5L13.5 14.5V20H12V12Z" fill="white"/>
      <path d="M22 12H28V14H24.5V15H27.5V17H24.5V18H28V20H22V12Z" fill="white"/>
      <path d="M29 12H32L33.5 15L35 12H38V20H35.5V14.5L33.5 18H32.5L30.5 14.5V20H29V12Z" fill="white"/>
    </svg>
  )
}

export function KlarnaIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#FFB3C7"/>
      <path d="M12 10H14.5V22H12V10ZM16 10H18.5V15.5L22.5 10H25.5L20.5 16.5L25.5 22H22.5L18.5 17V22H16V10ZM27 10H29.5V22H27V10Z" fill="#000000"/>
    </svg>
  )
}

export function SwishIcon({ className = "w-10 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="4" fill="#FFF"/>
      <rect width="48" height="32" rx="4" stroke="#E5E5E5"/>
      <path d="M18 12C18 10.9 18.9 10 20 10H28C29.1 10 30 10.9 30 12V20C30 21.1 29.1 22 28 22H20C18.9 22 18 21.1 18 20V12Z" fill="#FF5C00"/>
      <path d="M22 14L26 18M26 14L22 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const FeatherIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M20.2 3.8C14 3.6 7.6 7.4 6 14.6l-.6 2.8" />
    <path d="M20.2 3.8c.6 6.6-3.6 12.6-11.4 13.4" />
    <path d="M15.6 8.4 4 20" />
    <path d="M10.4 13.6h4.4M12.8 11h3.8" />
  </svg>
);

export const LotusIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 19c-2.6-2.1-3.8-4.6-3.8-7.2 0-2.4 1.4-4.8 3.8-6.8 2.4 2 3.8 4.4 3.8 6.8 0 2.6-1.2 5.1-3.8 7.2Z" />
    <path d="M12 19c-3.6.2-7-1.4-9-4.8 2.4-.8 4.4-.6 6.2.2" />
    <path d="M12 19c3.6.2 7-1.4 9-4.8-2.4-.8-4.4-.6-6.2.2" />
    <path d="M7 21h10" />
  </svg>
);

export const HeartIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 20s-7.5-4.6-7.5-10.4A4.1 4.1 0 0 1 12 7.2a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />
    <path d="M18.5 2.5v3M17 4h3" />
  </svg>
);

export const SparkleIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M11 3.5 12.7 8l4.8 1.8-4.8 1.8L11 16.2l-1.7-4.6L4.5 9.8 9.3 8 11 3.5Z" />
    <path d="M18 14.5l.8 2.2 2.2.8-2.2.8L18 20.5l-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </svg>
);

export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </svg>
);

export const UploadIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 15.5V4M7.5 8.5 12 4l4.5 4.5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
  </svg>
);

export const WhatsAppIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20Z" />
    <path d="M9.2 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5v.5c0 .3-.2.7-.5.8-.6.3-1.4.4-2.3.1-2.2-.8-4-2.6-4.8-4.8-.3-.9-.2-1.7.1-2.3Z" />
  </svg>
);

export const BagIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" />
    <path d="M9 10.5V6.8a3 3 0 0 1 6 0v3.7" />
  </svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4.5 7h15M10 4h4M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5" />
  </svg>
);

export const EyeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M10.6 5.6A9.9 9.9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 18.5 12 18.5c1.9 0 3.5-.6 4.9-1.5" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </svg>
);

export const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

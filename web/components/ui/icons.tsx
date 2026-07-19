import { IconSvgProps } from "@/types";

export const LogoIcon: React.FC<IconSvgProps> = ({
  size = 20,
  width,
  height,
  ...props
}) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="500" height="500" rx="140" fill="url(#paint0_radial_1_31)" />
    <path
      d="M374.696 79V176.714M374.696 176.714L423.554 127.857M374.696 176.714L325.839 127.857"
      stroke="white"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M337.538 259.953C333.316 276.015 313.343 287.364 273.385 310.064C234.755 332.011 215.44 342.978 199.88 338.576C193.431 336.748 187.564 333.283 182.849 328.518C171.416 316.977 171.416 294.6 171.416 249.835C171.416 205.069 171.416 182.692 182.849 171.151C187.565 166.39 193.432 162.929 199.88 161.105C215.44 156.68 234.755 167.659 273.385 189.605C313.331 212.305 333.316 223.655 337.55 239.717C339.308 246.347 339.308 253.322 337.55 259.953"
      stroke="white"
      strokeWidth="13"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M413.345 212.774C421.427 249.007 417.498 286.887 402.151 320.69C386.804 354.493 360.873 382.384 328.276 400.149C295.679 417.915 258.185 424.589 221.46 419.164C184.735 413.74 150.772 396.511 124.702 370.08C98.6331 343.65 81.8731 309.454 76.9543 272.657C72.0355 235.86 79.225 198.462 97.4369 166.113C115.649 133.763 143.894 108.218 177.905 93.3379C211.916 78.4576 249.846 75.0497 285.965 83.6292"
      stroke="white"
      strokeWidth="15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <radialGradient
        id="paint0_radial_1_31"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(250 250) rotate(180) scale(250)"
      >
        <stop stopColor="rgb(var(--primary-light))" />
        <stop offset="1" stopColor="rgb(var(--primary))" />
      </radialGradient>
    </defs>
  </svg>
);

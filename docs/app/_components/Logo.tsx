import Image from "next/image";

export function Logo() {
  return (
    <>
      <Image
        src="/logo/userbase_logo_white.svg"
        alt="userbase logo"
        width={110}
        height={24}
        className="hidden dark:block pl-1.5"
        priority
      />
      <Image
        src="/logo/userbase_logo_black.svg"
        alt="userbase logo"
        width={110}
        height={24}
        className="block dark:hidden pl-1.5"
        priority
      />
    </>
  );
}

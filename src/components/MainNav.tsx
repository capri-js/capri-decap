import { Settings } from "../collections/types";

type MainNavProps = {
  mainNav: Settings["mainNav"];
};

export function MainNav({ mainNav }: MainNavProps) {
  return (
    <nav className="flex items-center justify-between mb-8">
      <a href="/" className="text-xl font-semibold">
        Capri
      </a>
      <div className="flex gap-8">
        {mainNav.map(({ href, title }) => (
          <a
            key={href}
            href={href}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {title}
          </a>
        ))}
      </div>
    </nav>
  );
}

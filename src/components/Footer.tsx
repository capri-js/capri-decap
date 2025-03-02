import { Settings } from "../collections/types";
import { Container } from "./Container";

type FooterProps = Omit<Settings, "mainNav">;

export function Footer({ copyright, email }: FooterProps) {
  return (
    <footer className="bg-gray-200 border-t py-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600">{copyright}</div>
          <a
            href={`mailto:${email}`}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {email}
          </a>
        </div>
      </Container>
    </footer>
  );
}

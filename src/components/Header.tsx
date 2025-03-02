import { memo } from "react";
import { MainNav } from "./MainNav";
import { Settings } from "../collections/types";
import { Container } from "./Container";

type HeaderProps = {
  mainNav: Settings["mainNav"];
  children?: React.ReactNode;
};

export const Header = memo(function Header({ mainNav, children }: HeaderProps) {
  return (
    <header className="bg-white border-b pt-8 pb-16">
      <Container>
        <MainNav mainNav={mainNav} />
        {children}
      </Container>
    </header>
  );
});

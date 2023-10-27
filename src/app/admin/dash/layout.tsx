import { Button } from 'components/ui/button';
import { Menubar, MenubarMenu, MenubarTrigger } from 'components/ui/menubar';
import { Separator } from 'components/ui/separator';
import { User } from 'lucide-react';

import { MenuContent } from './menu-content';
import { Logo } from 'assets/logo';
import Link from 'next/link';

const DashLayout: BTypes.NLPage<{}, true> = async ({ children }) => {
  return (
    <>
      <header className="px-6 py-3 flex items-center justify-between border-b max-xs:flex-col">
        <Link href="/">
          <span className="sr-only">Deal Empreendimentos</span>
          <Logo aria-hidden className="fill-blue h-14 w-auto" />
        </Link>

        <div className="flex items-center gap-4 max-xs:mt-4">
          <Link
            href="/admin/dash"
            className="text-muted-foreground hover:underline underline-offset-2"
          >
            Home
          </Link>
          <Link
            href="/admin/dash/enterprises"
            className="text-muted-foreground hover:underline underline-offset-2"
          >
            Empreendimentos
          </Link>

          <Separator orientation="vertical" className="h-6" />

          <Menubar>
            <MenubarMenu>
              <MenubarTrigger
                asChild
                className="cursor-pointer"
                aria-label="Menu usuário"
              >
                <Button className="!p-2 !bg-transparent" variant="ghost">
                  <span className="sr-only">Menu</span>
                  <User className="w-4 h-4" aria-hidden />
                </Button>
              </MenubarTrigger>
              <MenuContent />
            </MenubarMenu>
          </Menubar>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default DashLayout;

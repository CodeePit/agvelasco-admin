'use client';
import { EnterpriseCard as EnterpriseDefaultCard } from 'components/enterprise-card';

import { type EnterprisePartial } from 'types/enterprise';
import { Pencil, Trash } from 'lucide-react';
import { deleteEnterprise } from 'utils/enterprises-func';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'components/ui/button';
import { useState } from 'react';
import { cn } from 'utils/cn';

interface EnterpriseCardProps {
  enterprise: EnterprisePartial;
  aspectRatio?: 'portrait' | 'square';
}

export const EnterpriseCard = ({
  enterprise,
  aspectRatio = 'portrait',
  ...props
}: EnterpriseCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div
      className={cn('relative', {
        'pointer-events-none opacity-60 animate-pulse cursor-progress': loading,
      })}
      {...props}
    >
      <div className="flex absolute z-10 w-full bg-primary/90 space-x-4 p-2 justify-between">
        <Button asChild>
          <Link href={`/admin/dash/enterprises/${enterprise.id}`}>
            <span className="block">Editar</span>
            <Pencil className="w-4 h-4 ml-4" />
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            setLoading(true);
            deleteEnterprise(`${enterprise.id}`, enterprise.imagesIds)
              .then(() => {
                router.refresh();
                toast.success('Empreendimento deletado com sucesso!');
              })
              .catch(() =>
                toast.error(
                  'Ocorreu um erro ao deletar o empreendimento! Tente novamente mais tarde.',
                ),
              )
              .finally(() => setLoading(false));
          }}
        >
          <span className="block">Deletar</span>
          <Trash className="w-4 h-4 ml-4" />
        </Button>
      </div>
      <EnterpriseDefaultCard
        enterprise={enterprise}
        className="max-w-full w-full"
        href={`/admin/dash/enterprises/${enterprise.id}`}
      />
    </div>
  );
};

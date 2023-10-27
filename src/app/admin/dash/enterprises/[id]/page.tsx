import { notFound } from 'next/navigation';
import { EnterpriseForm } from './enterprise-form';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { getEnterprise, getEnterprisesId } from 'utils/enterprises-func';

export const dynamicParams = false;

export async function generateStaticParams() {
  const enterprises = await getEnterprisesId();
  return [{ id: 'create' }, ...(enterprises || [])];
}

const Enterprise: BTypes.NPage<{ params: { id: string } }, true> = async ({ params }) => {
  let enterprise = undefined;

  if (params.id !== 'create') enterprise = await getEnterprise(params.id);
  if (params.id !== 'create' && !enterprise) return notFound();

  return (
    <>
      <section className="max-w-7xl mx-auto mt-8 px-8">
        <Link
          href="/admin/dash/enterprises"
          className="flex items-center hover:underline underline-offset-2"
        >
          <MoveLeft className="h-6 w-auto mr-4" />
          Voltar
        </Link>
      </section>

      <EnterpriseForm id={params.id} enterprise={enterprise as any} />
    </>
  );
};

export default Enterprise;

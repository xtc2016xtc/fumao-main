'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User } from '@/constants/data';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DELETE_PRODUCT_MUTATION } from '@/graphql/good/mutations';
import { PRODUCT_QUERY } from '@/graphql/good/queries';
import { useMutation } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';
import {getRandomString} from '@/lib/utils';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const onConfirm = async (): Promise<void> => {
    // setLoading(true);
    await handleDeleteProduct();
    setOpen(false);
    // setLoading(false);
  };

  const [deleteProduct, {loading, error}] = useMutation(DELETE_PRODUCT_MUTATION);

  const handleDeleteProduct = () => {
    deleteProduct({
      variables: {
        ids: [data.id]
      },
    }).then(()=>{
      toast({
        title: '删除成功！',
        description: 'success',
      });
      const newRouterPath = getRandomString();
      router.push(searchParams.get('page') ? `/dashboard/good?${newRouterPath}&page=${searchParams.get('page')}&limit=${searchParams.get('limit')}` : `/dashboard/good?${newRouterPath}`);

    }).catch(error => {
      // 处理错误
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error
      });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>操作</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/good/${data.id}?${getRandomString()}&update=${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> 更新
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> 删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

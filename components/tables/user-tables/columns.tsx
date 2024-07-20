'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { gql } from '@apollo/client';
import ActiveSwitchCell from '@/components/ActiveSwitchCell';

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'imageUrl',
    header: '商品主图',
    cell: ({ row }) => (
      <div className="flex w-full min-w-[150px] max-w-[200px] text-center md:w-4/5 lg:w-1/2">
        <img
          className="mr-3 max-w-[80px] max-h-[80px] rounded object-cover"
          src={row?.original.imageUrl}
          alt=""
          loading="lazy"
        />
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: '商品',
    cell: ({ row }) => (
      <div className="flex w-full min-w-[150px] max-w-[200px] text-left md:w-4/5 lg:w-1/2">
        <div >
          <p>{row?.original.name}</p>
          <div>
            <span className="text-rose-500">￥{row?.original.base_price}</span>
          </div>
          <div>
            分类：
            <span style={{ display: 'inline-block' }}>
              <p className="mb-1 text-xs text-gray-400">
                {row.original.category ? row.original.category : '未分类'}
              </p>
            </span>
          </div>
        </div>
      </div>
    )
  },
  {
    accessorKey: 'description',
    header: '描述'
  },
  {
    accessorKey: 'options',
    header: '规格',
  },
  {
    accessorKey: 'weight',
    header: '重量(g)',
  },
  {
    accessorKey: 'is_active',
    header: '显示',
    cell: ({ row, getValue }) => (
      <ActiveSwitchCell value={getValue() as boolean} rowId={row.original.id} />
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

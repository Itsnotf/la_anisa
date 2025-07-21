'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page: string;
    canCreate: boolean;
}

export function DataTable<TData, TValue>({ columns, data, page, canCreate }: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const currentRows = table.getRowModel().rows.length;
    const emptyRows = pagination.pageSize - currentRows;

    return (
        <div className="rounded-md border bg-white dark:bg-transparent">
            <div className="flex items-center justify-between p-4">
                <Input
                    type="text"
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-64 border p-2"
                />
                {canCreate && (
                    <Link href={`/${page}/create`}>
                        <Button className="bg-primary">Create {page.charAt(0).toUpperCase() + page.slice(1)}</Button>
                    </Link>
                )}
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    <div className="flex cursor-pointer items-center px-2" onClick={() => header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell className="px-4" key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}

                    {emptyRows > 0 &&
                        Array.from({ length: emptyRows }).map((_, index) => (
                            <TableRow key={`empty-${index}`} className="h-[49px]">
                                {columns.map((_, colIndex) => (
                                    <TableCell key={`empty-cell-${index}-${colIndex}`}>&nbsp;</TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {table.getRowModel().rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="py-8 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="mt-1 flex flex-row-reverse items-center justify-between px-4 py-2">
                <div className="flex gap-2">
                    <Button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        variant="outline"
                        size="sm"
                        title="First Page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        variant="outline"
                        size="sm"
                        title="Previous Page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant="outline" size="sm" title="Next Page">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        variant="outline"
                        size="sm"
                        title="Last Page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="text-muted-foreground text-sm">
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </div>
            </div>
        </div>
    );
}

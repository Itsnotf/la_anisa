"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  roles: {
    name: string;
  }[];
}

export const UserColumns = (canEdit: boolean, canDelete: boolean, onDelete: (id: number) => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles.map((role, index) => (
          <Badge key={index} variant="outline">
            {role.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex space-x-2">
          {canEdit && (
            <Link href={`/user/${user.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(user.id)}>
              <Trash className="w-4 h-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];

"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminAuditLogQuery } from "@/hooks/use-admin-audit-log";

function formatActionLabel(action: string): string {
  return action.replaceAll("_", " ");
}

export function AuditLogTable() {
  const { data: entries, isLoading, isError } = useAdminAuditLogQuery();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          A reverse-chronological record of administrative actions taken across the store.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading audit log...</p>}
      {isError && <p className="text-sm text-destructive">Failed to load audit log.</p>}

      {entries && (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No audit log entries yet.
                  </TableCell>
                </TableRow>
              )}
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(entry.occurredAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{entry.actorName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{formatActionLabel(entry.action)}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.entityType} · {entry.entityId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

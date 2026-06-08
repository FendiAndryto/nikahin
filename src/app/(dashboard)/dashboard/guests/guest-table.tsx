"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Search,
  MoreHorizontal,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { GuestFormDialog } from "@/components/forms/guest-form";
import { deleteGuest, deleteMultipleGuests } from "./actions";
import type { Guest } from "@/types/guest";

interface GuestTableProps {
  guests: Guest[];
  weddingId: string;
  weddingSlug: string;
}

export function GuestTable({ guests, weddingId, weddingSlug }: GuestTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Filter guests by search
  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phone_number && g.phone_number.includes(searchQuery))
  );

  // Selection helpers
  const allSelected =
    filteredGuests.length > 0 &&
    filteredGuests.every((g) => selectedIds.has(g.id));

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGuests.map((g) => g.id)));
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  // Actions
  function handleEdit(guest: Guest) {
    setEditingGuest(guest);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditingGuest(null);
    setFormOpen(true);
  }

  function handleDeleteClick(guest: Guest) {
    setDeletingGuest(guest);
    setDeleteDialogOpen(true);
  }

  function handleDelete() {
    if (!deletingGuest) return;
    startTransition(async () => {
      const result = await deleteGuest(deletingGuest.id, weddingId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Tamu berhasil dihapus");
        setDeleteDialogOpen(false);
        setDeletingGuest(null);
        router.refresh();
      }
    });
  }

  function handleBulkDelete() {
    startTransition(async () => {
      const result = await deleteMultipleGuests(
        Array.from(selectedIds),
        weddingId
      );
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`${selectedIds.size} tamu berhasil dihapus`);
        setBulkDeleteOpen(false);
        setSelectedIds(new Set());
        router.refresh();
      }
    });
  }

  function copyLink(guestSlug: string) {
    const link = `${window.location.origin}/${weddingSlug}?to=${guestSlug}`;
    navigator.clipboard.writeText(link);
    toast.success("Link berhasil disalin!");
  }

  function getAttendanceBadge(isAttending: boolean | null) {
    if (isAttending === true) {
      return (
        <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
          <CheckCircle2 className="h-3 w-3" />
          Hadir
        </Badge>
      );
    }
    if (isAttending === false) {
      return (
        <Badge className="gap-1 bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
          <XCircle className="h-3 w-3" />
          Tidak Hadir
        </Badge>
      );
    }
    return (
      <Badge className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">
        <Clock className="h-3 w-3" />
        Menunggu
      </Badge>
    );
  }

  // Stats
  const totalGuests = guests.length;
  const attending = guests.filter((g) => g.is_attending === true).length;
  const declined = guests.filter((g) => g.is_attending === false).length;
  const pending = guests.filter((g) => g.is_attending === null).length;
  const totalCompanions = guests.reduce((sum, g) => sum + g.companion_count, 0);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm">
          <p className="text-2xl font-bold">{totalGuests}</p>
          <p className="text-xs text-muted-foreground">Total Tamu</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-2xl font-bold text-emerald-600">{attending}</p>
          <p className="text-xs text-muted-foreground">Hadir</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-2xl font-bold text-red-600">{declined}</p>
          <p className="text-xs text-muted-foreground">Tidak Hadir</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-xs text-muted-foreground">Menunggu</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari tamu..."
            className="pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus ({selectedIds.size})
            </Button>
          )}
          <Button
            onClick={handleAdd}
            className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-md shadow-pink-500/20"
          >
            <Plus className="h-4 w-4" />
            Tambah Tamu
          </Button>
        </div>
      </div>

      {/* Table */}
      {filteredGuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10">
            <Users className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-semibold">
            {searchQuery ? "Tamu tidak ditemukan" : "Belum ada tamu"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {searchQuery
              ? "Coba ubah kata kunci pencarian Anda."
              : "Tambahkan tamu undangan untuk membagikan link personalisasi."}
          </p>
          {!searchQuery && (
            <Button
              onClick={handleAdd}
              className="mt-6 gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0"
            >
              <Plus className="h-4 w-4" />
              Tambah Tamu Pertama
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden sm:table-cell">Link</TableHead>
                <TableHead className="hidden md:table-cell">Telepon</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  Pendamping
                </TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredGuests.map((guest, i) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="group border-b border-border/40 last:border-0 hover:bg-muted/30"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(guest.id)}
                        onCheckedChange={() => toggleSelect(guest.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <button
                        onClick={() => copyLink(guest.slug)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="truncate max-w-[160px]">
                          ?to={guest.slug}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {guest.phone_number || "—"}
                    </TableCell>
                    <TableCell>{getAttendanceBadge(guest.is_attending)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      {guest.companion_count > 0 ? (
                        <Badge variant="outline">{guest.companion_count}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            />
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyLink(guest.slug)}>
                            <LinkIcon className="mr-2 h-3.5 w-3.5" />
                            Salin Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(guest)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(guest)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          {/* Table footer - companion total */}
          {totalCompanions > 0 && (
            <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <span>
                Total undangan: <strong className="text-foreground">{totalGuests + totalCompanions}</strong> orang (termasuk {totalCompanions} pendamping)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <GuestFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        weddingId={weddingId}
        weddingSlug={weddingSlug}
        guest={editingGuest}
        onSuccess={() => router.refresh()}
      />

      {/* Single Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Tamu?</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-foreground">
                {deletingGuest?.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus {selectedIds.size} Tamu?</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus {selectedIds.size} tamu yang dipilih?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                `Ya, Hapus ${selectedIds.size} Tamu`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

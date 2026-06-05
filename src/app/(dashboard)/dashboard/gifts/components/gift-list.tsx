"use client";

import { useState } from "react";
import { Plus, Building, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GiftForm } from "./gift-form";
import { deleteGiftAccount } from "../actions";

interface GiftAccount {
  id: string;
  wedding_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  qris_url: string | null;
}

interface GiftListProps {
  giftAccounts: GiftAccount[];
  weddingId: string;
}

export function GiftList({ giftAccounts, weddingId }: GiftListProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete(id: string) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus akun ini?")) return;

    const result = await deleteGiftAccount(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Akun berhasil dihapus");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-pink-500 hover:bg-pink-600" />}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Rekening
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Rekening / QRIS</DialogTitle>
              <DialogDescription>
                Masukkan detail rekening bank atau dompet digital Anda.
              </DialogDescription>
            </DialogHeader>
            <GiftForm weddingId={weddingId} onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {giftAccounts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Building className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">Belum ada akun bank</h3>
            <p className="text-sm text-muted-foreground">
              Tambahkan akun bank atau dompet digital agar tamu dapat mengirimkan hadiah digital.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {giftAccounts.map((account) => (
            <Card key={account.id} className="relative overflow-hidden group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="font-bold">{account.bank_name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    onClick={() => handleDelete(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className="text-foreground font-medium text-lg tracking-wider">
                  {account.account_number}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  A.N. {account.account_name}
                </p>
                {account.qris_url && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">QRIS Tersedia</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={account.qris_url} 
                      alt="QRIS" 
                      className="h-24 w-24 object-cover rounded-md border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

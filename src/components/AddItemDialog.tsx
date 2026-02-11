import { useEffect, useMemo, useState } from "react";
import type { LocationKey, GMKItem } from "@/lib/gmk-storage";
import { uid, normaliseName } from "@/lib/gmk-storage";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultLocation: LocationKey;
  onCreate: (item: GMKItem) => void;
};

const UNIT_PRESETS = ["", "eggs", "rashers", "rolls", "packs", "bottles", "cans", "jars", "bags"];

export default function AddItemDialog({ open, onOpenChange, defaultLocation, onCreate }: Props) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState<string>("1");
  const [unit, setUnit] = useState("");
  const [expiry, setExpiry] = useState(""); // YYYY-MM-DD
  const [location, setLocation] = useState<LocationKey>(defaultLocation);

  useEffect(() => {
    if (!open) return;
    setName("");
    setQty("1");
    setUnit("");
    setExpiry("");
    setLocation(defaultLocation);
  }, [open, defaultLocation]);

  const qtyNum = useMemo(() => {
    const n = Number(qty);
    if (!Number.isFinite(n) || n <= 0) return 1;
    return Math.floor(n);
  }, [qty]);

  const canSave = normaliseName(name).length > 0;

  function save() {
    const cleanName = normaliseName(name);
    if (!cleanName) return;

    const item: GMKItem = {
      id: uid(),
      name: cleanName,
      location,
      quantity: qtyNum,
      unit: unit.trim() ? unit.trim() : undefined,
      expiry: expiry.trim() ? expiry.trim() : undefined,
      addedAt: Date.now(),
    };

    onCreate(item);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="gmk-h1 text-2xl">Add item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Item name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eggs"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-semibold">Quantity</label>
              <Input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                inputMode="numeric"
                placeholder="1"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Unit (optional)</label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="eggs / rolls / packs"
                list="gmk-units"
              />
              <datalist id="gmk-units">
                {UNIT_PRESETS.filter(Boolean).map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-sm font-semibold">Expiry (optional)</label>
              <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} type="date" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Location</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["cupboard", "fridge", "freezer"] as LocationKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  className="gmk-tab"
                  aria-selected={location === k}
                  onClick={() => setLocation(k)}
                >
                  {k === "cupboard" ? "Cupboard" : k === "fridge" ? "Fridge" : "Freezer"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!canSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

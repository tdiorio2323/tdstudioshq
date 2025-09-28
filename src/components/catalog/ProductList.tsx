import { OptimizedImage } from "@/components/ui/optimized-image";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
};

export default function ProductList({
  items,
  onAdd
}: {
  items: Product[];
  onAdd: (p: Product) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(p => (
        <div key={p.id} className="rounded-xl border p-4">
          <OptimizedImage
            src={p.image}
            alt={p.name}
            width={640}
            height={640}
            className="w-full h-auto"
          />
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-white/60">${p.price.toFixed(2)}</div>
              {p.badge && (
                <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded mt-1 inline-block">
                  {p.badge}
                </div>
              )}
            </div>
            <button
              onClick={() => onAdd(p)}
              className="rounded-lg px-3 py-2 bg-white/10 hover:bg-white/15 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
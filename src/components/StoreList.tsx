// components/StoreList.tsx
import Link from "next/link";
import type { StoreData } from "@/types/store";

interface StoreListProps {
  stores: StoreData[];
  selectedLetter?: string; // optional search/filter
}

export default function StoreList({ stores, selectedLetter = "" }: StoreListProps) {
  // Filter stores by selected letter
  const filteredStores = selectedLetter
    ? selectedLetter === "0-9"
      ? stores.filter((store) => /^\d/.test(store.name || ""))
      : stores.filter((store) =>
          (store.name || "").toLowerCase().startsWith(selectedLetter.toLowerCase())
        )
    : stores;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {selectedLetter
            ? selectedLetter === "0-9"
              ? "Browse Stores Starting with 0-9"
              : `Browse Stores Starting with ${selectedLetter.toUpperCase()}`
            : "Browse Stores"}
        </h1>
      </header>

      {/* Alphabet Nav */}
      <div className="mb-8 border-b border-gray-200 pb-2 flex overflow-x-auto whitespace-nowrap space-x-4 md:overflow-x-visible md:flex-wrap md:justify-between md:space-x-0">
        <AlphaLink href="/stores" active={!selectedLetter}>
          All
        </AlphaLink>
        {alphabet.map((letter) => (
          <AlphaLink
            key={letter}
            href={`/stores?letter=${letter.toLowerCase()}`}
            active={selectedLetter.toLowerCase() === letter.toLowerCase()}
          >
            {letter}
          </AlphaLink>
        ))}
        <AlphaLink href="/stores?letter=0-9" active={selectedLetter === "0-9"}>
          0-9
        </AlphaLink>
      </div>

      {/* Store Grid */}
      {filteredStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chunkArray(filteredStores, Math.ceil(filteredStores.length / 3)).map(
            (group, idx) => (
              <ul key={idx} className="space-y-3 list-disc list-inside">
                {group.map((store) => (
                  <li key={store._id}>
                    <Link
                      href={`/stores/${store._id}`}
                      className="text-gray-900 hover:text-blue-600 text-lg"
                    >
                      {store.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      ) : (
        <p className="text-gray-500 italic">
          {selectedLetter
            ? `No stores found starting with ${selectedLetter.toUpperCase()}`
            : "No stores available"}
        </p>
      )}
    </div>
  );
}

// Alphabet Link Component
function AlphaLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`transition-colors ${
        active
          ? "font-bold underline underline-offset-4 text-black"
          : "text-gray-600 hover:text-black"
      }`}
    >
      {children}
    </Link>
  );
}

// Helper function
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

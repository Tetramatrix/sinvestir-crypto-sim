"use client";

import { useState, useEffect, useRef } from "react";
import { searchCrypto } from "@/lib/coingecko";
import { Search, X } from "lucide-react";

interface Props {
  value: string;
  label: string;
  image: string;
  onSelect: (id: string, name: string, symbol: string, image: string) => void;
}

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

export default function CryptoSearch({ value, label, image, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(v: string) {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const coins = await searchCrypto(v);
        setResults(coins);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSelect(coin: Coin) {
    onSelect(coin.id, coin.name, coin.symbol, coin.image);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-muted mb-1.5">
        {label}
      </label>
      {value ? (
        <div className="input flex items-center gap-3">
          {image && (
            <img src={image} alt="" className="w-6 h-6 rounded-full" />
          )}
          <span className="flex-1">{value}</span>
          <button
            type="button"
            onClick={() => onSelect("", "", "", "")}
            className="text-muted hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Rechercher une crypto..."
            className="input pl-9"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="spinner" />
            </div>
          )}
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border-custom rounded-xl overflow-hidden shadow-xl max-h-64 overflow-y-auto">
          {results.map((coin) => (
            <button
              key={coin.id}
              type="button"
              onClick={() => handleSelect(coin)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-soft transition-colors text-left"
            >
              <img
                src={coin.image}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <div>
                <div className="text-sm font-medium">{coin.name}</div>
                <div className="text-xs text-muted uppercase">
                  {coin.symbol}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

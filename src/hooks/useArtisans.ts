// src/hooks/useArtisans.ts

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Artisan, Service, ArtisanHours } from "../lib/types";

export function useArtisans() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("artisans")
      .select("*")
      .eq("status", "actif")
      .then(({ data, error }) => {
        if (!error && data) setArtisans(data as Artisan[]);
        setLoading(false);
      });
  }, []);

  return { artisans, loading };
}

export function useArtisan(id: number) {
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<ArtisanHours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      supabase.from("artisans").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("services")
        .select("*")
        .eq("artisan_id", id)
        .eq("is_active", true),
      supabase
        .from("artisan_hours")
        .select("*")
        .eq("artisan_id", id)
        .order("day_index"),
    ]).then(([a, s, h]) => {
      if (a.data) setArtisan(a.data as Artisan);
      if (s.data) setServices(s.data as Service[]);
      if (h.data) setHours(h.data as ArtisanHours[]);
      setLoading(false);
    });
  }, [id]);

  return { artisan, services, hours, loading };
}

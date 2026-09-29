import { supabase, isSupabaseConfigured, localDb } from '../config/supabase.js';

export interface MandiFilterParams {
  commodity?: string;
  state?: string;
  district?: string;
  search?: string;
}

export async function getMandiPrices(filters: MandiFilterParams) {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('mandi_prices').select('*').order('arrival_date', { ascending: false });

    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }
    if (filters.district) {
      query = query.ilike('district', `%${filters.district}%`);
    }
    if (filters.commodity) {
      query = query.ilike('commodity', `%${filters.commodity}%`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  }

  // Fallback to local high-resolution Mandi cache
  let records = [...localDb.mandiPrices];

  if (filters.state) {
    records = records.filter(r => r.state.toLowerCase().includes(filters.state!.toLowerCase()));
  }
  if (filters.district) {
    records = records.filter(r => r.district.toLowerCase().includes(filters.district!.toLowerCase()));
  }
  if (filters.commodity) {
    records = records.filter(r => r.commodity.toLowerCase().includes(filters.commodity!.toLowerCase()));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    records = records.filter(r => 
      r.commodity.toLowerCase().includes(q) ||
      r.market_name.toLowerCase().includes(q) ||
      r.state.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q)
    );
  }

  return records;
}

export async function getMarketTrendsSummary() {
  const all = await getMandiPrices({});
  const totalCommodities = new Set(all.map(a => a.commodity)).size;
  const topGainers = [...all].sort((a, b) => (b.price_change_24h || 0) - (a.price_change_24h || 0)).slice(0, 3);
  const topDecliners = [...all].sort((a, b) => (a.price_change_24h || 0) - (b.price_change_24h || 0)).slice(0, 3);

  return {
    totalRecords: all.length,
    totalCommodities,
    topGainers,
    topDecliners,
    lastRefreshed: new Date().toISOString()
  };
}

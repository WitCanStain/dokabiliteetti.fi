/**
 * NominatimClient — a small wrapper for OpenStreetMap Nominatim Search API.
 *
 * Features:
 * - Search by name, street, postal code, city/town and country
 * - Optionally use structured search or a free-text query
 * - Requests extratags which often include `opening_hours` when available
 * - Returns typed results with numeric latitude/longitude and raw payload
 *
 * Notes:
 * - The public Nominatim server requires a valid HTTP Referer/User-Agent and limits heavy usage.
 * - In browsers CORS and header restrictions may apply. Consider using a small proxy/server-side
 *   component that sets a proper User-Agent for production usage.
 */

export type NominatimSearchParams = {
  name?: string; // establishment name (e.g. "Joe's Bar")
  street?: string; // street address
  postalcode?: string; // postal code
  city?: string; // city / town
  country?: string; // country name or code
  // Use structured search (street/city/postalcode/country) instead of free-text 'q'
  structured?: boolean;
  limit?: number; // max results (default 5)
  countrycodes?: string; // comma separated country codes (e.g. "fi")
  acceptLanguage?: string; // human-language for results (e.g. "fi,en")
  // Optional abort signal for long-running fetches
  signal?: AbortSignal;
};

export type NominatimResult = {
  place_id: string;
  osm_type?: string;
  osm_id?: string;
  lat: number;
  lon: number;
  display_name: string;
  address?: Record<string, string>;
  extratags?: Record<string, string>;
  boundingbox?: [string, string, string, string];
  raw: RawNominatim; // original JSON result
};

/**
 * Minimal typed shape for the raw Nominatim response we access.
 */
export type RawNominatim = {
  lat?: string | number;
  lon?: string | number;
  place_id?: string | number;
  osm_type?: string;
  osm_id?: string | number;
  display_name?: string;
  address?: Record<string, string>;
  extratags?: Record<string, string>;
  boundingbox?: Array<string>;
  [k: string]: unknown;
};

export class NominatimClient {
  private baseUrl: string;

  /**
   * Create a client.
   * @param baseUrl Base URL for Nominatim API. Defaults to the public server.
   */
  constructor(baseUrl = 'https://nominatim.openstreetmap.org') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Search for places. Returns results mapped to NominatimResult.
   */
  async search(params: NominatimSearchParams): Promise<Array<NominatimResult>> {
    const url = new URL(`${this.baseUrl}/search`);

    const limit = params.limit ?? 5;
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('extratags', '1');
    url.searchParams.set('limit', String(limit));

    if (params.countrycodes) {
      url.searchParams.set('countrycodes', params.countrycodes);
    }

    if (params.acceptLanguage) {
      url.searchParams.set('accept-language', params.acceptLanguage);
    }

    // Use structured search when requested and at least one structured field exists
    const hasStructured = params.structured && (params.street || params.postalcode || params.city || params.country);
    if (hasStructured) {
      url.searchParams.set('structured', '1');
      if (params.street) url.searchParams.set('street', params.street);
      if (params.postalcode) url.searchParams.set('postalcode', params.postalcode);
      if (params.city) url.searchParams.set('city', params.city);
      if (params.country) url.searchParams.set('country', params.country);
      // if name provided, put it into "q" so Nominatim can match name with structured fields
      if (params.name) url.searchParams.set('q', params.name);
    } else {
      // free-text query: combine relevant fields in a concise way
      const parts: Array<string> = [];
      if (params.name) parts.push(params.name);
      if (params.street) parts.push(params.street);
      if (params.postalcode) parts.push(params.postalcode);
      if (params.city) parts.push(params.city);
      if (params.country) parts.push(params.country);
      const q = parts.join(', ').trim();
      if (q.length === 0) {
        throw new Error('At least one of name, street, postalcode, city or country must be provided');
      }
      url.searchParams.set('q', q);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json'
      // Note: Browsers disallow setting User-Agent and Referer is controlled by the browser.
      // For server-side usage, users should set a descriptive User-Agent identifying the application.
    };

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers,
      signal: params.signal
    };

    const resp = await fetch(url.toString(), fetchOptions);
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Nominatim search failed: ${resp.status} ${resp.statusText} ${text}`);
    }

    const data = await resp.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: RawNominatim) => {
  const lat = item.lat !== undefined ? Number(String(item.lat)) : NaN;
  const lon = item.lon !== undefined ? Number(String(item.lon)) : NaN;
      const res: NominatimResult = {
        place_id: String(item.place_id ?? item.osm_id ?? ''),
  osm_type: item.osm_type,
  osm_id: item.osm_id !== undefined ? String(item.osm_id) : undefined,
        lat: Number.isFinite(lat) ? lat : NaN,
        lon: Number.isFinite(lon) ? lon : NaN,
        display_name: item.display_name ?? '',
        address: item.address ?? undefined,
        extratags: item.extratags ?? undefined,
        boundingbox: item.boundingbox && item.boundingbox.length >= 4 ? [String(item.boundingbox[0]), String(item.boundingbox[1]), String(item.boundingbox[2]), String(item.boundingbox[3])] : undefined,
        raw: item
      };
      return res;
    });
  }
}

// Example usage (not executed here):
// const c = new NominatimClient();
// const results = await c.search({ name: "Some Bar", city: "Helsinki", countrycodes: "fi", limit: 3 });
// results[0].extratags?.opening_hours // may contain opening_hours string when available

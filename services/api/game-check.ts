// services/game.service.ts
import BaseApiService from "./base";
import { ApiResponse } from "@/lib/types";

/**
 * Request body untuk /game/check
 * - game: slug nama game (dinamis, tidak di-hardcode)
 * - game_id: ID/UID pemain
 * - zone_id: opsional; beberapa game mewajibkan (required_if di backend)
 */
export interface GameCheckRequest {
  game: string;
  game_id: string;
  zone_id?: string;
}

/**
 * Detail akun yang berhasil di-resolve oleh provider
 * Gunakan field opsional agar fleksibel untuk berbagai game.
 */
export interface GameAccountInfo {
  id?: string; // mis. UID/ID akun
  name?: string; // mis. nama/nickname
  server?: string; // mis. "avrora", "lexington", dst (contoh Azur Lane)
  region?: string; // region bila ada
  extra?: Record<string, string | number | boolean | null>; // extensible
}

/**
 * Response terstruktur tanpa 'any'.
 * Sesuaikan dengan pola umum verifikasi akun top-up.
 */
export interface GameCheckResponse {
  game: string;
  game_id: string;
  zone_id?: string;
  is_valid: boolean; // true jika akun ditemukan/valid
  message?: string; // pesan human-readable dari server/provider
  account?: GameAccountInfo; // info akun jika ada
  provider_reference?: string; // ref/id dari provider jika dikirim
}

/**
 * Service untuk endpoint /game/check (POST)
 * Base URL mengikuti pola di CheckoutService.
 */
class GameService extends BaseApiService {
  constructor() {
    super();
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api-topup.naditechno.id/api/v1";
  }

  /**
   * Melakukan pengecekan akun game ke backend.
   * Backend yang menentukan required_if untuk zone_id pada game tertentu.
   */
  async check(data: GameCheckRequest): Promise<ApiResponse<GameCheckResponse>> {
    return this.post<ApiResponse<GameCheckResponse>>("game/check", data);
  }
}

export const gameService = new GameService();
import type { WeatherData } from "@/types/weather.types";

export async function getWeather(cityQuery: string): Promise<WeatherData> {
  const params = new URLSearchParams({ city: cityQuery });
  const response = await fetch(`/api/weather?${params.toString()}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : "Erro ao carregar clima.";
    throw new Error(message);
  }

  return (await response.json()) as WeatherData;
}

import {
  fetchOpenWeather,
  getFetchErrorMessage,
} from "@/lib/openweather-fetch";
import type { WeatherData } from "@/types/weather.types";
import { NextRequest, NextResponse } from "next/server";

interface OpenWeatherResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { description: string }[];
  wind: { speed: number };
  clouds: { all: number };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "OPENWEATHER_API_KEY não configurada no servidor." },
      { status: 500 },
    );
  }

  const city = request.nextUrl.searchParams.get("city");
  if (!city?.trim()) {
    return NextResponse.json(
      { message: "Parâmetro 'city' é obrigatório." },
      { status: 400 },
    );
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", city);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "pt_br");

  let response: Response;
  try {
    response = await fetchOpenWeather(url.toString());
  } catch (error) {
    return NextResponse.json(
      { message: getFetchErrorMessage(error) },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : "Não foi possível obter o clima para esta cidade.";
    return NextResponse.json({ message }, { status: response.status });
  }

  const data = (await response.json()) as OpenWeatherResponse;

  const weather: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0]?.description ?? "",
    humidity: data.main.humidity,
    windKmh: Math.round(data.wind.speed * 3.6),
    cloudsPercent: data.clouds.all,
  };

  return NextResponse.json(weather);
}

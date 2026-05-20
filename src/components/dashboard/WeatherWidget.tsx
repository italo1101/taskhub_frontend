"use client";

import {
  DEFAULT_WEATHER_CITY,
  WEATHER_CITIES,
  WEATHER_CITY_STORAGE_KEY,
  type WeatherCityId,
} from "@/lib/weather-cities";
import * as weatherService from "@/services/weather.service";
import type { WeatherData } from "@/types/weather.types";
import { Cloud, Droplets, Loader2, Wind } from "lucide-react";
import { useEffect, useState } from "react";

const selectClass =
  "mb-3 w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function readStoredCityId(): WeatherCityId {
  if (typeof window === "undefined") return DEFAULT_WEATHER_CITY;
  const stored = localStorage.getItem(WEATHER_CITY_STORAGE_KEY);
  if (stored && WEATHER_CITIES.some((c) => c.id === stored)) {
    return stored as WeatherCityId;
  }
  return DEFAULT_WEATHER_CITY;
}

export default function WeatherWidget() {
  const [cityId, setCityId] = useState<WeatherCityId>(DEFAULT_WEATHER_CITY);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCityId(readStoredCityId());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setWeather(null);

      try {
        const data = await weatherService.getWeather(cityId);
        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        if (!cancelled) {
          setWeather(null);
          setError(
            err instanceof Error ? err.message : "Erro ao carregar clima.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [cityId, hydrated]);

  const handleCityChange = (value: string) => {
    const id = value as WeatherCityId;
    setCityId(id);
    localStorage.setItem(WEATHER_CITY_STORAGE_KEY, id);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5">
      <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
        Clima atual
      </p>

      <label className="sr-only" htmlFor="weather-city">
        Cidade
      </label>
      <select
        id="weather-city"
        value={cityId}
        onChange={(e) => handleCityChange(e.target.value)}
        className={selectClass}
        disabled={isLoading}
      >
        {WEATHER_CITIES.map((city) => (
          <option key={city.id} value={city.id}>
            {city.label}
          </option>
        ))}
      </select>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando…
        </div>
      )}

      {error && !isLoading && (
        <p className="py-4 text-sm text-red-500">{error}</p>
      )}

      {weather && !isLoading && !error && (
        <>
          <p className="text-sm font-medium text-foreground">
            {weather.city}, {weather.country}
          </p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {weather.temperature}°
          </p>
          <p className="text-sm capitalize text-muted-foreground">
            {weather.description}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-4">
            <div className="flex flex-col items-center gap-1">
              <Droplets className="h-4 w-4 text-primary" />
              <span className="text-[10px] text-muted-foreground">Umidade</span>
              <span className="text-xs font-medium text-foreground">
                {weather.humidity}%
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-[10px] text-muted-foreground">Vento</span>
              <span className="text-xs font-medium text-foreground">
                {weather.windKmh} km/h
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Cloud className="h-4 w-4 text-primary" />
              <span className="text-[10px] text-muted-foreground">Nuvens</span>
              <span className="text-xs font-medium text-foreground">
                {weather.cloudsPercent}%
              </span>
            </div>
          </div>
        </>
      )}

      <p className="mt-3 text-[10px] text-muted-foreground">
        Dados via{" "}
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          OpenWeatherMap
        </a>
      </p>
    </div>
  );
}

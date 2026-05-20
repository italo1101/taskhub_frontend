/** Cidades disponíveis no select (query = parâmetro `q` da OpenWeatherMap) */
export const WEATHER_CITIES = [
  { id: "Sao Paulo,BR", label: "São Paulo, SP" },
  { id: "Rio de Janeiro,BR", label: "Rio de Janeiro, RJ" },
  { id: "Belo Horizonte,BR", label: "Belo Horizonte, MG" },
  { id: "Brasilia,BR", label: "Brasília, DF" },
  { id: "Curitiba,BR", label: "Curitiba, PR" },
  { id: "Porto Alegre,BR", label: "Porto Alegre, RS" },
  { id: "Salvador,BR", label: "Salvador, BA" },
  { id: "Recife,BR", label: "Recife, PE" },
  { id: "Fortaleza,BR", label: "Fortaleza, CE" },
  { id: "Manaus,BR", label: "Manaus, AM" },
  { id: "Florianopolis,BR", label: "Florianópolis, SC" },
  { id: "Goiania,BR", label: "Goiânia, GO" },
  { id: "Campinas,BR", label: "Campinas, SP" },
  { id: "Lisbon,PT", label: "Lisboa, PT" },
  { id: "London,GB", label: "Londres, UK" },
  { id: "New York,US", label: "Nova York, EUA" },
] as const;

export type WeatherCityId = (typeof WEATHER_CITIES)[number]["id"];

export const DEFAULT_WEATHER_CITY: WeatherCityId = "Sao Paulo,BR";

export const WEATHER_CITY_STORAGE_KEY = "taskhub_weather_city";

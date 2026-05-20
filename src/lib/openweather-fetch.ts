import https from "node:https";

function shouldSkipTlsVerify(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.WEATHER_INSECURE_TLS === "true"
  );
}

function httpsGet(url: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.get(
      parsed,
      { rejectUnauthorized: !shouldSkipTlsVerify() },
      (res) => {
        let body = "";
        res.on("data", (chunk: Buffer | string) => {
          body += chunk.toString();
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode ?? 500, body });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(15_000, () => {
      req.destroy(new Error("Timeout ao contactar OpenWeatherMap"));
    });
  });
}

/** Compatível com `Response` usado na route. */
export async function fetchOpenWeather(url: string): Promise<Response> {
  const { statusCode, body } = await httpsGet(url);
  return new Response(body, {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

export function getFetchErrorMessage(error: unknown): string {
  const cause = error instanceof Error ? error.cause : undefined;
  const code =
    error instanceof Error && "code" in error
      ? String((error as NodeJS.ErrnoException).code)
      : cause &&
          typeof cause === "object" &&
          "code" in cause
        ? String((cause as NodeJS.ErrnoException).code)
        : null;

  if (code === "SELF_SIGNED_CERT_IN_CHAIN") {
    return (
      "Falha de certificado SSL ao contactar OpenWeatherMap (proxy/antivírus corporativo). " +
      "Em desenvolvimento, adicione WEATHER_INSECURE_TLS=true no .env e reinicie o servidor."
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Não foi possível obter o clima. Verifique sua conexão.";
}

import { NextResponse } from "next/server";
import { makeBadge, type Format } from "badge-maker";
import { STATUS_COLOR, STATUS_DISPLAY } from "../status-config";

const noCacheHeaders = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": "no-cache, no-store, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const ALLOWED_STYLES: Array<Format["style"]> = [
  "flat",
  "flat-square",
  "plastic",
  "for-the-badge",
  "social",
];

export const GET = async (
  _req: Request,
  context: { params: { app_uuid: string } } | { params: Promise<{ app_uuid: string }> }
) => {
  const reqUrl = new URL(_req.url);
  const labelFromQuery = reqUrl.searchParams.get("label")?.trim();
  const styleFromQuery = reqUrl.searchParams.get("style")?.toLowerCase();
  const typeFromQuery = reqUrl.searchParams.get("type")?.toLowerCase();
  const debug = reqUrl.searchParams.has("debug");
  const coolifyUrl = process.env.COOLIFY_API_URL;
  const apiToken = process.env.API_TOKEN;
  const leftText = labelFromQuery || process.env.BADGE_LABEL || "deploy";
  const envStyle = process.env.BADGE_STYLE?.toLowerCase();

  if (!coolifyUrl || !apiToken) {
    return new NextResponse("missing env", { status: 500 });
  }

  const { app_uuid } = await (context as any).params;
  const endpoints: Array<{ label: string; url: string; parse: (data: any, respOk: boolean) => string }> = [];

  const addDeployment = (resource: "applications" | "services") => {
    endpoints.push({
      label: `deployments:${resource}`,
      url: `${coolifyUrl}/api/v1/deployments/${resource}/${app_uuid}`,
      parse: (data, respOk) =>
        data?.deployments?.[0]?.status ??
        data?.status ??
        data?.application?.status ??
        data?.service?.status ??
        (respOk ? "no_history" : "offline"),
    });
  };

  const addDetail = (resource: "applications" | "services") => {
    endpoints.push({
      label: `${resource}:detail`,
      url: `${coolifyUrl}/api/v1/${resource}/${app_uuid}`,
      parse: (data, respOk) =>
        data?.status ??
        data?.application?.status ??
        data?.service?.status ??
        data?.current_release?.status ??
        data?.latest_deployment?.status ??
        (respOk ? "no_history" : "offline"),
    });
  };

  if (typeFromQuery === "service") {
    addDeployment("services");
    addDetail("services");
  } else if (typeFromQuery === "application") {
    addDeployment("applications");
    addDetail("applications");
  } else {
    addDeployment("applications");
    addDeployment("services");
    addDetail("services");
    addDetail("applications");
  }

  let status = "offline";
  const attempts: Array<{
    resource: string;
    url: string;
    statusCode?: number;
    candidate?: string;
    fields?: Record<string, unknown>;
    error?: unknown;
  }> = [];

  for (const [index, endpoint] of endpoints.entries()) {
    try {
      const resp = await fetch(endpoint.url, {
        headers: { Authorization: `Bearer ${apiToken}` },
        cache: "no-store",
      });

      const attemptBase = { resource: endpoint.label, url: endpoint.url, statusCode: resp.status };

      if (resp.status === 401) {
        attempts.push(attemptBase);
        status = "unauthorized";
        break;
      }

      if (resp.status === 404) {
        attempts.push(attemptBase);
        continue;
      }

      const data = await resp.json().catch(() => null as unknown);
      const candidate = endpoint.parse(data, resp.ok);

      attempts.push({
        ...attemptBase,
        candidate,
        fields: {
          deployments0: data?.deployments?.[0]?.status,
          status: data?.status,
          applicationStatus: data?.application?.status,
          serviceStatus: data?.service?.status,
          currentReleaseStatus: data?.current_release?.status,
          latestDeploymentStatus: data?.latest_deployment?.status,
        },
      });

      const hasNext = index < endpoints.length - 1;
      const looksEmpty = candidate === "offline" || candidate === "no_history";

      if (hasNext && looksEmpty) {
        continue;
      }

      status = candidate;
      break;
    } catch (error) {
      console.error("request error", { endpoint: endpoint.label, error });
      attempts.push({ resource: endpoint.label, url: endpoint.url, error: String(error) });
      status = "offline";
    }
  }

  const color = STATUS_COLOR[status] ?? "#cea61b";
  const statusText = STATUS_DISPLAY[status] ?? status.replace(/_/g, " ");
  const chosenStyle = (styleFromQuery || envStyle) as Format["style"];
  const style = ALLOWED_STYLES.includes(chosenStyle) ? chosenStyle : "flat";

  const format: Format = {
    label: leftText,
    message: statusText,
    color,
    labelColor: "#555",
    style,
  };

  const svg = makeBadge(format);

  if (debug) {
    return NextResponse.json({ status, attempts }, { status: 200, headers: { "Cache-Control": "no-cache" } });
  }

  return new NextResponse(svg, { status: 200, headers: noCacheHeaders });
};

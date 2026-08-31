import { fallbackHotspots } from "../data/fallbackHotspots";

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

const query = `
[out:json][timeout:25];
(
  node["amenity"~"restaurant|fast_food"]["name"~"Takumi|Oblique|Sojubar|Shabu|Sumo",i](51.885,4.420,51.950,4.545);
  way["amenity"~"restaurant|fast_food"]["name"~"Takumi|Oblique|Sojubar|Shabu|Sumo",i](51.885,4.420,51.950,4.545);
  relation["amenity"~"restaurant|fast_food"]["name"~"Takumi|Oblique|Sojubar|Shabu|Sumo",i](51.885,4.420,51.950,4.545);
);
out center 30;
`;

function toHotspot(element) {
    const latitude = element.lat || element.center?.lat;
    const longitude = element.lon || element.center?.lon;
    const name = element.tags?.name;

    if (!name || !latitude || !longitude) {
        return null;
    }

    return {
        id: `osm-${element.type}-${element.id}`,
        name,
        category: element.tags.tourism || element.tags.amenity || "hotspot",
        latitude,
        longitude,
        description:
            element.tags.description ||
            element.tags["description:nl"] ||
            element.tags.wikipedia ||
            element.tags.website ||
            "Restaurant-hotspot uit OpenStreetMap-data in Rotterdam.",
        source: "Overpass API / OpenStreetMap",
    };
}

function mergeRequiredRestaurants(onlineHotspots) {
    const merged = [...onlineHotspots];
    for (const fallback of fallbackHotspots) {
        const hasRestaurant = merged.some((hotspot) => {
            const onlineName = hotspot.name.toLowerCase();
            const fallbackName = fallback.name.toLowerCase().replace(" rotterdam", "");
            return onlineName.includes(fallbackName) || fallbackName.includes(onlineName);
        });
        if (!hasRestaurant) {
            merged.push(fallback);
        }
    }
    return merged;
}

export async function loadHotspots(cachedHotspots = []) {
    try {
        const response = await fetch(`${OVERPASS_ENDPOINT}?data=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Overpass returned ${response.status}`);
        }

        const json = await response.json();
        const onlineHotspots = (json.elements || [])
            .map(toHotspot)
            .filter(Boolean)
            .filter((hotspot, index, list) => list.findIndex((item) => item.name === hotspot.name) === index)
            .sort((a, b) => a.name.localeCompare(b.name));

        const hotspots = mergeRequiredRestaurants(onlineHotspots).slice(0, 30);

        if (!hotspots.length) {
            throw new Error("No hotspots found in online response");
        }

        return { hotspots, source: "online" };
    } catch (error) {
        console.log("Online hotspot load failed", error);
        if (cachedHotspots.length) {
            return { hotspots: cachedHotspots, source: "cache" };
        }
        return { hotspots: fallbackHotspots, source: "fallback" };
    }
}

export function formatDistance(meters) {
    if (!Number.isFinite(meters)) {
        return "";
    }
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
}

export function getDistanceInMeters(from, to) {
    if (!from || !to) {
        return null;
    }

    const earthRadius = 6371000;
    const toRadians = (value) => (value * Math.PI) / 180;
    const dLat = toRadians(to.latitude - from.latitude);
    const dLon = toRadians(to.longitude - from.longitude);
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

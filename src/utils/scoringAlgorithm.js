/**
 * Floripa Hiking Pro - Trail Scoring Algorithm
 * 
 * Calculates a 0-100 safety score for a trail based on weather and alerts.
 * 
 * @param {Object} trail - The trail object with { technical: { exposure, shadeLevel, landslideRisk } }
 * @param {Object} weather - { current: { temperature_2m, wind_speed_10m, precipitation, weather_code }, recentRain24h: number }
 * @param {Array} alerts - Array of { severity: 'high'|'medium', type: string }
 * 
 * @returns {Object} { score: number, status: string, reasons: string[] }
 */
export function calculateTrailScore(trail, weather, alerts = []) {
    if (!trail || !trail.technical || !weather || !weather.current) {
        return { score: 0, status: 'NODATA', reasons: ['Нет данных о погоде'] };
    }

    const { temperature_2m: temp, wind_speed_10m: wind, precipitation: rainNow, weather_code: code } = weather.current;
    const rain24h = weather.recentRain24h || 0;
    const { exposure, shadeLevel, landslideRisk } = trail.technical;

    let score = 70; // Base score
    let reasons = [];

    // --- 1. OFFICIAL ALERT GATE ---
    // If there's a high severity alert, cap the score immediately.
    const highAlert = alerts.find(a => a.severity === 'high');
    if (highAlert) {
        score = Math.min(score, 20);
        reasons.push(`🔴 ТРЕВОГА: ${highAlert.type}`);
        return finalizeScore(score, reasons);
    }

    // --- 2. WIND PENALTY ---
    let windPenalty = 0;
    if (wind >= 40) windPenalty = 35;
    else if (wind >= 30) windPenalty = 25;
    else if (wind >= 20) windPenalty = 10;

    // Exposure multiplier
    let exposureMult = 1.0;
    if (exposure === 'coastal' || exposure === 'ridge') exposureMult = 1.2;
    if (exposure === 'forest') exposureMult = 0.7;

    const totalWindPenalty = windPenalty * exposureMult;
    if (totalWindPenalty > 0) {
        score -= totalWindPenalty;
        reasons.push(`💨 Сильный ветер ${Math.round(wind)} км/ч (-${Math.round(totalWindPenalty)})`);
    }

    // --- 3. RAIN PENALTY ---
    let rainPenalty = 0;
    // Rain now
    if (rainNow > 0.5) {
        rainPenalty += 20;
        reasons.push(`🌧️ Идет дождь (-20)`);
    }
    // Rain 24h
    if (rain24h >= 30) {
        rainPenalty += 30;
        reasons.push(`💧 Сильные дожди 24ч (-30)`);
    } else if (rain24h >= 15) {
        rainPenalty += 20;
    } else if (rain24h >= 5) {
        rainPenalty += 10;
    }

    // Landslide amplifier
    if (landslideRisk && rain24h >= 15) {
        rainPenalty *= 1.5;
        reasons.push(`⚠️ Риск оползней`);
    }

    if (rainPenalty > 0) {
        score -= rainPenalty;
    }

    // --- 4. HEAT PENALTY ---
    let heatPenalty = 0;
    if (temp >= 34) heatPenalty = 25;
    else if (temp >= 30) heatPenalty = 15;
    else if (temp >= 27) heatPenalty = 7;

    let shadeMult = 1.0;
    if (shadeLevel === 'high') shadeMult = 0.6;
    if (shadeLevel === 'low') shadeMult = 1.3;

    const totalHeatPenalty = heatPenalty * shadeMult;
    if (totalHeatPenalty > 0) {
        score -= totalHeatPenalty;
        reasons.push(`🔥 Жара (-${Math.round(totalHeatPenalty)})`);
    }

    // --- 5. THUNDERSTORM RISK ---
    // Codes: 95, 96, 99 are thunderstorms
    if ([95, 96, 99].includes(code)) {
        score -= 30;
        reasons.push(`⚡ Гроза (-30)`);
    }

    // Final Clamping
    return finalizeScore(score, reasons);
}

function finalizeScore(rawScore, reasons) {
    const score = Math.max(0, Math.min(100, Math.round(rawScore)));

    let status = 'NOT_RECOMMENDED';
    let label = 'НЕ РЕКОМЕНДУЕТСЯ';
    let color = 'red';

    if (score >= 75) {
        status = 'RECOMMENDED';
        label = 'РЕКОМЕНДУЕТСЯ';
        color = 'green';
    } else if (score >= 50) {
        status = 'CAUTION';
        label = 'С ОСТОРОЖНОСТЬЮ';
        color = 'yellow';
    }

    return {
        score,
        status, // machine readable
        label,  // human readable
        color,  // UI hint
        reasons
    };
}

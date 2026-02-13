const axios = require('axios');
require('dotenv').config();

const client_id = process.env.EXPO_PUBLIC_SIMKL_CLIENT_ID;

if (!client_id) {
    console.error("Missing EXPO_PUBLIC_SIMKL_CLIENT_ID in .env");
    process.exit(1);
}

const simklClient = axios.create({
    baseURL: 'https://api.simkl.com',
    headers: { 'Content-Type': 'application/json' },
});

// Mock helpers from simkl.ts
const formatRuntime = (minutes) => {
    if (!minutes || minutes <= 0) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
};

const formatCurrency = (amount) => {
    if (!amount || amount <= 0) return 'N/A';
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
};

async function run() {
    console.log("=== Debugging Movie Details Mapping ===");

    // 1. Fetch a trending movie ID
    const trendingRes = await simklClient.get('/movies/trending', {
        params: { client_id, interval: 'week' }
    });
    const firstMovie = trendingRes.data[0];
    const movieId = firstMovie.ids.simkl_id || firstMovie.ids.simkl;
    console.log(`Testing with Movie: "${firstMovie.title}" (ID: ${movieId})`);

    // 2. Fetch details using the EXACT params from simkl.ts
    try {
        const { data } = await simklClient.get(`/movies/${movieId}`, {
            params: { extended: 'full,cast,recommendations', client_id }
        });

        console.log("\n--- Raw Data Checks ---");
        console.log("data.budget:", data.budget, "(Type:", typeof data.budget, ")");
        console.log("data.runtime:", data.runtime, "(Type:", typeof data.runtime, ")");
        console.log("data.ratings.simkl.rating:", data.ratings?.simkl?.rating);
        console.log("data.year:", data.year);
        console.log("data.genres (sample):", JSON.stringify(data.genres?.[0]));

        // 3. Replicate Mapping
        const movie = {
            id: data.ids?.simkl,
            title: data.title,
            year: data.year?.toString() ?? '',
            runtime: formatRuntime(data.runtime),
            rating: data.ratings?.simkl?.rating || 0,
            budget: formatCurrency(data.budget),
            revenue: formatCurrency(data.revenue),
            genres: data.genres || [],
        };

        console.log("\n--- Mapped Movie Object ---");
        console.log("movie.budget:", `"${movie.budget}"`);
        console.log("movie.runtime:", `"${movie.runtime}"`);

        // 4. Test isMovie logic
        const isMovie = 'budget' in movie;
        console.log("isMovie check ('budget' in movie):", isMovie);

        if (!isMovie) {
            console.error("❌ CRITICAL: isMovie check FAILED! 'budget' key missing?");
        } else {
            console.log("✅ isMovie check PASSED");
        }

        if (movie.budget === 'N/A') {
            console.warn("⚠️ Warning: Budget is 'N/A'. This is valid layout-wise but means no budget data.");
        }

    } catch (e) {
        console.error("API Call Failed:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

run().catch(console.error);

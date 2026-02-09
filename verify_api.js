const axios = require('axios');

const CLIENT_ID = 'bf711694f43a8ce409e5492957b4f3d07ac5eda293f4d14d967c55cac72f6e4e';

const simklClient = axios.create({
    baseURL: 'https://api.simkl.com',
    headers: {
        // 'simkl-api-key': CLIENT_ID, // Try commenting out header if it fails, but keep for now
        'Content-Type': 'application/json',
    },
});

async function test() {
    console.log('Starting verification...');

    // Test 1: Trending Movies (Hero)
    try {
        console.log('\nTesting Trending (Hero)...');
        const res1 = await simklClient.get('/movies/trending', {
            params: {
                client_id: CLIENT_ID,
                wltime: 'today',
                extended: 'overview,metadata,tmdb,genres,trailer'
            }
        });
        console.log('Trending Status:', res1.status);
        console.log('Trending Data Type:', Array.isArray(res1.data) ? 'Array' : typeof res1.data);
        if (Array.isArray(res1.data)) console.log('Trending Items:', res1.data.length);
    } catch (e) {
        console.error('Trending Failed:', e.message, e.response?.status, e.response?.data);
    }

    // Test 2: Top Rated (Trending Rank)
    try {
        console.log('\nTesting Top Rated...');
        const res2 = await simklClient.get('/movies/trending', {
            params: {
                client_id: CLIENT_ID,
                sort: 'rank',
                extended: 'overview,metadata,tmdb,genres,poster,fanart'
            }
        });
        console.log('Top Rated Status:', res2.status);
        console.log('Top Rated Items:', Array.isArray(res2.data) ? res2.data.length : 0);
    } catch (e) {
        console.error('Top Rated Failed:', e.message, e.response?.status);
    }

    // Test 3: Search
    try {
        console.log('\nTesting Search...');
        const res3 = await simklClient.get('/search/movie', {
            params: {
                client_id: CLIENT_ID,
                q: 'inception',
                extended: 'full'
            }
        });
        console.log('Search Status:', res3.status);
        console.log('Search Items:', Array.isArray(res3.data) ? res3.data.length : 0);
    } catch (e) {
        console.error('Search Failed:', e.message, e.response?.status);
    }

    // Test 4: Genre (Action)
    try {
        console.log('\nTesting Genre (Action)...');
        // Original endpoint: /movies/genres/${genreSlug}/all-types/all-countries/all-years/popular-today
        const genreSlug = 'action';
        const res4 = await simklClient.get(`/movies/genres/${genreSlug}/all-types/all-countries/all-years/popular-today`, {
            params: { client_id: CLIENT_ID, limit: 10 }
        });
        console.log('Genre Status:', res4.status);
        console.log('Genre Items:', Array.isArray(res4.data) ? res4.data.length : 0);
    } catch (e) {
        console.error('Genre Failed:', e.message, e.response?.status);
    }

    // Test 5: Movie Details (Slug vs ID)
    try {
        console.log('\nTesting Details (Slug: inception)...');
        const res5 = await simklClient.get(`/movies/inception`, { params: { client_id: CLIENT_ID } });
        console.log('Details (Slug) Status:', res5.status);
    } catch (e) {
        console.error('Details (Slug) Failed:', e.message, e.response?.status);
    }

    try {
        console.log('\nTesting Details (ID: 53536)...');
        const res6 = await simklClient.get(`/movies/53536`, { params: { client_id: CLIENT_ID } });
        console.log('Details (ID) Status:', res6.status);
    } catch (e) {
        console.error('Details (ID) Failed:', e.message, e.response?.status);
    }
}

test();

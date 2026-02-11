export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    const { endpoint } = req.query;
    
    // Validate endpoint
    if (!endpoint) {
        return res.status(400).json({ error: 'Missing endpoint parameter' });
    }
    
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    
    if (!TMDB_API_KEY) {
        console.error('TMDB_API_KEY not configured in environment variables');
        return res.status(500).json({ 
            error: 'API key not configured',
            hint: 'Add TMDB_API_KEY to your Vercel environment variables'
        });
    }
    
    try {
        // Clean the endpoint
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        
        // Build URL
        const url = new URL(`${TMDB_BASE_URL}${cleanEndpoint}`);
        url.searchParams.append('api_key', TMDB_API_KEY);
        
        // Add other query parameters
        Object.keys(req.query).forEach(key => {
            if (key !== 'endpoint') {
                url.searchParams.append(key, req.query[key]);
            }
        });
        
        console.log('Fetching from TMDB:', url.toString().replace(TMDB_API_KEY, 'HIDDEN'));
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Check for TMDB API errors
        if (data.success === false) {
            return res.status(400).json({ 
                error: data.status_message || 'TMDB API error',
                status_code: data.status_code
            });
        }
        
        res.status(200).json(data);
    } catch (error) {
        console.error('TMDB API proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch from TMDB',
            details: error.message 
        });
    }
}
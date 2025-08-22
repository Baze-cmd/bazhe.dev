import type { APIRoute } from 'astro';

const domains = ['https://bazhe.dev', 'https://chess.bazhe.dev'];

export const GET: APIRoute = async () => {
    try {
        const results = await Promise.all(
            domains.map(async (domain) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const response = await fetch(`${domain}/api/info`, {
                        signal: controller.signal,
                        headers: {
                            'User-Agent': 'Personal-Website-Checker',
                        },
                    });

                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const data = await response.json();
                        return data;
                    }
                } catch (error) {
                    console.error(`Failed to fetch info for ${domain}:`, error);
                }
                return null;
            })
        );

        const validServices = results.filter(Boolean);

        return new Response(JSON.stringify({ services: validServices }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch services' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
};

export const OPTIONS: APIRoute = () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};

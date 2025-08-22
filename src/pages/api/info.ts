import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
    return new Response(
        JSON.stringify({
            name: 'Personal website',
            description: 'This app',
            domain: url.origin,
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
};

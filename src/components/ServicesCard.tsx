import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Service {
    name: string;
    description: string;
    domain: string;
}

export default function ServicesCard() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use the proxy endpoint instead of direct calls
                const response = await fetch('/api/services');

                if (response.ok) {
                    const data = await response.json();
                    setServices(data.services || []);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (err) {
                setError('Failed to load services');
                console.error('Error fetching services:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <Card className="relative z-10 bg-gray-800/80 border-gray-700 backdrop-blur-sm max-w-lg w-full">
            <CardHeader>
                <CardTitle className="text-white text-center">Currently live apps</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="text-center text-gray-400 py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        Loading services...
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-400 py-8">
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && services.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No services available at the moment.
                    </div>
                )}

                {!loading && !error && services.length > 0 && (
                    <ul className="space-y-3 divide-y divide-gray-700">
                        {services.map((service, index) => (
                            <li key={index} className="text-white pt-3 first:pt-0">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <a
                                            href={service.domain}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline font-medium text-base"
                                        >
                                            {service.name}
                                        </a>
                                        <p className="text-gray-400 mt-1">{service.description}</p>
                                    </div>
                                    <a
                                        href={service.domain}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-400 font-mono shrink-0 hover:text-green-300 transition-colors text-sm"
                                    >
                                        {new URL(service.domain).hostname}
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

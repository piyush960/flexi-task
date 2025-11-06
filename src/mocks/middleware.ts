import { HttpResponse } from "msw"

export function withAuth(resolver) {
    return (input) => {
        const { request } = input
        const token = request.headers.get('authorization') as string;

        if (!token || !token.includes('mock-jwt-token-')) {
            return new HttpResponse(null, { status: 401 });
        }

        return resolver(input)
    }
}
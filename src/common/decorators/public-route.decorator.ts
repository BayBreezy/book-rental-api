import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
/**
 * Custom decorator to mark a route as public
 *
 * Routes/Resolvers with this decorator will not require authentication
 */
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);

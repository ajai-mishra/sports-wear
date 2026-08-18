export const SESSION_COOKIE_NAME = "sw_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export const GUEST_CART_STORAGE_KEY = "sw_cart";
export const GUEST_WISHLIST_STORAGE_KEY = "sw_wishlist";

export const AUTH_GATED_ROUTE_PREFIXES = ["/checkout", "/account"] as const;
export const ADMIN_ROUTE_PREFIX = "/admin";
export const LOGIN_ROUTE = "/login";
export const ADMIN_LOGIN_ROUTE = "/admin/login";

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PRODUCT_IMAGES = 8;

export const PASSWORD_MIN_LENGTH = 8;
export const MOCK_OTP_CODE = "123456";

export const FREE_SHIPPING_THRESHOLD = 2000;
export const STANDARD_SHIPPING_FEE = 99;

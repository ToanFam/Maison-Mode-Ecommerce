package com.maisonmode.util;

public final class SearchUtils {

    private SearchUtils() {
    }

    public static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    public static boolean hasText(String value) {
        return !normalize(value).isBlank();
    }

    public static String like(String value) {
        return "%" + normalize(value) + "%";
    }
}

package com.maisonmode.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginationUtils {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 12;
    private static final int MAX_SIZE = 100;

    private PaginationUtils() {
    }

    public static Pageable sanitize(Pageable pageable, Sort fallbackSort) {
        if (pageable == null || pageable.isUnpaged()) {
            return PageRequest.of(DEFAULT_PAGE, DEFAULT_SIZE, fallbackSort);
        }
        int page = Math.max(pageable.getPageNumber(), DEFAULT_PAGE);
        int requestedSize = pageable.getPageSize();
        int size = Math.min(Math.max(requestedSize, 1), MAX_SIZE);
        Sort sort = pageable == null || pageable.getSort().isUnsorted() ? fallbackSort : pageable.getSort();
        return PageRequest.of(page, size, sort);
    }
}

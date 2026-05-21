package com.maisonmode.validator;

import com.maisonmode.dto.ProductRequest;
import com.maisonmode.exception.BusinessRuleException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class ProductValidator {

    public void validate(ProductRequest request) {
        if (request.compareAtPrice().compareTo(BigDecimal.ZERO) > 0
                && request.compareAtPrice().compareTo(request.price()) < 0) {
            throw new BusinessRuleException("Compare at price cannot be lower than price");
        }
        if (request.sizes().stream().anyMatch(String::isBlank)) {
            throw new BusinessRuleException("Product sizes cannot contain blanks");
        }
        if (request.colors().stream().anyMatch(String::isBlank)) {
            throw new BusinessRuleException("Product colors cannot contain blanks");
        }
    }
}

package com.maisonmode.validator;

import com.maisonmode.entity.Product;
import com.maisonmode.exception.BusinessRuleException;
import com.maisonmode.exception.ConflictException;
import org.springframework.stereotype.Component;

@Component
public class CartValidator {

    public void validatePurchasable(Product product) {
        if (!product.isActive()) {
            throw new BusinessRuleException("Product is not available");
        }
    }

    public void validateVariant(Product product, String size, String color) {
        if (!product.getSizes().contains(size) || !product.getColors().contains(color)) {
            throw new BusinessRuleException("Selected product variant is not available");
        }
    }

    public void validateStock(Product product, int quantity) {
        if (product.getStockQuantity() < quantity) {
            throw new ConflictException("Product stock is not sufficient");
        }
    }
}

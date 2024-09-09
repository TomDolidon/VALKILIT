package com.valkylit.domain.enumeration;

/**
 * The PurchaseCommandStatus enumeration.
 */
public enum PurchaseCommandStatus {
    DRAFT,
    ORDERED,
    PREPARING,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    RETURN_REQUESTED,
    RETURNED,
    REFUNDED,
    FAILED_PAYMENT,
}

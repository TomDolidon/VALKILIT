package com.valkylit.service.dto;

import java.util.UUID;

public class PurchaseCommandInvalidLineDTO {

    private UUID id;
    private String title;
    private Integer stock;
    private UUID purchaseCommandLineId;
    private Integer purchaseCommandQuantity;
    private Float purchaseCommandUnitPrice;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public UUID getPurchaseCommandLineId() {
        return purchaseCommandLineId;
    }

    public void setPurchaseCommandLineId(UUID purchaseCommandLineId) {
        this.purchaseCommandLineId = purchaseCommandLineId;
    }

    public Integer getPurchaseCommandQuantity() {
        return purchaseCommandQuantity;
    }

    public void setPurchaseCommandQuantity(Integer purchaseCommandQuantity) {
        this.purchaseCommandQuantity = purchaseCommandQuantity;
    }

    public Float getPurchaseCommandUnitPrice() {
        return purchaseCommandUnitPrice;
    }

    public void setPurchaseCommandUnitPrice(Float purchaseCommandUnitPrice) {
        this.purchaseCommandUnitPrice = purchaseCommandUnitPrice;
    }
}

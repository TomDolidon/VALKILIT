package com.valkylit.domain;

import java.util.UUID;

public class PurchaseCommandLineTransaction {

    private UUID bookId = null;
    private Integer quantity;

    public PurchaseCommandLineTransaction(UUID bookId, int quantity) {
        this.bookId = bookId;
        this.quantity = quantity;
    }

    public UUID getBookId() {
        return bookId;
    }

    public void setBookId(UUID bookId) {
        this.bookId = bookId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

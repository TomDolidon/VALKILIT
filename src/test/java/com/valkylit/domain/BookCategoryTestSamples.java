package com.valkylit.domain;

import java.util.UUID;

public class BookCategoryTestSamples {

    public static BookCategory getBookCategorySample1() {
        return new BookCategory().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).name("name1");
    }

    public static BookCategory getBookCategorySample2() {
        return new BookCategory().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).name("name2");
    }

    public static BookCategory getBookCategoryRandomSampleGenerator() {
        return new BookCategory().id(UUID.randomUUID()).name(UUID.randomUUID().toString());
    }
}

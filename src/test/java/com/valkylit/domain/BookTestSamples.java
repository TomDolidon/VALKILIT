package com.valkylit.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class BookTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Book getBookSample1() {
        return new Book()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .title("title1")
            .subtitle("subtitle1")
            .imageUri("imageUri1")
            .isbn("isbn1")
            .stock(1)
            .pageCount(1);
    }

    public static Book getBookSample2() {
        return new Book()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .title("title2")
            .subtitle("subtitle2")
            .imageUri("imageUri2")
            .isbn("isbn2")
            .stock(2)
            .pageCount(2);
    }

    public static Book getBookRandomSampleGenerator() {
        return new Book()
            .id(UUID.randomUUID())
            .title(UUID.randomUUID().toString())
            .subtitle(UUID.randomUUID().toString())
            .imageUri(UUID.randomUUID().toString())
            .isbn(UUID.randomUUID().toString())
            .stock(intCount.incrementAndGet())
            .pageCount(intCount.incrementAndGet());
    }
}

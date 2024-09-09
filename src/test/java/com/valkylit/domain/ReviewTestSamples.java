package com.valkylit.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class ReviewTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Review getReviewSample1() {
        return new Review().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).rating(1);
    }

    public static Review getReviewSample2() {
        return new Review().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).rating(2);
    }

    public static Review getReviewRandomSampleGenerator() {
        return new Review().id(UUID.randomUUID()).rating(intCount.incrementAndGet());
    }
}

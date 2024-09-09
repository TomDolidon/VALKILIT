package com.valkylit.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class PurchaseCommandLineTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static PurchaseCommandLine getPurchaseCommandLineSample1() {
        return new PurchaseCommandLine().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).quantity(1);
    }

    public static PurchaseCommandLine getPurchaseCommandLineSample2() {
        return new PurchaseCommandLine().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).quantity(2);
    }

    public static PurchaseCommandLine getPurchaseCommandLineRandomSampleGenerator() {
        return new PurchaseCommandLine().id(UUID.randomUUID()).quantity(intCount.incrementAndGet());
    }
}

package com.valkylit.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class AddressTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Address getAddressSample1() {
        return new Address()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .street("street1")
            .postalCode(1)
            .city("city1")
            .country("country1");
    }

    public static Address getAddressSample2() {
        return new Address()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .street("street2")
            .postalCode(2)
            .city("city2")
            .country("country2");
    }

    public static Address getAddressRandomSampleGenerator() {
        return new Address()
            .id(UUID.randomUUID())
            .street(UUID.randomUUID().toString())
            .postalCode(intCount.incrementAndGet())
            .city(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString());
    }
}

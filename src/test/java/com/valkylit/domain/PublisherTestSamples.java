package com.valkylit.domain;

import java.util.UUID;

public class PublisherTestSamples {

    public static Publisher getPublisherSample1() {
        return new Publisher().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).name("name1");
    }

    public static Publisher getPublisherSample2() {
        return new Publisher().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).name("name2");
    }

    public static Publisher getPublisherRandomSampleGenerator() {
        return new Publisher().id(UUID.randomUUID()).name(UUID.randomUUID().toString());
    }
}

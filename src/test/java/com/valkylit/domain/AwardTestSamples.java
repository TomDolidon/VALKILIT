package com.valkylit.domain;

import java.util.UUID;

public class AwardTestSamples {

    public static Award getAwardSample1() {
        return new Award().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).name("name1");
    }

    public static Award getAwardSample2() {
        return new Award().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).name("name2");
    }

    public static Award getAwardRandomSampleGenerator() {
        return new Award().id(UUID.randomUUID()).name(UUID.randomUUID().toString());
    }
}

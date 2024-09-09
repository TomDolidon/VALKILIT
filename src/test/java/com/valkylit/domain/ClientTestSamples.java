package com.valkylit.domain;

import java.util.UUID;

public class ClientTestSamples {

    public static Client getClientSample1() {
        return new Client().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"));
    }

    public static Client getClientSample2() {
        return new Client().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"));
    }

    public static Client getClientRandomSampleGenerator() {
        return new Client().id(UUID.randomUUID());
    }
}

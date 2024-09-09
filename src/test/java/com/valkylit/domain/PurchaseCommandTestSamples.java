package com.valkylit.domain;

import java.util.UUID;

public class PurchaseCommandTestSamples {

    public static PurchaseCommand getPurchaseCommandSample1() {
        return new PurchaseCommand().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"));
    }

    public static PurchaseCommand getPurchaseCommandSample2() {
        return new PurchaseCommand().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"));
    }

    public static PurchaseCommand getPurchaseCommandRandomSampleGenerator() {
        return new PurchaseCommand().id(UUID.randomUUID());
    }
}

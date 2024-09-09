package com.valkylit.domain;

import java.util.UUID;

public class AuthorTestSamples {

    public static Author getAuthorSample1() {
        return new Author().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).name("name1");
    }

    public static Author getAuthorSample2() {
        return new Author().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).name("name2");
    }

    public static Author getAuthorRandomSampleGenerator() {
        return new Author().id(UUID.randomUUID()).name(UUID.randomUUID().toString());
    }
}

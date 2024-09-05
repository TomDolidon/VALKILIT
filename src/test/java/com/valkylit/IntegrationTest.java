package com.valkylit;

import com.valkylit.config.AsyncSyncConfiguration;
import com.valkylit.config.EmbeddedElasticsearch;
import com.valkylit.config.EmbeddedSQL;
import com.valkylit.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@EmbeddedElasticsearch
@SpringBootTest(classes = { ValkylitApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class })
@EmbeddedSQL
public @interface IntegrationTest {
}
